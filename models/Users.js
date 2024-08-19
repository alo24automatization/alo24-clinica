const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const user = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    fathername: { type: String },
    image: { type: String },
    phone: { type: String },
    password: { type: String, min: 6 },
    clinica: { type: Schema.Types.ObjectId, ref: 'Clinica' },
    type: { type: String, required: true },
    specialty: { type: Schema.Types.ObjectId, ref: 'Department' }, // Doctorlarga ixtisosligi ID si yoziladi
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    signature: { type: String },
    statsionar_profit: { type: Number },
    isArchive: { type: Boolean, default: false },
    blanka: { type: String ,required:false,default:null},
    accessCreateClient: { type: Boolean, default: false },
    complaint: {
      type: {
        complaint: { type: [{ name: { type: String } }], default: [] },
        diagnostics: { type: [{ name: { type: String } }], default: [] }
      },
      default: { complaint: [], diagnostics: [] }
    }
  },
  {
    timestamps: true,
  },
)

function validateUser(user) {
  const schema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    fathername: Joi.string(),
    blanka: Joi.string().allow(null).optional(),
    image: Joi.string(),
    phone: Joi.string(),
    signature: Joi.string().optional(),
    password: Joi.string(),
    clinica: Joi.string(),
    type: Joi.string(),
    confirmPassword: Joi.string(),
    specialty: Joi.string(),
    users: Joi.array(),
    user: Joi.string(),
    statsionar_profit: Joi.number().optional(),
    accessCreateClient: Joi.boolean().optional(),
    _id: Joi.string(),
    complaint: Joi.object({
        _id: Joi.string().optional(),
      complaint: Joi.array().items(Joi.object({
        name: Joi.string().required()
      }).optional()).optional(),
      diagnostics: Joi.array().items(Joi.object({
        name: Joi.string().required()
      }).optional()).optional()
    }).optional()
  })

  return schema.validate(user)
}

function validateUserLogin(user) {
  const schema = Joi.object({
    password: Joi.string().required(),
    type: Joi.string(),
  })

  return schema.validate(user)
}

module.exports.validateUser = validateUser
module.exports.validateUserLogin = validateUserLogin
module.exports.User = model('User', user)
