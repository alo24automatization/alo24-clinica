const { Schema, model } = require("mongoose");
const Joi = require("joi");

const product = new Schema(
  {
    name: { type: String, required: true },
    unit: { type: String, required: true },
    price: { type: Number, required: true },
    total: { type: Number, default: 0 },
    minimum: { type: Number, required: true },
    clinica: { type: Schema.Types.ObjectId, ref: "Clinica", required: true },
    productconnectors: [
      { type: Schema.Types.ObjectId, ref: "ProductConnector" },
    ],
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateProduct(product) {
  const schema = Joi.object({
    name: Joi.string().required(),
    unit: Joi.string().required(),
    price: Joi.number().required(),
    total: Joi.number(),
    minimum: Joi.number(),
    clinica: Joi.string().required(),
  });

  return schema.validate(product);
}

module.exports.validateProduct = validateProduct;
module.exports.Product = model("Product", product);
