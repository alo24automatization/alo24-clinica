const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const statsionarcounteragent = new Schema(
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
    services: [
      {
        type: Schema.Types.ObjectId,
        ref: 'StatsionarService',
        required: true,
      },
    ],
    counteragent: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    counterdoctor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    refuse: { type: Boolean, default: false },
    reseption: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  },
)

function validateStatsionarCounteragent(statsionarcounteragent) {
  const schema = Joi.object({
    clinica: Joi.string().required(),
    client: Joi.string(),
    connector: Joi.string(),
    services: Joi.array().required(),
    refuse: Joi.boolean(),
    reseption: Joi.string(),
  })

  return schema.validate(statsionarcounteragent)
}

module.exports.validateStatsionarCounteragent = validateStatsionarCounteragent
module.exports.StatsionarCounteragent = model(
  'StatsionarCounteragent',
  statsionarcounteragent,
)
