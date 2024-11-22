const { Schema, model, Types } = require("mongoose");

const doctor = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    counter_agent: { type: Schema.Types.ObjectId, ref: "User", required: true },
    clinica: { type: Schema.Types.ObjectId, ref: "Clinica" },
    clinica_name: { type: String, required: false, default: null },
    phone: { type: String, required: false, default: null },
    statsionar_profit: { type: Number, default: 0 },
    isArchive: { type: Boolean, default: false },
    services_profits: [
      {
        service: { type: Schema.Types.ObjectId, ref: "Service" },
        profit: { type: String, default: "" },
        profitInSum: { type: Number, default: 0 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports.CounterDoctor = model("CounterDoctor", doctor);
