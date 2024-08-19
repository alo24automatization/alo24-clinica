const {Schema, model, Types} = require('mongoose')
const Joi = require('joi')

const product = new Schema(
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
        productid: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        product: {type: Object},
        pieces: {type: Number, required: true},
        refuse: {type: Boolean, default: false},
        reseption: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        comment: String,
        payment: {type: Boolean, default: true},
    },
    {
        timestamps: true,
    },
)

function validateStatsionarProduct(clientproduct) {
    const schema = Joi.object({
        clinica: Joi.string().required(),
        client: Joi.string(),
        connector: Joi.string(),
        productid: Joi.string().required(),
        product: Joi.object().required(),
        pieces: Joi.number().required(),
        refuse: Joi.boolean(),
        reseption: Joi.string(),
        comment: Joi.string(),
        payment: Joi.boolean()
    })

    return schema.validate(clientproduct)
}

module.exports.validateStatsionarProduct = validateStatsionarProduct
module.exports.StatsionarProduct = model('StatsionarProduct', product)
