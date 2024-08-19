const { Clinica } = require("../../models/DirectorAndClinica/Clinica");
const { AddedService } = require("../../models/Services/AddedService");
const { UserHealthRecord } = require("../../models/UserHealthRecord/UserHealthRecord");
const { User } = require("../../models/Users");
require("../../models/OfflineClient/OfflineService");
require('../../models/Services/Department')
require('../../models/OfflineClient/OfflineClient')


module.exports.getDirectDoctors = async (req, res) => {
    try {
        const { clinica, beginDay, endDay } = req.body;

        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        const doctors = await User.find({
            clinica,
            type: "Doctor"
        })
            .select('-isArchive -password -updatedAt -__v')
            .populate('specialty', 'name')
            .lean()

        for (const doctor of doctors) {
            const services = await AddedService.find({
                doctor: doctor._id,
                createdAt: {
                    $gte: beginDay,
                    $lte: endDay,
                }
            })
                .populate('service', 'service pieces')
                .lean()

            doctor.total = services.reduce((prev, el) => prev + (el.service.pieces * el.service.service.price), 0)
        }


        res.status(200).send(doctors);
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
};

module.exports.getDirectService = async (req, res) => {
    try {
        const { doctor, beginDay, endDay } = req.body;

        const services = await AddedService.find({
            doctor: doctor,
            createdAt: {
                $gte: beginDay,
                $lte: endDay,
            }
        })
            .populate({
                path: 'service',
                select: 'service pieces department client ',
                populate: {
                    path: "client",
                    select: "firstname lastname"
                }
            })
            .populate({
                path: 'service',
                select: 'service pieces department client payment refuse',
                populate: {
                    path: "department",
                    select: "name"
                }
            })
            .lean()
        res.status(200).send(services.filter(({service})=>!service.refuse&&service.payment));
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
}
module.exports.getComplaint = async (req, res) => {
    const { clinica, doctor } = req.query;
    if (!clinica) {
        return res.status(400).json({
            message: "Diqqat! Klinika ma'lumotlari topilmadi.",
        });
    }
    if (!doctor) {
        return res.status(400).json({
            message: "Diqqat! Doctor ma'lumotlari topilmadi.",
        });
    }
    try {
        const findedDoctor = await User.findOne({
            clinica: clinica,
            _id: doctor
        });
        if (!findedDoctor) {
            return res.status(400).json({
                message: "Diqqat! Doctor ma'lumotlari topilmadi.",
            });
        }
        const findedUserHelthRecord = await UserHealthRecord.find({
            doctor
        })
        let complaints = [], diagnostics = [];
        findedUserHelthRecord.forEach((item) => {
            if (item.type === "complaints") {
                complaints.push(item)
            } else if (item.type === "diagnostics") {
                diagnostics.push(item)
            }
        })
        res.status(200).json({ complaints, diagnostics });
    } catch (error) {
        console.error(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
};
module.exports.updateAndCreateComplaint = async (req, res) => {
    const { clinica, doctor } = req.query
    const { type, name, _id } = req.body;
    if (!clinica) {
        return res.status(400).json({
            message: "Diqqat! Klinika ma'lumotlari topilmadi.",
        });
    }
    if (!doctor) {
        return res.status(400).json({
            message: "Diqqat! Doctor ma'lumotlari topilmadi.",
        });
    }
    try {
        const findedUser = await User.findOne(
            { clinica: clinica, _id: doctor },
        );
        if (!findedUser) {
            return res.status(400).json({
                message: "Diqqat! Doctor ma'lumotlari topilmadi.",
            });
        }
        if (_id !== undefined) {
            const findedUserHelthRecord = await UserHealthRecord.findOne({ _id, type });
            findedUserHelthRecord.name = name;
            await findedUserHelthRecord.save()
        } else {
            const newUserHealthRecord = new UserHealthRecord({
                doctor,
                type,
                name
            })
            await newUserHealthRecord.save()
        }
        res.status(200).json({
            message: `Muvaffaqiyatli yangilandi.`,
        });
    } catch (error) {
        console.error(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
};


