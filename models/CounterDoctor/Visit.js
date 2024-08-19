const { Schema, model, Types } = require('mongoose')

const visit = new Schema(
    {
        counter_agent: { type: Schema.Types.ObjectId, ref: 'User' },
        counter_doctor: { type: Schema.Types.ObjectId, ref: 'CounterDoctor' },
        clinica: { type: Schema.Types.ObjectId, ref: 'Clinica' },
        comment: { type: String },
        isArchive: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
)

module.exports.Visit = model('Visit', visit)