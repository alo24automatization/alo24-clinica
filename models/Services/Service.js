const { Schema, model, Types } = require("mongoose");
const Joi = require("joi");

const service = new Schema(
    {
        name: { type: String, required: true },
        shortname: { type: String },
        price: { type: Number, required: true },
        serviceroom: { type: Number },
        department: { type: Schema.Types.ObjectId, ref: "Department" },
        servicetype: { type: Schema.Types.ObjectId, ref: "ServiceType" },
        clinica: { type: Schema.Types.ObjectId, ref: "Clinica", required: true },
        productconnectors: [{ type: Schema.Types.ObjectId, ref: "ProductConnector" }],
        doctorProcient: { type: Number },
        counterAgentProcient: { type: Number },
        counterDoctorProcient: { type: Number },
        isArchive: { type: Boolean, default: false },
        place: { type: Number },
        visible: { type: Boolean, default: false },
        tables: [{ type: Schema.Types.ObjectId, ref: "ServiceTable" }],
        column: { type: Schema.Types.ObjectId, ref: "TableColumn" },
        templates: [{ type: Schema.Types.ObjectId, ref: "Template" }]
    },
    {
        timestamps: true,
    }
);

function validateService(service) {
    const schema = Joi.object({
        name: Joi.string().required(),
        shortname: Joi.string(),
        price: Joi.number().required(),
        department: Joi.string().required(),
        servicetype: Joi.string(),
        clinica: Joi.string().required(),
        doctorProcient: Joi.number(),
        counterAgentProcient: Joi.number(),
        counterDoctorProcient: Joi.number(),
        place: Joi.number(),
        serviceroom: Joi.number()
    });

    return schema.validate(service);
}

module.exports.validateService = validateService;
module.exports.Service = model("Service", service);
