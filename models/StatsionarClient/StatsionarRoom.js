const {Schema, model, Types} = require('mongoose')
const Joi = require('joi')

const room = new Schema(
    {
        clinica: {type: Schema.Types.ObjectId, ref: 'Clinica', required: true},
        isArchive: {type: Boolean, default: false},
        client: {
            type: Schema.Types.ObjectId,
            ref: 'StatsionarClient',
            required: true,
        },
        connector: {
            type: Schema.Types.ObjectId,
            ref: 'StatsionarConnector',
            required: true,
        },
        roomid: {
            type: Schema.Types.ObjectId,
            ref: 'Room',
            required: true,
        },
        room: {type: Object},
        doctor_profit: {type: Number},
        beginday: {type: Date, required: true, default: new Date()},
        endday: {type: Date, default: null},
        reseption: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        counterdoctor: {type: Schema.Types.ObjectId, ref: 'CounterDoctor'},
    },
    {
        timestamps: true,
    },
)

function validateStatsionarRoom(clientroom) {
    const schema = Joi.object({
        clinica: Joi.string().required(),
        client: Joi.string(),
        connector: Joi.string(),
        roomid: Joi.string().required(),
        room: Joi.object().required(),
        beginday: Joi.date(),
        endday: Joi.date(),
        reseption: Joi.string(),
        counterdoctor: Joi.string().optional(),
    })

    return schema.validate(clientroom)
}

module.exports.validateStatsionarRoom = validateStatsionarRoom
module.exports.StatsionarRoom = model('StatsionarRoom', room)
