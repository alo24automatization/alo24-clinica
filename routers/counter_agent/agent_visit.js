const { Visit } = require("../../models/CounterDoctor/Visit");
require("../../models/CounterDoctor/CounterDoctor")

module.exports.create = async (req, res) => {
    try {
        const { clinica, counter_agent, counter_doctor, comment } = req.body;
        const visit = new Visit({
            clinica,
            counter_agent,
            counter_doctor,
            comment
        })
        await visit.save()

        res.status(200).json(visit)

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
}

module.exports.edit = async (req, res) => {
    try {
        const {_id, clinica, counter_agent, counter_doctor, comment } = req.body;

        await Visit.findByIdAndUpdate(_id, {
            counter_doctor, comment
        })

        res.status(200).json({message: "OK!"})

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
}


module.exports.get = async (req, res) => {
    try {
        const { clinica, counter_agent, counter_doctor, beginDay, endDay } = req.body;

        let visits = []

        if (counter_doctor) {
            visits = await Visit.find({
                clinica,
                counter_agent,
                counter_doctor,
                createdAt: {
                    $gte: beginDay,
                    $lte: endDay,
                }
            })
            .select('-isArchive -updatedAt -__v')
            .populate('counter_doctor', '-isArchive -updatedAt -__v')
            .lean()
        } else {
            visits = await Visit.find({
                clinica,
                counter_agent,
                createdAt: {
                    $gte: beginDay,
                    $lte: endDay,
                }
            })
            .select('-isArchive -updatedAt -__v')
            .populate('counter_doctor', '-isArchive -updatedAt -__v')
            .lean()
        }

        res.status(200).json(visits);

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });  
    }
}