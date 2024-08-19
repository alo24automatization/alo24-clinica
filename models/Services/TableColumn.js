const {Schema, model, Types} = require("mongoose");
const Joi = require("joi");

const tableColumn = new Schema(
    {
        col1: {type: String},
        col2: {type: String},
        col3: {type: String},
        col4: {type: String},
        col5: {type: String},
        service: {type: Types.ObjectId, ref: 'Service', required: true},
        clinica: {type: Schema.Types.ObjectId, ref: "Clinica", required: true},
        doctor: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    },
    {
        timestamps: true,
    }
);

function validateTableColumn(tablecolumn) {
    const schema = Joi.object({
        col1: Joi.string(),
        col2: Joi.string(),
        col3: Joi.string(),
        col4: Joi.string(),
        col5: Joi.string(),
        table: Joi.string(),
        service: Joi.string(),
        clinica: Joi.string(),
        doctor: Joi.string()
    });

    return schema.validate(tablecolumn);
}

module.exports.validateTableColumn = validateTableColumn;
module.exports.TableColumn = model("TableColumn", tableColumn);
