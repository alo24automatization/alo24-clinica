const {Schema, model, Types} = require("mongoose");
const Joi = require("joi");

const service = new Schema(
    {
        clinica: {type: Schema.Types.ObjectId, ref: "Clinica", required: true},
        isArchive: {type: Boolean, default: false},
        client: {
            type: Schema.Types.ObjectId,
            ref: "OfflineClient",
            required: true,
        },
        connector: {
            type: Schema.Types.ObjectId,
            ref: "OfflineConnector",
            required: true,
        },
        serviceid: {type: Schema.Types.ObjectId, ref: "Service", required: true},
        service: {type: Object},
        pieces: {type: Number},
        department: {
            type: Schema.Types.ObjectId,
            ref: "Department",
            required: true,
        },
        templates: [{type: Object}],
        refuse: {type: Boolean, default: false},
        accept: {type: Boolean, default: false},
        reseption: {type: Schema.Types.ObjectId, ref: "User", required: true},
        doctor: {type: Schema.Types.ObjectId, ref: "User"},
        turn: {type: Number},
        bronday: {type: Date},
        payment: {type: Boolean, default: false},
        comment: {type: String},
        column: {type: Object},
        tables: {type: Array},
        counterdoctor: {type: Schema.Types.ObjectId, ref: "CounterDoctor"},
        files: [{type: String}],
        waitingTime: {type: Date},
        addUser: {type: String},
        clientMoreDetails: {type: {complaints: [String], diagnostics: [String]}, default: null}
    },
    {
        timestamps: true,
    }
);

function validateOfflineService(clientservice) {
    const schema = Joi.object({
        clinica: Joi.string().required(),
        client: Joi.string(),
        connector: Joi.string(),
        serviceid: Joi.string().required(),
        service: Joi.object().required(),
        pieces: Joi.number(),
        department: Joi.string().required(),
        templates: Joi.string(),
        refuse: Joi.boolean(),
        accept: Joi.boolean(),
        reseption: Joi.string().required(),
        doctor: Joi.string(),
        turn: Joi.number(),
        bronday: Joi.date(),
        payment: Joi.boolean(),
        comment: Joi.string(),
        column: Joi.object(),
        tables: Joi.array(),
        counterdoctor: Joi.string(),
        addUser: Joi.string().optional(),
        clientMoreDetails: Joi.object({
            complaints: Joi.array().items(Joi.string()),
            diagnostics: Joi.array().items(Joi.string())
        }).default(null)
    });

    return schema.validate(clientservice);
}

module.exports.validateOfflineService = validateOfflineService;
module.exports.OfflineService = model("OfflineService", service);
