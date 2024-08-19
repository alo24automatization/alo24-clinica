const {Schema, model, Types} = require("mongoose");
const Joi = require("joi");

const servicetable = new Schema(
    {
        col1: {type: String},
        col2: {type: String},
        col3: {type: String},
        col4: {type: String},
        col5: {type: String},
        service: {type: Types.ObjectId, ref: 'Service'},
        clinica: {type: Schema.Types.ObjectId, ref: "Clinica", required: true},
        doctor: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    },
    {
        timestamps: true,
    }
);

function validateServiceTable(servicetable) {
    const schema = Joi.object({
        col1: Joi.string(),
        col2: Joi.string(),
        col3: Joi.string(),
        col4: Joi.string(),
        col5: Joi.string().allow(),
        service: Joi.string(),
        clinica: Joi.string(),
        doctor: Joi.string()
    });

    return schema.validate(servicetable);
}

module.exports.validateServiceTable = validateServiceTable;
module.exports.ServiceTable = model("ServiceTable", servicetable);
