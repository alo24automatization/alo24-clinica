const {Schema, model, Types} = require('mongoose')
const Joi = require('joi')

const connector = new Schema(
    {
        clinica: {type: Schema.Types.ObjectId, ref: 'Clinica', required: true},
        isArchive: {type: Boolean, default: false},
        client: {
            type: Schema.Types.ObjectId,
            ref: 'OnlineClient',
            required: true,
        },
        services: [
            {
                type: Schema.Types.ObjectId,
                ref: 'OnlineService',
                required: true,
            },
        ],
        products: [{type: Schema.Types.ObjectId, ref: 'OnlineProduct'}],
        probirka: {type: Number, default: 0},
        accept: {type: Boolean, default: false},
        totalprice: {type: Number}
        // payment: { type: Schema.Types.ObjectId, ref: 'OnlineProduct' } // To'lovlarni qabul qilingan Idsi kiritiladi
    },
    {
        timestamps: true,
    },
)

function validateOnlineConnector(connector) {
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

module.exports.validateOnlineConnector = validateOnlineConnector
module.exports.OnlineConnector = model('OnlineConnector', connector)
