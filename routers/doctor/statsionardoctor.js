const { Clinica } = require("../../models/DirectorAndClinica/Clinica");
const { StatsionarConnector } = require("../../models/StatsionarClient/StatsionarConnector");
const { User } = require("../../models/Users");
require('../../models/Services/Department')
require('../../models/StatsionarClient/StatsionarRoom')
require('../../models/StatsionarClient/StatsionarClient')


module.exports.getStatsionarDoctor = async (req, res) => {
    try {
        const { clinica, beginDay, endDay } = req.body;

        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        const doctors = await User.find({
            clinica,
            type: "Doctor"
        })
            .select('-isArchive -password -updatedAt -__v')
            .populate('specialty', 'name')
            .lean()

        for (const doctor of doctors) {
            const statsionars = await StatsionarConnector.find({
                clinica,
                doctor: doctor._id
            })
            .select('room')
            .populate('room', '-__v -updatedAt -isArchive')
            .lean()
            .then(statsionars => statsionars.filter(s => {
                return s?.room?.endday && (new Date(new Date(s?.room?.endday).setUTCHours(0, 0, 0, 0)).toISOString() >= new Date(new Date(beginDay).setUTCHours(0, 0, 0, 0)).toISOString() && new Date(new Date(s?.room?.endday).setUTCHours(0, 0, 0, 0)).toISOString() <= new Date(new Date(endDay).setUTCHours(0, 0, 0, 0)).toISOString())
            }))

            doctor.total = statsionars.reduce((prev, el) => prev + (Math.round(
                Math.abs(
                  (new Date(el.room.beginday).getTime()
                    -
                    new Date(el.room.endday).getTime())
                  /
                  (24 * 60 * 60 * 1000)
                )
              ) * el.room.room.price), 0)

            doctor.profit = statsionars.reduce((prev, el) => {
                const roomprice = Math.round(
                    Math.abs(
                      (new Date(el.room.beginday).getTime()
                        -
                        new Date(el.room.endday).getTime())
                      /
                      (24 * 60 * 60 * 1000)
                    )
                  ) * el.room.room.price;
                  const procient =  el.room.doctor_profit || 0;
                  const profit = procient > 100 ? procient : (roomprice / 100) * procient
                  return prev += profit;
            }, 0)
        }

        res.status(200).json(doctors)
        
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

module.exports.getStatsionarRoom = async (req, res) => {
    try {
        const { doctor, beginDay, endDay } = req.body;

        const statsionars = await StatsionarConnector.find({
            doctor: doctor
        })
        .select('room client')
        .populate('room', '-__v -updatedAt -isArchive')
        .populate('client', 'firstname lastname fullname')
        .lean()
        .then(statsionars => statsionars.filter(s => s?.room?.endday && (new Date(new Date(s?.room?.endday).setUTCHours(0, 0, 0, 0)).toISOString() >= new Date(new Date(beginDay).setUTCHours(0, 0, 0, 0)).toISOString() && new Date(new Date(s?.room?.endday).setUTCHours(0, 0, 0, 0)).toISOString() <= new Date(new Date(endDay).setUTCHours(0, 0, 0, 0)).toISOString())))

        res.status(200).send(statsionars);
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}