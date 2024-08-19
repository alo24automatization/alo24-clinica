const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const daily = new Schema(
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
        ref: 'StatsionarService'
      },
    ],
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'StatsionarProduct'
      },
    ],
    probirka: { type: String },
    reseption: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  },
)

function validateStatsionarDaily(daily) {
  const schema = Joi.object({
    clinica: Joi.string().required(),
    client: Joi.string(),
    connector: Joi.string(),
    services: Joi.array().required(),
    products: Joi.array().required(),
    probirka: Joi.string(),
    reseption: Joi.string(),
  })

  return schema.validate(daily)
}

module.exports.validateStatsionarDaily = validateStatsionarDaily
module.exports.StatsionarDaily = model('StatsionarDaily', daily)
