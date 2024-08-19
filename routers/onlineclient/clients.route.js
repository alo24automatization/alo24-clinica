const axios = require("axios");
const config = require("config");
const {Product} = require("../../models/Warehouse/Product");
const {Clinica} = require("../../models/DirectorAndClinica/Clinica");
require("../../models/Services/Department");
const {User} = require("../../models/Users");
const {
    OnlineClient, validateOnlineClient,
} = require("../../models/OnlineClient/OnlineClient");
const {OfflineService} = require("../../models/OfflineClient/OfflineService");
const {OfflineClient} = require("../../models/OfflineClient/OfflineClient");

const handleSend = async (smsKey, number, message) => {
    await axios
        .get(`https://smsapp.uz/new/services/send.php?key=${smsKey}&number=${number}&message=${message}`)
        .then(() => {
            console.log("message sended!");
        })
        .catch((err) => {
            console.log("Error: ", err.message);
        });
};

async function isQueueNumberExists(queueNumber, brondate, bronTime, department) {
    const startOfDay = new Date(brondate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(brondate);
    endOfDay.setHours(23, 59, 59, 999);
    let existingClient;
    if (queueNumber) {
        existingClient = await OnlineClient.findOne({
            department,
            queue: queueNumber, brondate: {$gte: startOfDay, $lt: endOfDay},
        }).exec() || await OfflineService.findOne({
            department,
            turn: queueNumber, createdAt: {$gte: startOfDay, $lt: endOfDay}
        }).exec();
    } else if (bronTime) {
        console.log("---------------")
        console.log(department)
        console.log("---------------")
        existingClient = await OnlineClient.findOne({
            department,
            bronTime: bronTime, brondate: {$gte: startOfDay, $lt: endOfDay},
        }).exec() || await OfflineClient.findOne({
            department,
            bronTime: bronTime, brondate: {$gte: startOfDay, $lt: endOfDay},
        }).exec();
    }
    return !!existingClient;
}

// register
module.exports.register = async (req, res) => {
    try {
        const {client} = req.body;
        //=========================================================
        // CheckData
        const checkClient = validateOnlineClient(client).error;
        if (checkClient) {
            return res.status(400).json({
                error: checkClient.message,
            });
        }

        const queueExists = await isQueueNumberExists(client.queue, client.brondate, client.bronTime, client.department);
        if (queueExists) {
            return res.status(400).json({
                error: "Bu navbatdagi mijoz mavjud!",
            });
        }
        //=========================================================
        // CreateClient

        const newclient = new OnlineClient({...client});
        await newclient.save();

        const response = await OnlineClient.findById(newclient._id);

        const clientData = await OnlineClient.findById(newclient._id)
            .populate("clinica")
            .populate("department", "name");
        const bronDate = new Date(clientData.brondate);
        bronDate.setHours(bronDate.getHours() + 3);

        await handleSend(clientData.clinica.smsKey, `998${clientData.phone}`, `Huramtli ${clientData.firstname} ${clientData.lastname}! Eslatib o'tamiz, siz ${new Date(bronDate).toLocaleDateString("ru-RU")} kuni, soat ${new Date(bronDate).getHours()}:${new Date(bronDate).getMinutes() < 10 ? "0" + new Date(bronDate).getMinutes() : new Date(bronDate).getMinutes()} da ${clientData.clinica.name} ning ${clientData.department.name} bo'limiga qabulga yozilgansiz! Iltimos kech qolmang! Ma'lumot uchun: ${clientData.clinica.phone1}`);

        res.status(201).send(response);
    } catch (error) {
        console.log(error);
        res.status(501).json({error: "Serverda xatolik yuz berdi..."});
    }
};

module.exports.update = async (req, res) => {
    try {
        const {client} = req.body;
        if (!client.queue && !client.bronTime) {
            return res.status(400).json({
                error: "Mijoz ma'lumotlari yetarli emas!",
            });
        }
        //=========================================================
        const foundClient = await OnlineClient.findById(client._id);
        if (Number(foundClient.get("queue")) !== Number(client.queue) || foundClient.get("bronTime") !== client.bronTime) {
            const queueExists = await isQueueNumberExists(client.queue, client.brondate, client.bronTime);
            if (queueExists) {
                return res.status(400).json({
                    error: "Bu navbatdagi mijoz mavjud!",
                });
            }
        }
        await OnlineClient.findByIdAndUpdate(client._id, {...client});

        const response = await OnlineClient.findById(client._id);

        res.status(201).send(response);
    } catch (error) {
        res.status(501).json({error: "Serverda xatolik yuz berdi..."});
    }
};

module.exports.findById = async (req, res) => {
    try {
        const {_id} = req.body;

        const response = await OnlineClient.findById(_id)
            .select("service")
            .populate("service");
        res.send(response.service);
    } catch (error) {
        res.status(501).json({error: "Serverda xatolik yuz berdi..."});
    }
};

module.exports.getDoctors = async (req, res) => {
    try {
        const {clinica} = req.body;

        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        const doctors = await User.find({
            clinica,
        })
            .select("firstname lastname specialty type")
            .populate("specialty", "name")
            .lean()
            .then((doctors) => doctors.filter((doctor) => {
                if (doctor.type === "Laborotory" || doctor.type === "Doctor") {
                    return doctor.specialty;
                }
            }));

        for (const doctor of doctors) {
            const clients = await OnlineClient.find({
                clinica, department: doctor.specialty._id, brondate: {
                    $gte: new Date(new Date().setHours(0, 0, 0, 0)), $lt: new Date(new Date().setHours(23, 59, 59, 0)),
                },
            });
            doctor.clients = clients.length;
        }

        res.status(201).send(doctors);
    } catch (error) {
        console.log(error);
        res.status(501).json({error: "Serverda xatolik yuz berdi..."});
    }
};

module.exports.getClients = async (req, res) => {
    try {
        const {department, clinica, beginDay, type} = req.body;

        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        let clients = [];

        if (type === "late") {
            clients = await OnlineClient.find({
                clinica, department, brondate: {
                    $lte: beginDay,
                },
            })
                .select("-__v -updatedAt -isArchive")
                .lean();
        } else {
            clients = await OnlineClient.find({
                clinica, department, brondate: {
                    $gte: beginDay,
                },
            })
                .select("-__v -updatedAt -isArchive")
                .populate({
                    path: "service", populate: "department",
                })
                .populate("serviceType")
                .lean();
        }
        res.status(200).json(clients);
    } catch (error) {
        console.log(error);
        res.status(501).json({error: "Serverda xatolik yuz berdi..."});
    }
};

module.exports.deleteClient = async (req, res) => {
    try {
        const {id} = req.body;
        //=========================================================

        const user = await OnlineClient.findByIdAndDelete(id);

        res.status(201).send({
            message: "Mijoz o'chirildi", lastname: user.lastname, firstname: user.firstname,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({error: "Serverda xatolik yuz berdi..."});
    }
};
