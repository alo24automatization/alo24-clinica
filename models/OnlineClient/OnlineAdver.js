const {Schema, model, Types} = require('mongoose')
const Joi = require('joi')

const onlineAdver = new Schema(
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
        refuse: {type: Boolean, default: false},
        reseption: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    },
    {
        timestamps: true,
    },
)

function validateOnlineAdver(onlineadver) {
    const schema = Joi.object({
        clinica: Joi.string().required(),
        client: Joi.string(),
        connector: Joi.string(),
        refuse: Joi.boolean(),
        reseption: Joi.string(),
    })

    return schema.validate(onlineadver)
}

module.exports.validateOnlineAdver = validateOnlineAdver
module.exports.OnlineAdver = model('OnlineAdver', onlineAdver)
