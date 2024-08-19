const {Schema, model, Types} = require('mongoose')

const conclusiontemp = new Schema(
    {
        clinica: {type: Schema.Types.ObjectId, ref: 'Clinica', required: true},
        isArchive: {type: Boolean, default: false},
        name: {type: String, required: true},
        template: {type: String, required: true},
    },
    {
        timestamps: true,
    },
)

module.exports.ConclusionTemp = model('ConclusionTemp', conclusiontemp)