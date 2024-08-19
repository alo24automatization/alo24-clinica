const { Schema, model, Types } = require("mongoose");
const Joi = require("joi");

const director = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    fathername: { type: String },
    image: { type: String },
    phone: { type: String },
    password: { type: String, min: 6, required: true },
    clinica: { type: Schema.Types.ObjectId, ref: "Clinica" },
    type: { type: String, required: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateDirector(director) {
  const schema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    fathername: Joi.string(),
    image: Joi.string(),
    phone: Joi.string(),
    password: Joi.string().required(),
    clinica: Joi.string(),
    type: Joi.string(),
    confirmPassword: Joi.string()
  });

  return schema.validate(director);
}

function validateDirectorLogin(director) {
  const schema = Joi.object({
    password: Joi.string().required(),
    type: Joi.string(),
  });

  return schema.validate(director);
}

module.exports.validateDirector = validateDirector;
module.exports.validateDirectorLogin = validateDirectorLogin;
module.exports.Director = model("Director", director);
