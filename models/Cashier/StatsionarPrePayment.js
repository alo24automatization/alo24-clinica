const {Schema, model, Types} = require('mongoose')
const Joi = require('joi')

const statsionarPrePayment = new Schema(
    {
        payment: {type: Number, required: true},
        type: {type: String, required: true},
        cash: {type: Number},
        card: {type: Number},
        transfer: {type: Number},
        clinica: {type: Schema.Types.ObjectId, ref: 'Clinica', required: true},
        client: {type: Schema.Types.ObjectId, ref: 'StatsionarClient', required: true},
        connector: {type: Schema.Types.ObjectId, ref: 'StatsionarConnector', required: true},
        isArchive: {type: Boolean, default: false},
    },
    {
        timestamps: true,
    },
)

function validatePrePayment(payment) {
    const schema = Joi.object({
        payment: Joi.number().required(),
        type: Joi.string().required(),
        cash: Joi.number(),
        card: Joi.number(),
        transfer: Joi.number(),
        clinica: Joi.string().required(),
        connector: Joi.string().required(),
        client: Joi.string().required(),
    })

    return schema.validate(payment)
}

module.exports.validatePayment = validatePrePayment
module.exports.StatsionarPrePayment = model('StatsionarPrePayment', statsionarPrePayment)
