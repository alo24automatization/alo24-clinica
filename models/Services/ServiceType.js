const { Schema, model, Types } = require("mongoose");
const Joi = require("joi");

const servicetype = new Schema(
  {
    name: { type: String, required: true },
    services: [{ type: Schema.Types.ObjectId, ref: "Service", required: true }],
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    clinica: { type: Schema.Types.ObjectId, ref: "Clinica", required: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateServiceType(servicetype) {
  const schema = Joi.object({
    name: Joi.string().required(),
    department: Joi.string().required(),
    clinica: Joi.string().required(),
  });

  return schema.validate(servicetype);
}

module.exports.validateServiceType = validateServiceType;
module.exports.ServiceType = model("ServiceType", servicetype);
