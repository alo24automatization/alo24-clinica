const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const offlineadver = new Schema(
  {
    clinica: { type: Schema.Types.ObjectId, ref: 'Clinica', required: true },
    isArchive: { type: Boolean, default: false },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'OfflineClient',
      required: true,
    },
    connector: {
      type: Schema.Types.ObjectId,
      ref: 'OfflineConnector',
      required: true,
    },
    adver: { type: Schema.Types.ObjectId, ref: "Adver", required: true },
    refuse: { type: Boolean, default: false },
    reseption: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  },
)

function validateOfflineAdver(offlineadver) {
  const schema = Joi.object({
    clinica: Joi.string().required(),
    client: Joi.string(),
    connector: Joi.string(),
    refuse: Joi.boolean(),
    reseption: Joi.string(),
  })

  return schema.validate(offlineadver)
}

module.exports.validateOfflineAdver = validateOfflineAdver
module.exports.OfflineAdver = model('OfflineAdver', offlineadver)
