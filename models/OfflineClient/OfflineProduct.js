const {Schema, model, Types} = require('mongoose')
const Joi = require('joi')

const product = new Schema(
    {
        clinica: {type: Schema.Types.ObjectId, ref: 'Clinica', required: true},
        isArchive: {type: Boolean, default: false},
        client: {
            type: Schema.Types.ObjectId,
            ref: 'OfflineClient',
            required: true,
        },
        connector: {
            type: Schema.Types.ObjectId,
            ref: 'OfflineConnector',
            required: true,
        },
        productid: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        service: {
            type: Schema.Types.ObjectId,
            ref: 'OfflineService'
        },
        product: {type: Object},
        pieces: {type: Number, required: true},
        refuse: {type: Boolean, default: false},
        reseption: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        payment: {type: Boolean, default: false},
        comment: {type: String}
    },
    {
        timestamps: true,
    },
)

function validateOfflineProduct(clientproduct) {
    const schema = Joi.object({
        clinica: Joi.string().required(),
        client: Joi.string(),
        connector: Joi.string(),
        productid: Joi.string().required(),
        product: Joi.object().required(),
        pieces: Joi.number().required(),
        refuse: Joi.boolean(),
        reseption: Joi.string(),
        payment: Joi.boolean(),
        comment: Joi.string()
    })

    return schema.validate(clientproduct)
}

module.exports.validateOfflineProduct = validateOfflineProduct
module.exports.OfflineProduct = model('OfflineProduct', product)
