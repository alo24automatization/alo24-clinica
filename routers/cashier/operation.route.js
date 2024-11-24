const { Operation } = require("../../models/Cashier/Operation");
const { Clinica } = require("../../models/DirectorAndClinica/Clinica");

module.exports = {
  create: async (req, res) => {
    try {
      const { price, client, operator, paymentType, clinica } = req.body;

      const clinic = await Clinica.findById(clinica);
      if (!clinic) {
        return res.status(400).json({
          message: "Diqqat! Klinika ma'lumotlari topilmadi.",
        });
      }

      const operation = new Operation({
        price,
        client,
        operator,
        paymentType,
        clinica,
      });

      await operation.save();

      res.status(200).json({ message: "Operatsiya yaratildi!" });
    } catch (error) {
      console.log(error);
      res.status(501).json({
        error: "Serverda xatolik yuz berdi...",
        message: error.message,
      });
    }
  },

  findAll: async (req, res) => {
    try {
      const { clinica } = req.query;

      const query = clinica ? { clinica } : {};
      const operations = await Operation.find(query);

      res.status(200).json(operations);
    } catch (error) {
      console.log(error);
      res.status(501).json({
        error: "Serverda xatolik yuz berdi...",
        message: error.message,
      });
    }
  },
  findAllAndTotalPrice: async (req, res) => {
    try {
      const { clinica } = req.query;

      const query = clinica ? { clinica } : {};
      const operations = await Operation.find(query);
      const total = operations.reduce(
        (sum, element) => sum + element.price,
        0
      );
      res.status(200).json({ operations, total });
    } catch (error) {   
      console.log(error);
      res.status(501).json({
        error: "Serverda xatolik yuz berdi...",
        message: error.message,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const operation = await Operation.findByIdAndDelete(id);
      if (!operation) {
        return res.status(404).json({ message: "Operatsiya topilmadi." });
      }

      res
        .status(200)
        .json({ message: "Operatsiya muvaffaqiyatli o'chirildi." });
    } catch (error) {
      console.log(error);
      res.status(501).json({
        error: "Serverda xatolik yuz berdi...",
        message: error.message,
      });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { price, client, paymentType, clinica } = req.body;

      const operation = await Operation.findById(id);
      if (!operation) {
        return res.status(404).json({ message: "Operatsiya topilmadi." });
      }

      if (clinica) {
        const clinic = await Clinica.findById(clinica);
        if (!clinic) {
          return res.status(400).json({
            message: "Diqqat! Klinika ma'lumotlari topilmadi.",
          });
        }
        operation.clinica = clinica;
      }

      operation.price = price || operation.price;
      operation.client = client || operation.client;
      operation.paymentType = paymentType || operation.paymentType;

      await operation.save();

      res
        .status(200)
        .json({ message: "Operatsiya muvaffaqiyatli yangilandi." });
    } catch (error) {
      console.log(error);
      res.status(501).json({
        error: "Serverda xatolik yuz berdi...",
        message: error.message,
      });
    }
  },
};
