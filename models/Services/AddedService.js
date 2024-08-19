const { Schema, model, Types } = require("mongoose");
const Joi = require("joi");

const addedservice = new Schema(
    {
        doctor: { type: Schema.Types.ObjectId, ref: "User" },
        service: { type: Schema.Types.ObjectId, ref: "OfflineService" },
        isArchive: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

module.exports.AddedService = model("AddedService", addedservice);