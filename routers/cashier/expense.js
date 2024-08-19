const { Expense } = require("../../models/Cashier/Expense");
const { Clinica } = require("../../models/DirectorAndClinica/Clinica");


module.exports.create = async (req, res) => {
    try {
        const { total, comment, type, clinica } = req.body;

        const clinic = await Clinica.findById(clinica)
        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            })
        }

        const expense = new Expense({
            total,
            comment,
            type,
            clinica
        })

        await expense.save()

        res.status(200).json({ message: 'Xarajat yaratildi!' })

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

module.exports.get = async (req, res) => {
    try {
        const { clinica, beginDay, endDay } = req.body;

        const clinic = await Clinica.findById(clinica)
        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            })
        }

        const expenses = await Expense.find({
            clinica,
            createdAt: {
                $gte: beginDay,
                $lte: endDay
            }
        })
            .lean();

        res.status(200).json(expenses);

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

module.exports.update = async (req, res) => {
    try {
        const { _id, total, comment, type } = req.body;

        await Expense.findByIdAndUpdate(_id, {
            total,
            comment,
            type,
        })

        const expense = await Expense.findById(_id);

        res.status(200).json(expense);

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

module.exports.delete = async (req, res) => {
    try {
        const { _id } = req.body;

        await Expense.findByIdAndDelete(_id);

        res.status(200).json({ message: "Xarajat o'chirildi!" })
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

module.exports.getTotal = async (req, res) => {
    try {
        const { clinica, beginDay, endDay } = req.body;

        const expenses = await Expense.find({
            clinica,
            createdAt: {
                $gte: beginDay,
                $lte: endDay
            }
        })
            .lean()

        const total = expenses.reduce((prev, el) => prev + el.total, 0);

        res.status(200).json({ total, expenses });
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}