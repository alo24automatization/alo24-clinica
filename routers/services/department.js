const {
    Department,
    validateDepartment,
} = require('../../models/Services/Department')
const {Clinica} = require('../../models/DirectorAndClinica/Clinica')
const {Service} = require('../../models/Services/Service')
const {ServiceType} = require('../../models/Services/ServiceType')

//Department register
module.exports.registerAll = async (req, res) => {
    try {
        const departments = req.body
        const all = []
        for (const d of departments) {
            const {error} = validateDepartment(d)
            if (error) {
                return res.status(400).json({
                    error: error.message,
                })
            }

            const {name, probirka, clinica} = d

            const clinic = await Clinica.findOne({name: clinica})

            if (!clinic) {
                return res.status(400).json({
                    message: "Diqqat! Klinika ma'lumotlari topilmadi.",
                })
            }

            const department = await Department.findOne({
                clinica: clinic._id,
                name,
            })

            if (department) {
                return res.status(400).json({
                    message: `Diqqat! ${name} bo'limi avval yaratilgan.`,
                })
            }

            const newDepartment = new Department({
                name,
                probirka,
                clinica: clinic._id,
            })
            await newDepartment.save()
            all.push(newDepartment)
        }

        res.send(all)
    } catch (error) {
        res.status(501).json({error: 'Serverda xatolik yuz berdi...'})
    }
}

//Department register
module.exports.register = async (req, res) => {
    try {
        const {error} = validateDepartment(req.body)
        if (error) {
            return res.status(400).json({
                error: error.message,
            })
        }

        const {name, probirka, floor, letter, clinica, room} = req.body

        const department = await Department.findOne({
            clinica,
            name,
        })

        if (department) {
            return res.status(400).json({
                message: "Diqqat! Ushbu bo'lim avval yaratilgan.",
            })
        }

        const clinic = await Clinica.findById(clinica)

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            })
        }

        const newDepartment = new Department({
            name,
            probirka,
            clinica,
            room,
            floor,
            letter
        })
        await newDepartment.save()

        res.send(newDepartment)
    } catch (error) {
        res.status(501).json({error: 'Serverda xatolik yuz berdi...'})
    }
}

//Department update
module.exports.update = async (req, res) => {
    try {
        const {
            name, floor,
            letter, probirka, clinica, room
        } = req.body

        const department = await Department.findById(req.body._id)

        if (!department) {
            return res.status(400).json({
                message: "Diqqat! Ushbu bo'lim topilmadi.",
            })
        }

        const clinic = await Clinica.findById(clinica)

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            })
        }

        department.name = name
        department.probirka = probirka;
        department.room = room;
        department.floor = floor;
        department.letter = letter;
        await department.save()
        res.send(department)
    } catch (error) {
        res.status(501).json({error: 'Serverda xatolik yuz berdi...'})
    }
}
module.exports.switchTurn = async (req, res) => {
    try {
        const {id, active, clinica} = req.body;
        const clinic = await Clinica.findById(clinica)

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            })
        }
       await Department.findByIdAndUpdate(
            id, {stopTurn: active}
        )
        const message=active?"Navbat to'xtatildi!":"Navbat ochildi!";
        res.status(201).json({message})
    } catch (error) {
        console.log(error.message)
        res.status(501).json({error: 'Serverda xatolik yuz berdi...'})
    }
}
//Department getall
module.exports.getAll = async (req, res) => {
    try {
        const {clinica} = req.body
        const clinic = await Clinica.findById(clinica)

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            })
        }

        const departments = await Department.find({
            clinica,
        })
            .populate('servicetypes', 'name')
            .populate('services')

        res.send(departments)
    } catch (error) {
        res.status(501).json({error: 'Serverda xatolik yuz berdi...'})
    }
}


// Get All Reseption by department id
module.exports.getAllReseptionById = async (req, res) => {
    try {
        const {clinica, _id} = req.body
        const clinic = await Clinica.findById(clinica)

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            })
        }

        const departments = await Department.findById(_id).populate('services').populate('servicetypes')

        res.send(departments)
    } catch (error) {
        res.status(501).json({error: 'Serverda xatolik yuz berdi...'})
    }
}


module.exports.getAllReseption = async (req, res) => {
    try {
        const {clinica} = req.body
        const clinic = await Clinica.findById(clinica)

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            })
        }
        const departments = await Department.find({
            clinica,
        })
            .select('name probirka services')
            .populate('services', 'name price servicetype')
        res.send(departments)
    } catch (error) {
        res.status(501).json({error: 'Serverda xatolik yuz berdi...'})
    }
}

//Department get
module.exports.get = async (req, res) => {
    try {
        const {clinica, _id} = req.body

        const clinic = await Clinica.findById(clinica)

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            })
        }

        const department = await Department.findById(_id)

        if (!department) {
            return res.status(400).json({
                message: "Diqqat! Bo'lim topilmadi.",
            })
        }

        res.send(department)
    } catch (error) {
        res.status(501).json({error: 'Serverda xatolik yuz berdi...'})
    }
}

//Department delete
module.exports.delete = async (req, res) => {
    try {
        const {_id, clinica} = req.body

        const clinic = await Clinica.findById(clinica)

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            })
        }

        const department = await Department.findByIdAndDelete(_id)

        for (const service of department.services) {
            const del = await Service.findByIdAndDelete(service)
        }
        for (const servicetype of department.servicetypes) {
            const del = await ServiceType.findByIdAndDelete(servicetype)
        }
        res.send(department)
    } catch (error) {
        res.status(501).json({error: 'Serverda xatolik yuz berdi...'})
    }
}

//Department deleteall
module.exports.deleteAll = async (req, res) => {
    try {
        const {clinica} = req.body

        const clinic = await Clinica.findById(clinica)

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            })
        }

        const departments = await Department.find({
            clinica,
        })
        // .select("_id");

        for (const department of departments) {
            const del = await Department.findByIdAndDelete(department._id)
            for (const service of del.services) {
                const del = await Service.findByIdAndDelete(service)
            }
            for (const servicetype of department.servicetypes) {
                const del = await ServiceType.findByIdAndDelete(servicetype)
            }
        }

        res.send(departments)
    } catch (error) {
        res.status(501).json({error: 'Serverda xatolik yuz berdi...'})
    }
}
