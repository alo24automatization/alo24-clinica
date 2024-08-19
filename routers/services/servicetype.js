const {
    ServiceType,
    validateServiceType,
} = require("../../models/Services/ServiceType");
const {Clinica} = require("../../models/DirectorAndClinica/Clinica");
const {Department} = require("../../models/Services/Department");
const {Service} = require("../../models/Services/Service");
const ObjectId = require("mongodb").ObjectId;

//ServiceType registerall
module.exports.registerAll = async (req, res) => {
    try {
        const servicestype = req.body;
        const all = [];
        for (const s of servicestype) {
            const {error} = validateServiceType(s);
            if (error) {
                return res.status(400).json({
                    error: error.message,
                });
            }

            const {name, department, clinica} = s;

            const clinic = await Clinica.findOne({name: clinica});

            if (!clinic) {
                return res.status(400).json({
                    message: "Diqqat! Klinika ma'lumotlari topilmadi.",
                });
            }

            const departmen = await Department.findOne({
                name: department,
                clinica: clinic._id,
            });

            if (!departmen) {
                return res.status(400).json({
                    message: `Diqqat! ${department} xizmat turi mavjud emas.`,
                });
            }

            const servicetype = await ServiceType.findOne({
                clinica: clinic._id,
                name,
                department: departmen._id,
            });

            if (servicetype) {
                return res.status(400).json({
                    message: `Diqqat! ${name} xizmat turi avval yaratilgan.`,
                });
            }

            const newServiceType = new ServiceType({
                name,
                department: departmen._id,
                clinica: clinic._id,
            });
            await newServiceType.save();

            const updateDepartment = await Department.findByIdAndUpdate(
                departmen._id,
                {
                    $push: {
                        servicetypes: newServiceType._id,
                    },
                }
            );
            all.push(newServiceType);
        }

        res.send(all);
    } catch (error) {
        res.status(501).json({error: "Serverda xatolik yuz berdi..."});
    }
};

//ServiceType register
module.exports.register = async (req, res) => {
    try {
        const {error} = validateServiceType(req.body);
        if (error) {
            return res.status(400).json({
                error: error.message,
            });
        }

        const {name, department, clinica} = req.body;

        const service = await ServiceType.findOne({
            clinica,
            name,
            department,
        });

        if (service) {
            return res.status(400).json({
                message: `Diqqat! ${name} xizmat turi avval yaratilgan.`,
            });
        }

        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        const departmen = await Department.findById(department);

        if (!departmen) {
            return res.status(400).json({
                message: "Diqqat! Bo'lim ma'lumotlari topilmadi.",
            });
        }

        const newServiceType = new ServiceType({
            name,
            department,
            clinica,
        });
        await newServiceType.save();

        const updateDepartment = await Department.findByIdAndUpdate(department, {
            $push: {
                servicetypes: newServiceType._id,
            },
        });

        res.send(newServiceType);
    } catch (error) {
        res.status(501).json({error: "Serverda xatolik yuz berdi..."});
    }
};

//ServiceType getall
module.exports.getAll = async (req, res) => {
    try {
        const {clinica} = req.body;

        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        const servicestypes = await ServiceType.find({
            clinica,
        })
            .populate("department", "name probirka")
            .populate("clinica", "name")
            .populate('services')
            .lean()

        res.send(servicestypes);
    } catch (error) {
        res.status(501).json({error: "Serverda xatolik yuz berdi..."});
    }
};

//ServiceType getalldepartment
module.exports.getAllDepartment = async (req, res) => {
    try {
        const {clinica, department} = req.body;
        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        const foundDepartment = await Department.findById(department);

        if (!foundDepartment) {
            return res.status(400).json({
                message: "Diqqat! Bo'lim ma'lumotlari topilmadi.",
            });
        }

        const servicestypes = await ServiceType.find({
            clinica,
            department,
        }).populate("services")
        res.send(servicestypes);
    } catch (error) {
        console.error(error); // Logging the error to the console
        res.status(501).json({error: "Serverda xatolik yuz berdi..."});
    }
};
//ServiceType update
module.exports.update = async (req, res) => {
    try {
        const {_id, name, department, clinica} = req.body;

        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        const departmen = await Department.findById(department);

        if (!departmen) {
            return res.status(400).json({
                message: "Diqqat! Bo'lim ma'lumotlari topilmadi.",
            });
        }

        const service = await ServiceType.findById(_id);

        if (!service) {
            return res.status(400).json({
                message: `Diqqat! ${name} xizmati avval yaratilmagan.`,
            });
        }

        service.name = name;
        service.department = department;
        await service.save();

        res.send(service);
    } catch (error) {
        res.status(501).json({error: "Serverda xatolik yuz berdi..."});
    }
};

//ServiceType delete
module.exports.delete = async (req, res) => {
    try {
        const {_id, department, clinica, name} = req.body;

        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        const departmen = await Department.findById(department);

        if (!departmen) {
            return res.status(400).json({
                message: "Diqqat! Bo'lim ma'lumotlari topilmadi.",
            });
        }

        const serviceType = await ServiceType.findByIdAndDelete(_id);

        if (!serviceType) {
            return res.status(400).json({
                message: `Diqqat! ${name} xizmat turi avval yaratilmagan.`,
            });
        }

        const departmentUpdate = await Department.findByIdAndUpdate(department, {
            $pull: {
                servicetypes: new ObjectId(_id),
            },
        });

        serviceType.services.map(async (s) => {
            const id = new ObjectId(s).toString();
            let ss = await Service.findById(id);
            if (ss.servicetype) {
                ss.servicetype = undefined;
            }

            await ss.save();
        });
        res.send(serviceType);
    } catch (error) {
        res.status(501).json({error: "Serverda xatolik yuz berdi..."});
    }
};

//ServiceType deletealldepartment
module.exports.deleteAllDepartment = async (req, res) => {
    try {
        const {department, clinica} = req.body;

        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        const departmen = await Department.findById(department);

        if (!departmen) {
            return res.status(400).json({
                message: "Diqqat! Bo'lim ma'lumotlari topilmadi.",
            });
        }

        const servicestype = await ServiceType.find({
            clinica,
            department,
        });

        let all = [];
        for (const service of servicestype) {
            const del = await ServiceType.findByIdAndDelete(service._id);

            const departmentUpdate = await Department.findByIdAndUpdate(department, {
                $pull: {
                    servicetypes: new ObjectId(service._id),
                },
            });

            service.services.map(async (s) => {
                const id = new ObjectId(s).toString();
                let ss = await Service.findById(id);
                if (ss.servicetype) {
                    ss.servicetype = undefined;
                }
                await ss.save();
            });

            all.push(del);
        }

        res.send(all);
    } catch (error) {
        res.status(501).json({error: "Serverda xatolik yuz berdi..."});
    }
};

//ServiceType deleteall
module.exports.deleteAll = async (req, res) => {
    try {
        const {clinica} = req.body;

        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        const servicestype = await ServiceType.find({
            clinica,
        });

        let all = [];
        for (const service of servicestype) {
            const del = await ServiceType.findByIdAndDelete(service._id);
            all.push(del);

            const departmentUpdate = await Department.findByIdAndUpdate(
                service.department,
                {
                    $pull: {
                        servicetypes: new ObjectId(service._id),
                    },
                }
            );

            service.services.map(async (s) => {
                const id = new ObjectId(s).toString();
                let ss = await Service.findById(id);
                if (ss.servicetype) {
                    ss.servicetype = undefined;
                }
                await ss.save();
            });
        }

        res.send(all);
    } catch (error) {
        res.status(501).json({error: "Serverda xatolik yuz berdi..."});
    }
};


// Find by servicetype id
module.exports.findById = async (req, res) => {
    try {
        const {department, _id} = req.body;
        const serviceType = await ServiceType.findById(_id).select('services').populate('services').lean();
        res.send(serviceType);
    } catch (error) {
        res.status(501).json({error: "Serverda xatolik yuz berdi..."});
    }
}
