const {Schema, model, Types} = require('mongoose')
const Joi = require('joi')

const product = new Schema(
    {
        clinica: {type: Schema.Types.ObjectId, ref: 'Clinica', required: true},
        isArchive: {type: Boolean, default: false},
        client: {
            type: Schema.Types.ObjectId,
            ref: 'OnlineClient',
            required: true,
        },
        connector: {
            type: Schema.Types.ObjectId,
            ref: 'OnlineConnector',
            required: true,
        },
        productid: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        product: {type: Object},
        pieces: {type: Number, required: true},
        refuse: {type: Boolean, default: false},
        reseption: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    },
    {
        timestamps: true,
    },
)

function validateOnlineProduct(clientproduct) {
    const schema = Joi.object({
        clinica: Joi.string().required(),
        client: Joi.string(),
        connector: Joi.string(),
        productid: Joi.string().required(),
        product: Joi.object().required(),
        pieces: Joi.number().required(),
        refuse: Joi.boolean(),
        reseption: Joi.string(),
    })

    return schema.validate(clientproduct)
}

module.exports.validateOnlineProduct = validateOnlineProduct
module.exports.OnlineProduct = model('OnlineProduct', product)
