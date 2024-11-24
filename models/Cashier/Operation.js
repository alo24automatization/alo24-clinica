const { Schema, model, Types } = require("mongoose");

const operation = new Schema(
  {
    price: { type: Number, required: true },
    paymentType: { type: String, required: true },
    client: {
      firstname: { type: String, required: true },
      lastname: { type: String, required: true },
    },
    operator: { type: String, required: true },
    clinica: { type: Schema.Types.ObjectId, ref: "Clinica", required: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports.Operation = model("Operation", operation);
