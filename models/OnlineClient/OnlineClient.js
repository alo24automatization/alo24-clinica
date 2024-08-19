const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const client = new Schema(
    {
        clinica: { type: Schema.Types.ObjectId, ref: 'Clinica' },
        isArchive: { type: Boolean, default: false },
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        fathername: { type: String },
        brondate: { type: Date, required: true },
        bronTime: { type: String, required: false },
        queue: { type: Number, required: false },
        phone: { type: String, required: true },
        department: {
            type: Schema.Types.ObjectId,
            ref: "Department",
            required: true,
        },
        reseption: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        service: [{ type: Schema.Types.ObjectId, ref: "Service", required: true }],
        serviceType: { type: Schema.Types.ObjectId, ref: "ServiceType", required: true },
    },
    {
        timestamps: true,
    },
)

function validateClient(client) {
    const schema = Joi.object({
        clinica: Joi.string().required(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        fathername: Joi.string(),
        brondate: Joi.date(),
        phone: Joi.string(),
        department: Joi.string(),
        reseption: Joi.string(),
        service: Joi.array(),
        serviceType: Joi.string(),
        bronTime: Joi.optional(),
        queue: Joi.optional(),
    })

    return schema.validate(client)
}

module.exports.validateOnlineClient = validateClient
module.exports.OnlineClient = model('OnlineClient', client)
