const { Department } = require("../../models/Services/Department");
const { ServiceType } = require("../../models/Services/ServiceType");
const { ServiceTable } = require("../../models/Services/ServiceTable");
const { TableColumn } = require("../../models/Services/TableColumn");
const { Service } = require("../../models/Services/Service");
const { ObjectId } = require("mongodb");

module.exports.update = async (req, res) => {
    try {
        const { service, doctor } = req.body

        const update = await Service.findByIdAndUpdate(service._id, { ...service })


        const services = await Service.find({
            department: doctor.specialty
        })
            .select('name visible place')
            .populate('tables', '-__v -createdAt -updatedAt')
            .populate('column', '-__v -createdAt -updatedAt')
            .populate('department', 'name')
            .populate('servicetype', 'name')
        return res.status(200).send(services)

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

// GET SERVICES
module.exports.services = async (req, res) => {
    try {
        const { clinica, doctor } = req.body
        const services = await Service.find({
            clinica: clinica,
            department: doctor.specialty
        })
            .select('name visible place')
            .populate('tables', '-__v -createdAt -updatedAt')
            .populate('column', '-__v -createdAt -updatedAt')
            .populate('department', 'name')
            .populate('servicetype', 'name')
        return res.status(200).send(services)

    } catch (error) {
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

// GET SERVICES
module.exports.delete = async (req, res) => {
    try {
        const { service } = req.body
        const deleteColumn = await TableColumn.findByIdAndDelete(service.column._id)

        for (const table of service.tables) {
            const deleteTable = await ServiceTable.findByIdAndDelete(table._id)
        }

        const servic = await Service.findById(service._id)
        delete servic.column
        servic.tables = []
        await servic.save()
        return res.status(200).send(servic)

    } catch (error) {
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}