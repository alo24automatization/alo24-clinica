const { OfflineService } = require("../../models/OfflineClient/OfflineService");
const { Service } = require("../../models/Services/Service");
require('../../models/Services/Department')


module.exports.get = async (req, res) => {
    try {
        const { clinica, beginDay, endDay } = req.body;

        const services = await Service.find({ clinica: clinica })
            .populate('department', 'name')
            .lean();

        for (const service of services) {
            const offlineservices = await OfflineService.find({
                clinica: clinica,
                serviceid: service._id,
                createdAt: {
                    $gte: beginDay,
                    $lte: endDay
                }
            }).lean();

            service.total = offlineservices.length;
        }

        const popularservices = [...services].sort((a, b) => (b.total > a.total ? 1 : -1))

        res.status(200).json(popularservices);

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}