const { Clinica } = require("../../models/DirectorAndClinica/Clinica");
const { OfflineClient } = require("../../models/OfflineClient/OfflineClient");
const { StatsionarClient } = require("../../models/StatsionarClient/StatsionarClient");
const { StatsionarDiscount } = require("../../models/Cashier/StatsionarDiscount");
const { OfflinePayment, validatePayment } = require("../../models/Cashier/OfflinePayment");
const { StatsionarPayment } = require("../../models/Cashier/StatsionarPayment");
const {
    OfflineConnector,
} = require("../../models/OfflineClient/OfflineConnector");
const { OfflineService } = require("../../models/OfflineClient/OfflineService");
const { OfflineProduct } = require("../../models/OfflineClient/OfflineProduct");

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

        let debts = null;

        if (clientborn) {
            debts = await OfflinePayment.find({
                clinica,
                debt: { $gt: 0 }
            })
                .select('-isArchive -updatedAt -__v')
                .populate('client', 'fullname born phone id')
                .sort({ _id: -1 })
                .lean()
                .then(connectors => {
                    return connectors.filter(connector => {
                        return new Date(new Date(connector.client.born).setUTCHours(0, 0, 0, 0)).toISOString() === new Date(new Date(clientborn).setUTCHours(0, 0, 0, 0)).toISOString()
                    });
                })
        } else {
            debts = await OfflinePayment.find({
                clinica,
                debt: { $gt: 0 },
                createdAt: {
                    $gte: beginDay,
                    $lt: endDay,
                },
            })
                .select('-isArchive -updatedAt -__v')
                .populate('client', 'fullname born phone id')
                .sort({ _id: -1 })
                .lean()
        }

        res.status(200).send(debts)
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...', message: error.message })
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

        let debts = null;

        if (clientborn) {
            debts = await StatsionarPayment.find({
                clinica,
                debt: { $gt: 0 }
            })
                .select('-isArchive -updatedAt -__v')
                .populate('client', 'fullname born phone id')
                .sort({ _id: -1 })
                .lean()
                .then(connectors => {
                    return connectors.filter(connector => {
                        return new Date(new Date(connector.client.born).setUTCHours(0, 0, 0, 0)).toISOString() === new Date(new Date(clientborn).setUTCHours(0, 0, 0, 0)).toISOString()
                    });
                })
        } else {
            debts = await StatsionarPayment.find({
                clinica,
                debt: { $gt: 0 },
                createdAt: {
                    $gte: beginDay,
                    $lte: endDay,
                },
            })
                .select('-isArchive -updatedAt -__v')
                .populate('client', 'fullname born phone id')
                .sort({ _id: -1 })
                .lean()
        }


        res.status(200).send(debts)
    } catch (error) {
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

module.exports.payment = async (req, res) => {
    try {
        const { payment } = req.body;

        delete payment._id
        payment.client = payment.client._id;
        delete payment.createdAt;
        console.log(payment);

        const checkPayment = validatePayment(payment).error;
        if (checkPayment) {
            return res.status(400).json({
                error: checkPayment.message,
            });
        }

        // Delete Debets
        const debts = await OfflinePayment.find({ connector: payment.connector });
        for (const debt of debts) {
            const update = await OfflinePayment.findByIdAndUpdate(debt._id, {
                debt: 0,
            });
        }
        // CreatePayment
        const newpayment = new OfflinePayment({ ...payment });
        await newpayment.save();

        const updateConnector = await OfflineConnector.findById(payment.connector);
        updateConnector.payments.push(newpayment._id);
        await updateConnector.save()

        res.status(200).json(newpayment);
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...', message: error.message })
    }
}

module.exports.paymentStatsionar = async (req, res) => {
    try {
        const { payment } = req.body;

        delete payment._id
        payment.client = payment.client._id;
        delete payment.createdAt;
        console.log(payment);

        const checkPayment = validatePayment(payment).error;
        if (checkPayment) {
            return res.status(400).json({
                error: checkPayment.message,
            });
        }

        // Delete Debets
        const debts = await StatsionarPayment.find({ connector: payment.connector });
        for (const debt of debts) {
            const update = await StatsionarPayment.findByIdAndUpdate(debt._id, {
                debt: 0,
            });
        }
        // CreatePayment
        const newpayment = new StatsionarPayment({ ...payment });
        await newpayment.save();
        console.log(payment);
        const updateConnector = await StatsionarConnector.findById(payment.connector);
        updateConnector.payments.push(newpayment._id);
        await updateConnector.save()

        res.status(200).json(newpayment);
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...', message: error.message })
    }
}