const { OfflineDiscount } = require("../../models/Cashier/OfflineDiscount");
const { Clinica } = require("../../models/DirectorAndClinica/Clinica");
const { OfflineClient } = require("../../models/OfflineClient/OfflineClient");
const { StatsionarClient } = require("../../models/StatsionarClient/StatsionarClient");
const { StatsionarDiscount } = require("../../models/Cashier/StatsionarDiscount");

// GET Offline discounts
module.exports.offline = async (req, res) => {
    try {
        const { clinica, beginDay, endDay, clientborn } = req.body
        const clinic = await Clinica.findById(clinica)

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            })
        }

        let discounts = null;

        if (clientborn) {
            discounts = await OfflineDiscount.find({
                clinica,
            })
                .select('total discount procient createdAt comment')
                .populate('client', 'fullname born phone id')
                .sort({ _id: -1 })
                .lean()
                .then(connectors => {
                    return connectors.filter(connector => {
                        return new Date(new Date(connector.client.born).setUTCHours(0, 0, 0, 0)).toISOString() === new Date(new Date(clientborn).setUTCHours(0, 0, 0, 0)).toISOString()
                    });
                })
        } else {
            discounts = await OfflineDiscount.find({
                clinica,
                createdAt: {
                    $gte: beginDay,
                    $lt: endDay,
                },
            })
                .select('total discount procient createdAt comment')
                .populate('client', 'fullname born phone id')
                .sort({ _id: -1 })
        }

        res.status(200).send(discounts)
    } catch (error) {
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

// GET Statsionar discounts
module.exports.statsionar = async (req, res) => {
    try {
        const { clinica, beginDay, endDay, clientborn } = req.body
        const clinic = await Clinica.findById(clinica)

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            })
        }

        let discounts = null;

        if (clientborn) {
            discounts = await StatsionarDiscount.find({
                clinica
            })
                .select('total discount procient createdAt comment')
                .populate('client', 'fullname born phone id')
                .sort({ _id: -1 })
                .lean()
                .then(connectors => {
                    return connectors.filter(connector => {
                        return new Date(new Date(connector.client.born).setUTCHours(0, 0, 0, 0)).toISOString() === new Date(new Date(clientborn).setUTCHours(0, 0, 0, 0)).toISOString()
                    });
                })
        } else {
            discounts = await StatsionarDiscount.find({
                clinica,
                createdAt: {
                    $gte: beginDay,
                    $lt: endDay,
                },
            })
                .select('total discount procient createdAt comment')
                .populate('client', 'fullname born phone id')
                .sort({ _id: -1 })
                .lean()
        }

        res.status(200).send(discounts)
    } catch (error) {
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}
