const {Schema, model, Types} = require('mongoose')
const Joi = require('joi')

const client = new Schema(
    {
        clinica: {type: Schema.Types.ObjectId, ref: 'Clinica'},
        isArchive: {type: Boolean, default: false},
        firstname: {type: String, required: true},
        lastname: {type: String, required: true},
        fathername: {type: String},
        fullname: {type: String},
        born: {type: Date},
        gender: {type: String, required: true},
        phone: {type: String, required: true},
        address: {type: String},
        connectors: [{type: Schema.Types.ObjectId, ref: 'StatsionarConnector'}],
        reseption: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        id: {type: String},
        diagnosis: {type: String},
        department: {type: String},
        bloodgroup: {type: String},
        rezus: {type: String},
        medicineresult: {type: String},
        height: {type: String},
        weight: {type: String},
        temperature: {type: String},
        relative_info: {type: String},
        profession_info: {type: String},
        sending_info: {type: String},
        isAmbulance: {type: String},
        ambulance_transport: {type: String},
        start_sickness: {type: String},
        conter_diagnosis: {type: String},
        clientcard: {type: String},
        templates: {type: Array},
        conclusions: {type: Array},
        id2: {type: String},
        national: {type: String, required: true}
    },
    {
        timestamps: true,
    },
)

function validateClient(client) {
    const schema = Joi.object({
        _id: Joi.any(),
        clinica: Joi.string(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        fathername: Joi.string(),
        gender: Joi.string(),
        born: Joi.date(),
        phone: Joi.string(),
        address: Joi.string(),
        connectors: Joi.string(),
        reseption: Joi.string().required(),
        id2: Joi.string(),
        national: Joi.string().required()
    })

    return schema.validate(client)
}

module.exports.validateStatsionarClient = validateClient
module.exports.StatsionarClient = model('StatsionarClient', client)
