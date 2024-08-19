const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const adver = new Schema(
  {
    name: { type: String, required: true },
    clinica: { type: Schema.Types.ObjectId, ref: 'Clinica', required: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

function validateAdver(adver) {
  const schema = Joi.object({
    name: Joi.string().required(),
    clinica: Joi.string().required(),
  })

  return schema.validate(adver)
}

module.exports.validateAdver = validateAdver
module.exports.Adver = model('Adver', adver)
