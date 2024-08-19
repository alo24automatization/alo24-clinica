const {Schema, model, Types} = require('mongoose')
const Joi = require('joi')

const statsionarPayment = new Schema(
    {
        total: {type: Number, required: true},
        payment: {type: Number, required: true},
        type: {type: String, required: true},
        cash: {type: Number},
        card: {type: Number},
        transfer: {type: Number},
        discount: {type: Schema.Types.ObjectId, ref: 'StatsionarDiscount'},
        clinica: {type: Schema.Types.ObjectId, ref: 'Clinica', required: true},
        client: {type: Schema.Types.ObjectId, ref: 'StatsionarClient', required: true},
        connector: {type: Schema.Types.ObjectId, ref: 'StatsionarConnector', required: true},
        comment: {type: String},
        debt: {type: Number},
        isArchive: {type: Boolean, default: false},
    },
    {
        timestamps: true,
    },
)

function validatePayment(payment) {
    const schema = Joi.object({
        total: Joi.number().required(),
        payment: Joi.number().required(),
        type: Joi.string().required(),
        cash: Joi.number(),
        card: Joi.number(),
        transfer: Joi.number(),
        clinica: Joi.string().required(),
        connector: Joi.string().required(),
        client: Joi.string().required(),
        discount: Joi.string(),
        debt: Joi.number(),
        comment: Joi.string()
    })

    return schema.validate(payment)
}

module.exports.validatePayment = validatePayment
module.exports.StatsionarPayment = model('StatsionarPayment', statsionarPayment)
