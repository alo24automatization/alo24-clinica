const {Schema, model, Types} = require("mongoose");
const Joi = require("joi");
const {Clinica} = require("../DirectorAndClinica/Clinica");

const client = new Schema(
    {
        clinica: {type: Schema.Types.ObjectId, ref: "Clinica"},
        isArchive: {type: Boolean, default: false},
        firstname: {type: String, required: true},
        lastname: {type: String, required: true},
        fathername: {type: String},
        fullname: {type: String},
        isDisability: {type: Boolean, required: false, default: false},
        card_number: {type: Number, default: null, required: false},
        born: {type: Date},
        department: {
            type: Schema.Types.ObjectId,
            ref: "Department",
            required: true,
        },
        gender: {type: String},
        phone: {type: String},
        address: {type: String},
        connectors: [{type: Schema.Types.ObjectId, ref: "OfflineConnector"}],
        reseption: {type: Schema.Types.ObjectId, ref: "User", required: true},
        id: {type: Number},
        national: {type: String},
        was_online: {type: Boolean, default: false},

        brondate: {type: Date, default: null},
        bronTime: {type: String, default: null},
    },
    {
        timestamps: true,
    }
);

async function validateClient(client) {
    // Fetch clinic settings
    const clinic = await Clinica.findById(client.clinica);
    const requiredFields = clinic.requiredFields || {};

    // Build the validation schema
    const schema = Joi.object({
        clinica: Joi.string(),
        firstname: Joi.string().required(),
        isDisability: Joi.boolean().default(false).optional(),
        card_number: Joi.string(),
        lastname: Joi.string().required(),
        fathername: requiredFields.get("fathername")
            ? Joi.string().required()
            : Joi.string(),
        gender: requiredFields.get("gender")
            ? Joi.string().required()
            : Joi.string(),
        born: requiredFields.get("born") ? Joi.date().required() : Joi.date(),
        phone: requiredFields.get("phone") ? Joi.string().required() : Joi.string(),
        address: requiredFields.get("address")
            ? Joi.string().required()
            : Joi.string(),
        connectors: Joi.string(),
        reseption: Joi.string().required(),
        national: requiredFields.get("nation")
            ? Joi.string().required()
            : Joi.string(),
        department: Joi.string().required()
    });

    return schema.validate(client);
}

module.exports.validateOfflineClient = validateClient;
module.exports.OfflineClient = model("OfflineClient", client);
