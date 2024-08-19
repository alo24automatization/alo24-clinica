const {Schema, model, Types} = require('mongoose')
const Joi = require('joi')

const offlineDiscount = new Schema(
    {
        total: {type: Number, required: true},
        discount: {type: Number, required: true},
        procient: {type: Number, max: 100},
        payment: {type: Schema.Types.ObjectId, ref: 'OfflinePayment', required: true},
        clinica: {type: Schema.Types.ObjectId, ref: 'Clinica', required: true},
        client: {type: Schema.Types.ObjectId, ref: 'OfflineClient', required: true},
        connector: {type: Schema.Types.ObjectId, ref: 'OfflineConnector', required: true},
        isArchive: {type: Boolean, default: false},
        comment: {type: String, required: true},
        services: [{type: Schema.Types.ObjectId, ref: 'OfflineService'}]
    },
    {
        timestamps: true,
    },
)

function validateDiscount(discount) {
    const schema = Joi.object({
        _id: Joi.string(),
        total: Joi.number().required(),
        discount: Joi.number(),
        procient: Joi.number(),
        payment: Joi.string(),
        clinica: Joi.string().required(),
        connector: Joi.string().required(),
        client: Joi.string().required(),
        comment: Joi.string(),
        services: Joi.array()
    })
    return schema.validate(discount)
}

module.exports.validateDiscount = validateDiscount
module.exports.OfflineDiscount = model('OfflineDiscount', offlineDiscount)
