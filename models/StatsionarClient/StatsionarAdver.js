const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const statsionaradver = new Schema(
  {
    clinica: { type: Schema.Types.ObjectId, ref: 'Clinica', required: true },
    isArchive: { type: Boolean, default: false },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'StatsionarClient',
      required: true,
    },
    connector: {
      type: Schema.Types.ObjectId,
      ref: 'StatsionarConnector',
      required: true,
    },
    refuse: { type: Boolean, default: false },
    reseption: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  },
)

function validateStatsionarAdver(statsionaradver) {
  const schema = Joi.object({
    clinica: Joi.string().required(),
    client: Joi.string(),
    connector: Joi.string(),
    refuse: Joi.boolean(),
    reseption: Joi.string(),
  })

  return schema.validate(statsionaradver)
}

module.exports.validateStatsionarAdver = validateStatsionarAdver
module.exports.StatsionarAdver = model('StatsionarAdver', statsionaradver)
