const { TableColumn, validateTableColumn } = require("../../models/Services/TableColumn");
const { Service } = require("../../models/Services/Service");
const { ServiceTable, validateServiceTable } = require("../../models/Services/ServiceTable");
const { ObjectId } = require("mongodb");
const { OfflineService } = require("../../models/OfflineClient/OfflineService");
const { Clinica } = require("../../models/DirectorAndClinica/Clinica");
const { User } = require("../../models/Users");
require('../../models/Services/Department')
module.exports.column = async (req, res) => {
    try {
        const { column } = req.body
        if (column._id) {

            const update = await TableColumn.findByIdAndUpdate(column._id, { ...column });

            const offlineservices = await OfflineService.find({
                serviceid: column.service,
                accept: false
            })

            for (const s of offlineservices) {
                s.column = { ...column }
                await s.save()
            }

            return res.status(200).send(column)
        } else {
            const newColumn = new TableColumn({ ...column })
            await newColumn.save()

            const update = await Service.findByIdAndUpdate(column.service, {
                column: newColumn._id
            })

            const offlineservices = await OfflineService.find({
                serviceid: column.service,
                accept: false
            })

            for (const s of offlineservices) {
                s.column = { ...newColumn }
                await s.save()
            }

            return res.status(200).send(newColumn)

        }

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

module.exports.columndelete = async (req, res) => {
    try {
        const { column } = req.body
        const deleteColumn = await TableColumn.findByIdAndDelete(column._id)

        const deleteAllTables = await ServiceTable.find({ service: column.service }).select('_id')

        for (const deleteAllTable of deleteAllTables) {
            await TableColumn.findByIdAndDelete(deleteAllTable._id)
        }

        const clearService = await Service.findByIdAndUpdate(column.service, {
            tables: []
        })

        return res.status(200).send(column)
    } catch (error) {
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

module.exports.table = async (req, res) => {
    try {
        const { table } = req.body
        if (table._id) {

            const update = await ServiceTable.findByIdAndUpdate(table._id, { ...table })

            return res.status(200).send(update)
        } else {
            const newTable = new ServiceTable({ ...table })
            await newTable.save()
            const update = await Service.findByIdAndUpdate(table.service, {
                $push: {
                    tables: new ObjectId(newTable._id),
                }
            })

            return res.status(200).send(newTable)

        }

    } catch (error) {
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

module.exports.updateTable = async (req, res) => {
    try {
        const { tables, service } = req.body;

        const responseData = [];
        for (const table of tables) {
            const update = await ServiceTable.findByIdAndUpdate(table._id, { ...table })
            responseData.push(update)
        }

        const offlineservices = await OfflineService.find({
            serviceid: service,
            accept: false
        })

        for (const s of offlineservices) {
            s.tables = [...tables]
            await s.save()
        }

        res.status(200).json(responseData);

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

module.exports.tabledelete = async (req, res) => {
    try {
        const { table } = req.body
        const deleteTable = await ServiceTable.findByIdAndDelete(table._id)

        const clearService = await Service.findByIdAndUpdate(table.service, {
            $pull: {
                tables: new ObjectId(table._id),
            }
        })

        return res.status(200).send(clearService)

    } catch (error) {
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}


module.exports.createall = async (req, res) => {
    try {
        const { tables, clinica, doctor, service } = req.body
        let tabless = []
        for (const table of tables) {
            const newTable = new ServiceTable({ ...table, clinica, doctor, service })
            await newTable.save()
            const update = await Service.findByIdAndUpdate(service, {
                $push: {
                    tables: new ObjectId(newTable._id),
                }
            })
            tabless.push(newTable)
        }

        const offlineservices = await OfflineService.find({
            serviceid: service,
            accept: false
        })

        for (const s of offlineservices) {
            s.tables = [...tables]
            await s.save()
        }


        return res.status(200).send(tabless)

    } catch (error) {
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}


module.exports.correctTables = async (req, res) => {
    try {
        const { clinica } = req.body;

        const services = await Service.find({
            clinica: clinica,
        })
            .populate('department')
            .lean()
            .then(services => services.filter(service => service.department.probirka))

        for (const service of services) {
            if (service.column) {
                const column = await TableColumn.findById(service.column)
                    .lean();

                const columns = Object.keys(column).filter(col => col.includes('col'))

                const tables = await ServiceTable.find({ service: service._id }).lean()

                for (const col of columns) {
                    for (const table of tables) {
                        const tableOne = await ServiceTable.findById(table._id);
                        if (!tableOne[col]) {
                            tableOne[col] = '';
                        }
                        await tableOne.save()
                    }
                }
            }
        }

        res.status(200).json({ message: "Shablonlar yangilandi!" })

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}


module.exports.transferTables = async (req, res) => {
    try {
        const {clinica, filialClinica } = req.body;

        const checkMainClinica = await Clinica.findById(clinica);
        const checkFilialClinica = await Clinica.findById(filialClinica);
        if (!checkMainClinica && !checkFilialClinica) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        const services = await Service.find({clinica})
        .populate('department', 'probirka')
        .populate('tables', '-_id -service -clinica -doctor -createdAt -updatedAt -__v')
        .populate('column', '-_id -service -clinica -doctor -createdAt -updatedAt -__v')
        .lean()
        .then(services => services.filter(service => service.department.probirka))

        for (const service of services) {
            const filialService = await Service.findOne({
                name: service.name,
                clinica: filialClinica
            })
            if (filialService) {
                const filialDoctor = await User.findOne({clinica: filialClinica, type: "Laborotory"})

                if (!service.column && service.tables.length > 0) {
                    return res.status(401).json({message: `${service.name} xizmatta ustun kiritilmagan!`})
                }

                if (service.column) {
                    const newColumn = new TableColumn({
                        ...service.column,
                        service: filialService._id,
                        clinica: filialClinica,
                        doctor: filialDoctor._id
                    })
                    await newColumn.save()
                    filialService.column = newColumn;
                } 

                for (const maintable of service.tables) {
                    const newTable = new ServiceTable({
                        ...maintable,
                        service: filialService._id,
                        clinica: filialClinica,
                        doctor: filialDoctor._id
                    })
                    await newTable.save()
                    
                    if (filialService.tables) {
                        filialService.tables.push(newTable._id)
                    } else {
                        filialService.tables = [newTable._id];
                    }
                }
                
                await filialService.save()
            }
        }

        res.status(200).json({message: "Shablonlar o'tkazildi!"})

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}