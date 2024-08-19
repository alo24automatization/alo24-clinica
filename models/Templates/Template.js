const {Schema, model, Types} = require('mongoose')
const Joi = require('joi')

const template = new Schema(
    {
        clinica: {type: Schema.Types.ObjectId, ref: 'Clinica', required: true},
        isArchive: {type: Boolean, default: false},
        doctor: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {type: String, required: true},
        template: {type: String, required: true},
    },
    {
        timestamps: true,
    },
)

function validateTemplate(template) {
    const schema = Joi.object({
        clinica: Joi.string().required(),
        doctor: Joi.string(),
        name: Joi.string(),
        template: Joi.string(),
    })

    return schema.validate(template)
}

module.exports.validateTemplate = validateTemplate
module.exports.Template = model('Template', template)
