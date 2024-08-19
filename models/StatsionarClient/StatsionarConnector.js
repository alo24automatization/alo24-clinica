const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const connector = new Schema(
    {
        clinica: { type: Schema.Types.ObjectId, ref: 'Clinica', required: true },
        isArchive: { type: Boolean, default: false },
        client: {
            type: Schema.Types.ObjectId,
            ref: 'StatsionarClient',
            required: true,
        },
        doctor: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        reseption: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        services: [{ type: Schema.Types.ObjectId, ref: 'StatsionarService' }],
        products: [{ type: Schema.Types.ObjectId, ref: 'StatsionarProduct' }],
        payments: [{ type: Schema.Types.ObjectId, ref: 'StatsionarPayment' }],
        accept: { type: Boolean, default: false },
        totalprice: { type: Number },
        dailys: [
            {
                type: Schema.Types.ObjectId,
                ref: 'StatsionarDaily',
            },
        ],
        room: {
            type: Schema.Types.ObjectId,
            ref: 'StatsionarRoom',
        },
        isSended: { type: Boolean, default: false },
        diagnosis: { type: String },
        discount: { type: Schema.Types.ObjectId, ref: 'StatsionarDiscount' },

        // payment: { type: Schema.Types.ObjectId, ref: 'StatsionarProduct' } // To'lovlarni qabul qilingan Idsi kiritiladi
    },
    {
        timestamps: true,
    },
)

function validateStatsionarConnector(connector) {
    const schema = Joi.object({
        clinica: Joi.string().required(),
        client: Joi.string().optional(),
        doctor: Joi.string(),
        services: Joi.string(),
        products: Joi.string(),
        accept: Joi.boolean(),
        totalprice: Joi.number(),
        room: Joi.string(),
        probirka: Joi.number(),
        reseption: Joi.string(),
        diagnosis: Joi.string(),
        payments: Joi.array(),
        discount: Joi.string()
    })

    return schema.validate(connector)
}

module.exports.validateStatsionarConnector = validateStatsionarConnector
module.exports.StatsionarConnector = model('StatsionarConnector', connector)
