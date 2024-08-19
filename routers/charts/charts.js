const {
    OfflineConnector,
} = require("../../models/OfflineClient/OfflineConnector");
const { OfflinePayment } = require("../../models/Cashier/OfflinePayment");
const { OfflineClient } = require("../../models/OfflineClient/OfflineClient");
const { OfflineService } = require("../../models/OfflineClient/OfflineService");
const { Expense } = require("../../models/Cashier/Expense");

module.exports.getMonthly = async (req, res) => {
    try {
        const { clinica } = req.body;

        const clients = [];
        const totalsum = [];

        let count = 0;
        const currentMonth = new Date().getMonth();
       
        while (count <= currentMonth) {
            const startDate = new Date(
                new Date(new Date().setMonth(count, 1)).setHours(0, 0, 0, 0)
            ).toISOString()
            const endDate = new Date(
                new Date(new Date().setMonth(count + 1, 1)).setHours(0, 0, 0, 0)
            ).toISOString()
            const dailyclient = await OfflineConnector.find({
                clinica,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate,
                }
            })
                .select("-isArchive -updatedAt -__v")
                .populate({
                    path: "payments",
                    select: "payment"
                })

            clients.push(dailyclient.length)
            totalsum.push(dailyclient.reduce((prev, item) => {
                return prev + item.payments.reduce((prev, el) => prev + el.payment, 0)
            }, 0))

            count++;
        }

        res.status(200).json({
            clients, totalsum
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi...", description: error.message });
    }
};

module.exports.getDaily = async (req, res) => {
    try {
        const { clinica } = req.body;
       
        const clients = await OfflineClient.find({
            clinica,
            createdAt: {
                $gte: new Date(
                    new Date().setHours(0, 0, 0, 0)
                ),
                $lte: new Date()
            }
        })
            .lean()

        const services = await OfflineService.find({
            clinica,
            createdAt: {
                $gte: new Date(
                    new Date().setHours(0, 0, 0, 0)
                ),
                $lte: new Date()
            }
        })
            .lean()

        const payments = await OfflinePayment.find({
            clinica,
            createdAt: {
                $gte: new Date(
                    new Date().setHours(0, 0, 0, 0)
                ),
                $lte: new Date()
            }
        })
            .lean()

        const dailypayments = payments.reduce((prev, el) => prev + el.payment, 0);


        const expenses = await Expense.find({
            clinica,
            createdAt: {
                $gte: new Date(
                    new Date().setHours(0, 0, 0, 0)
                ),
                $lte: new Date()
            }
        })
            .lean()

        const expense = expenses.reduce((prev, el) => prev + el.total, 0);

        res.status(200).json({
            clients: clients.length,
            services: services.length,
            payments: dailypayments,
            expense
        })

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi...", description: error.message });
    }
}