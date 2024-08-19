const { Schema, model } = require("mongoose");
const Joi = require("joi");

const roomtype = new Schema(
  {
    name: { type: String, required: true },
    isArchive: { type: Boolean, default: false },
    clinica: { type: Schema.Types.ObjectId, ref: "Clinica", required: true },
  },
  {
    timestamps: true,
  }
);

function validateRoomType(roomtype) {
  const schema = Joi.object({
    name: Joi.string().required(),
    clinica: Joi.string().required(),
  });

  return schema.validate(roomtype);
}

module.exports.validateRoomType = validateRoomType;
module.exports.RoomType = model("RoomType", roomtype);
