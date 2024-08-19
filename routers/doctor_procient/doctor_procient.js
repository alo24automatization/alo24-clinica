const { Clinica } = require("../../models/DirectorAndClinica/Clinica");
const {
    OfflineService
} = require('../../models/OfflineClient/OfflineService');
const { StatsionarConnector } = require("../../models/StatsionarClient/StatsionarConnector");
const { User } = require("../../models/Users");
require('../../models/Services/Department')
require("../../models/Users");
require('../../models/OfflineClient/OfflineClient')
require('../../models/StatsionarClient/StatsionarRoom')
require('../../models/StatsionarClient/StatsionarClient')

module.exports.getDocotors = async (req, res) => {
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
        })
            .select('firstname lastname specialty type')
            .populate('specialty', 'name')
            .lean()
            .then(doctors => doctors.filter(doctor => {
                if (doctor.type === 'Laborotory' || doctor.type === 'Doctor') {
                    return doctor.specialty;
                }
            }))


        for (const doctor of doctors) {
            const offlineservices = await OfflineService.find({
                clinica, department: doctor.specialty._id,
                createdAt: {
                    $gte: beginDay,
                    $lte: endDay
                }
            })
                .select('service pieces counterdoctor refuse payment')
                .lean()
                .then(services => services.filter(service => !service.refuse && service.payment))

            const total = offlineservices.reduce((prev, el) => prev + (el.pieces * el.service.price), 0)
            const agent_profit = offlineservices.reduce((prev, el) => {
                const procient = el.service.counterAgentProcient;
                const totalprice = el.pieces * el.service.price;
                if (el.counterdoctor) {
                    if (procient <= 100 && procient > 0) {
                        prev += ((totalprice / 100) * procient);
                    }
                    if (procient > 100) {
                        prev += procient
                    }
                } else {
                    prev = 0
                }
                return prev;
            }, 0) 
            const counterdoctor_profit = offlineservices.reduce((prev, el) => {
                const agent_procient = el.service.counterAgentProcient
                const counterdoctor_procient = el.service.counterDoctorProcient
                const totalprice = el.pieces * el.service.price;
                const totalagent = agent_procient <= 100 && agent_procient > 0 ? totalprice - (Math.round(totalprice / 100) * agent_procient) : agent_procient > 100 ? totalprice - agent_procient : totalprice;
                return prev += el.counterdoctor ? (counterdoctor_procient <= 100 && counterdoctor_procient > 0 ? (Math.round(totalagent / 100) * counterdoctor_procient) : counterdoctor_procient > 100 ? counterdoctor_procient : 0) : 0
            }, 0)
            const profit = offlineservices.reduce((prev, el) => {
                const agent_procient = el.service.counterAgentProcient
                const procient = el.service.doctorProcient
                const counterdoctor_procient = el.service.counterDoctorProcient
                const totalprice = el.pieces * el.service.price;
                const totalagent = agent_procient <= 100 && agent_procient > 0 ? totalprice - (Math.round(totalprice / 100) * agent_procient) : agent_procient > 100 ? totalprice - agent_procient : totalprice;
                const totalcounterdoctor = counterdoctor_procient <= 100 && counterdoctor_procient > 0 ? totalagent - (Math.round(totalagent / 100) * counterdoctor_procient) : counterdoctor_procient > 100 ? totalagent - counterdoctor_procient : totalagent;
                return prev += el.counterdoctor ? (procient <= 100 && procient > 0 ? (Math.round(totalcounterdoctor / 100) * procient) : procient > 100 ? procient : 0) : (procient <= 100 && procient > 0 ? (Math.round(totalprice / 100) * procient) : procient > 100 ? procient : 0)
            }, 0)

            doctor.total = total
            doctor.agent_profit = agent_profit;
            doctor.doctor_profit = profit
            doctor.counterdoctor_profit = counterdoctor_profit
        }


        res.status(200).json(doctors)
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
}

module.exports.getStatsionar = async (req, res) => {
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
        })
            .select('firstname lastname specialty type')
            .populate('specialty', 'name')
            .lean()
            .then(doctors => doctors.filter(doctor => {
                if (doctor.type === 'Laborotory' || doctor.type === 'Doctor') {
                    return doctor.specialty;
                }
            }))

        for (const doctor of doctors) {
            const connectors = await StatsionarConnector.find({
                clinica, doctor: doctor._id,
                createdAt: {
                    $gte: beginDay,
                    $lte: endDay
                }
            })
                .populate('room')
                .lean()
                .then(services => services.filter(service => !service.refuse))

            doctor.total = connectors.reduce((prev, connector) => {
                const sum = Math.round(
                    Math.abs(
                        ((connector.room.endday ? new Date(connector.room.endday).getTime() : new Date().getTime())
                            -
                            new Date(connector.room.beginday).getTime())
                        /
                        (24 * 60 * 60 * 1000)
                    )
                ) * connector.room.room.price;
                prev += sum;
                return prev;
            }, 0)
            doctor.profit = connectors.reduce((prev, connector) => {
                const procient = connector.room.room.doctorProcient;
                const totalprice = Math.round(
                    Math.abs(
                        ((connector.room.endday ? new Date(connector.room.endday).getTime() : new Date().getTime())
                            -
                            new Date(connector.room.beginday).getTime())
                        /
                        (24 * 60 * 60 * 1000)
                    )
                ) * connector.room.room.price

                if (procient <= 100 && procient > 0) {
                    prev += ((totalprice / 100) * procient);
                }
                if (procient > 100) {
                    prev += procient
                }
                return prev;
            }, 0)
        }

        res.status(200).json(doctors)

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
}

module.exports.get = async (req, res) => {
    try {
        const { department, beginDay, endDay } = req.body;

        const offlineservices = await OfflineService.find({
            department, createdAt: {
                $gte: beginDay,
                $lte: endDay
            }
        })
            .select('service payment pieces department counterdoctor refuse')
            .populate('client', 'firstname lastname')
            .populate({
                path: 'department',
                select: "doctor",
                populate: {
                    path: "doctor",
                    select: "firstname lastname"
                }
            })
            .lean()
            .then(services => services.filter(service => !service.refuse && service.payment))

        for (const service of offlineservices) {
            // const procient = service.service.doctorProcient;
            // const agent_procient = service.service.counterAgentProcient;
            // const totalprice = service.service.price * service.pieces;
            // const total = agent_procient <= 100 && agent_procient > 0 ? ((totalprice / 100) * agent_procient) : agent_procient > 100 ? totalprice - agent_procient : totalprice

            // service.totalprice = totalprice;

            // service.agent_profit = agent_procient <= 100 && agent_procient > 0 ? ((totalprice / 100) * agent_procient) : agent_procient > 100 ? agent_procient : 0
            // service.doctor_profit = procient <= 100 && procient > 0 ? total - ((total / 100) * procient) : procient > 100 ? total - procient : 0

            const agent_procient = service.service.counterAgentProcient
            const procient = service.service.doctorProcient
            const counterdoctor_procient = service.service.counterDoctorProcient

            const totalprice = service.pieces * service.service.price;

            const totalagent = agent_procient <= 100 && agent_procient > 0 ? totalprice - (Math.round(totalprice / 100) * agent_procient) : agent_procient > 100 ? totalprice - agent_procient : totalprice;
            const agent_profit = service.counterdoctor ? (agent_procient <= 100 && agent_procient > 0 ? (Math.round(totalprice / 100) * agent_procient) : agent_procient > 100 ? agent_procient : 0) : 0

            const totalcounterdoctor = counterdoctor_procient <= 100 && counterdoctor_procient > 0 ? totalagent - (Math.round(totalagent / 100) * counterdoctor_procient) : counterdoctor_procient > 100 ? totalagent - counterdoctor_procient : totalagent;
            const counterdoctor_profit = service.counterdoctor ? (counterdoctor_procient <= 100 && counterdoctor_procient > 0 ? (Math.round(totalagent / 100) * counterdoctor_procient) : counterdoctor_procient > 100 ? counterdoctor_procient : 0): 0

            const doctor_profit = service.counterdoctor ? (procient <= 100 && procient > 0 ? (Math.round(totalcounterdoctor / 100) * procient) : procient > 100 ? procient : 0) : (procient <= 100 && procient > 0 ? (Math.round(totalprice / 100) * procient) : procient > 100 ? procient : 0)

            service.totalprice = totalprice;
            service.agent_profit = agent_profit
            service.counterdoctor_profit = counterdoctor_profit
            service.doctor_profit = doctor_profit
        }

        res.status(200).json(offlineservices)
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
}


module.exports.getDocotorsStatsionar = async (req, res) => {
    try {
        const { doctor } = req.body;

        const connectors = await StatsionarConnector.find({
            doctor
        })
            .select('-__v -isArchive -updatedAt')
            .populate('room')
            .populate('client')
            .lean()

        for (const connector of connectors) {
            const procient = connector.room.room.doctorProcient
            const days = Math.round(
                Math.abs(
                    ((connector.room.endday ? new Date(connector.room.endday).getTime() : new Date().getTime())
                        -
                        new Date(connector.room.beginday).getTime())
                    /
                    (24 * 60 * 60 * 1000)
                )
            )

            const total = days * connector.room.room.price;

            let profit = 0
            if (procient <= 100 && procient > 0) {
                profit += ((total / 100) * procient);
            }
            if (procient > 100) {
                profit += procient
            }

            connector.days = days;
            connector.total = total;
            connector.profit = profit;
        }

        res.status(200).json(connectors)

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
}