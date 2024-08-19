const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const expense = new Schema(
    {
        total: { type: Number, required: true },
        type: { type: String, required: true },
        comment: { type: String, required: true },
        clinica: { type: Schema.Types.ObjectId, ref: 'Clinica', required: true },
        isArchive: { type: Boolean, default: false }
    },
    {
        timestamps: true,
    },
)

module.exports.Expense = model('Expense', expense)
