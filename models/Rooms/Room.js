const { Schema, model } = require("mongoose");
const Joi = require("joi");

const room = new Schema(
  {
    type: { type: String, required: true },
    number: { type: String, required: true },
    price: { type: Number, required: true },
    place: { type: Number, required: true },
    position: { type: Boolean, default: false },
    doctorProcient: { type: Number },
    nurseProcient: { type: Number },
    isArchive: { type: Boolean, default: false },
    clinica: { type: Schema.Types.ObjectId, ref: "Clinica", required: true },
  },
  {
    timestamps: true,
  }
);

function validateRoom(room) {
  const schema = Joi.object({
    type: Joi.string().required(),
    number: Joi.required(),
    price: Joi.number().required(),
    place: Joi.number().required(),
    position: Joi.boolean(),
    clinica: Joi.string().required(),
    doctorProcient: Joi.number(),
    nurseProcient: Joi.number()
  });

  return schema.validate(room);
}

module.exports.validateRoom = validateRoom;
module.exports.Room = model("Room", room);
