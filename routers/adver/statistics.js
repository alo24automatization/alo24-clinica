const { Adver } = require("../../models/Adver/Adver");
const { Clinica } = require("../../models/DirectorAndClinica/Clinica");
const { OfflineAdver } = require("../../models/OfflineClient/OfflineAdver");
const { OfflineClient } = require("../../models/OfflineClient/OfflineClient");
const { OfflineService } = require("../../models/OfflineClient/OfflineService");


module.exports.getStatistics = async (req, res) => {
    try {
        const { clinica, beginDay, endDay } = req.body;

        const clinic = await Clinica.findById(clinica)
        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            })
        }

        const offlineservice = await OfflineService.find({
            clinica,
            createdAt: {
                $gte: beginDay,
                $lte: endDay
            }
        })
            .lean()

        let totalclients = 0;
        let counteragent_clients = 0;
        let clients = 0;

        let clientId = []
        let connectorId = []

        for (const service of offlineservice) {
            const check = clientId.some(c => String(c) === String(service.client))
            const checkConnector = connectorId.some(c => String(c) === String(service.connector))
            if (!check && !checkConnector) {
                clientId.push(service.client);
                connectorId.push(service.connector);
                totalclients += 1;

                if (service.counterdoctor) {
                    counteragent_clients += 1
                } else {
                    clients += 1;
                }
            }
        }

        res.status(200).json({
            clients,
            counteragent_clients
        })

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

module.exports.getAdverStatistics = async (req, res) => {
    try {
        const { beginDay, endDay, clinica } = req.body;

        const clinic = await Clinica.findById(clinica)
        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            })
        }

        const advers = await Adver.find({ clinica: clinica })
            .lean()

        for (const adver of advers) {
            const offlineadvers = await OfflineAdver.find({ adver: adver }).lean()

            adver.clients = offlineadvers.length;
        }

        const advernames = advers.reduce((prev, el) => {
            prev.push(el.name);
            return prev;
        }, [])

        const adverclients = advers.reduce((prev, el) => {
            prev.push(el.clients);
            return prev;
        }, [])


        res.status(200).json({
            advernames,
            adverclients
        })

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}
