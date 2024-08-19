const {Schema, model, Types} = require("mongoose");
const Joi = require("joi");

const department = new Schema(
    {
        name: {type: String, required: true},
        probirka: {type: Boolean, required: true, default: false},
        clinica: {type: Schema.Types.ObjectId, ref: "Clinica", required: true},
        services: [{type: Schema.Types.ObjectId, ref: "Service"}],
        servicetypes: [{type: Schema.Types.ObjectId, ref: "ServiceType"}],
        doctor: {type: Schema.Types.ObjectId, ref: "User"},
        letter: {type: String, required: false},
        floor: {type: String, required: false},
        stopTurn:{type:Boolean,default:false,required:false},
        room: {type: Number},
        workStart: {type: String},
        waitingTime: {type: Number},
        isArchive: {type: Boolean, default: false},

    },
    {
        timestamps: true,
    }
);

function validateDepartment(department) {
    const schema = Joi.object({
        name: Joi.string().required(),
        room: Joi.number(),
        letter:Joi.string().optional(),
        stopTurn:Joi.boolean().optional(),
        floor:Joi.string().optional(),
        probirka: Joi.boolean().required(),
        workStart: Joi.string().optional(),
        waitingTime: Joi.number().optional(),
        clinica: Joi.string().required(),
    });

    return schema.validate(department);
}

module.exports.validateDepartment = validateDepartment;
module.exports.Department = model("Department", department);
