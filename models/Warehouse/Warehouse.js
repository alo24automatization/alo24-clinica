const { Schema, model } = require("mongoose");
const Joi = require("joi");

const warehouse = new Schema(
  {
    total: { type: Number, required: true },
    dateofreciept: { type: Object },
    price: { type: Number, required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    clinica: { type: Schema.Types.ObjectId, ref: "Clinica", required: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateWarehouse(warehouse) {
  const schema = Joi.object({
    dateofreciept: Joi.object(),
    total: Joi.number().required(),
    price: Joi.number().required(),
    product: Joi.string().required(),
    clinica: Joi.string().required(),
  });

  return schema.validate(warehouse);
}

module.exports.validateWarehouse = validateWarehouse;
module.exports.Warehouse = model("Warehouse", warehouse);
