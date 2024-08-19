const { Schema, model } = require("mongoose");
const Joi = require("joi");

const productConnector = new Schema(
  {
    pieces: { type: Number, required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    clinica: { type: Schema.Types.ObjectId, ref: "Clinica", required: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateProductConnector(productConnector) {
  const schema = Joi.object({
    pieces: Joi.number().required(),
    product: Joi.string().required(),
    service: Joi.string().required(),
    clinica: Joi.string().required(),
  });

  return schema.validate(productConnector);
}

module.exports.validateProductConnector = validateProductConnector;
module.exports.ProductConnector = model("ProductConnector", productConnector);
