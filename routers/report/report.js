// const { OfflineService } = require("../../models/OfflineClient/OfflineService");



// module.exports.getProfit = async (req, res) => {
//     try {
//         const {clinica, beginDay, endDay} = req.body;

//         const offlineservices = await OfflineService.find({
//             clinica,
//             createdAt: {
//                 $gte: beginDay,
//                 $lte: endDay
//             }
//         })
//         .select('-__v -isArchive -updatedAt')


//     } catch (error) {
        
//     }
// }