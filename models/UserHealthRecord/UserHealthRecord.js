const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi'); // Import Joi


// Define the UserHealthRecord Schema
const UserHealthRecordSchema = new Schema({
    doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, default: null },
    type: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

UserHealthRecordSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});



const userHealthRecordSchema = Joi.object({
    doctor: Joi.string().required(),
    name: Joi.string()
});

// Validation function
function validateUserHealthRecord(data) {
    return userHealthRecordSchema.validate(data);
}

// Create the Mongoose model
const UserHealthRecord = mongoose.model('UserHealthRecord', UserHealthRecordSchema);

// Export the model and validation function
module.exports = {
    UserHealthRecord,
    validateUserHealthRecord,
};
