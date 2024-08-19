const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const connector = new Schema(
    {
        clinica: { type: Schema.Types.ObjectId, ref: 'Clinica', required: true },
        isArchive: { type: Boolean, default: false },
        client: {
            type: Schema.Types.ObjectId,
            ref: 'OfflineClient',
            required: true,
        },
        services: [
            {
                type: Schema.Types.ObjectId,
                ref: 'OfflineService',
                required: true,
            },
        ],
        products: [{ type: Schema.Types.ObjectId, ref: 'OfflineProduct' }],
        probirka: { type: Number, default: 0 },
        accept: { type: Boolean, default: false },
        totalprice: { type: Number },
        isSended: { type: Boolean, default: false },
        payments: [{ type: Schema.Types.ObjectId, ref: 'OfflinePayment' }],
        discount: { type: Schema.Types.ObjectId, ref: 'OfflineDiscount' },
        enterTime: { type: Date }
    },
    {
        timestamps: true,
    },
)

function validateOfflineConnector(connector) {
    const schema = Joi.object({
        clinica: Joi.string().required(),
        client: Joi.string(),
        services: Joi.string(),
        products: Joi.string(),
        probirka: Joi.number(),
        accept: Joi.boolean(),
        totalprice: Joi.number()
    })

    return schema.validate(connector)
}

module.exports.validateOfflineConnector = validateOfflineConnector
module.exports.OfflineConnector = model('OfflineConnector', connector)
