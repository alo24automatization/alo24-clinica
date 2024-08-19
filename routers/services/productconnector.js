const {
  ProductConnector,
  validateProductConnector,
} = require("../../models/Warehouse/ProductConnector");
const { Product } = require("../../models/Warehouse/Product");
const { Service } = require("../../models/Services/Service");
const { Clinica } = require("../../models/DirectorAndClinica/Clinica");

//ProductConnector register
module.exports.register = async (req, res) => {
  try {
    const { error } = validateProductConnector(req.body);
    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    const { pieces, product, service, clinica } = req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    const productConnector = await ProductConnector.findOne({
      clinica,
      product,
      service,
    });

    if (productConnector) {
      return res.status(400).json({
        message: `Diqqat! Ushbu bog'lanish avval yaratilgan.`,
      });
    }

    const newProductConnector = new ProductConnector({
      pieces,
      product,
      service,
      clinica,
    });

    await newProductConnector.save();

    const produc = await Product.findByIdAndUpdate(product, {
      $push: {
        productconnectors: newProductConnector._id,
      },
    });

    const servic = await Service.findByIdAndUpdate(service, {
      $push: {
        productconnectors: newProductConnector._id,
      },
    });

    res.send(newProductConnector);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//ProductConnector getall
module.exports.getAll = async (req, res) => {
  try {
    const { clinica } = req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    const productConnectors = await ProductConnector.find({
      clinica,
    })
      .populate("product", "name")
      .populate("service", "name");

    res.send(productConnectors);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//ProductConnector update
module.exports.update = async (req, res) => {
  try {
    const { _id, pieces, product, service, clinica } = req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    const productConnector = await ProductConnector.findById(_id);

    if (!productConnector) {
      return res.status(400).json({
        message: `Diqqat! Bog'lanish yaratilmagan.`,
      });
    }
    productConnector.pieces = pieces;
    productConnector.product = product;
    productConnector.service = service;
    await productConnector.save();

    res.send(productConnector);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//ProductConnector delete
module.exports.delete = async (req, res) => {
  try {
    const { _id, clinica } = req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    const productConnector = await ProductConnector.findByIdAndDelete(_id);

    if (!productConnector) {
      return res.status(400).json({
        message: `Diqqat! Bog'lanish yaratilmagan.`,
      });
    }

    res.send(productConnector);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//ProductConnector deletealldepartment
module.exports.deleteAll = async (req, res) => {
  try {
    const { clinica } = req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    const productConnectors = await ProductConnector.find({
      clinica,
    });

    let all = [];
    for (const productConnector of productConnectors) {
      const del = await ProductConnector.findByIdAndDelete(
        productConnector._id
      );
      all.push(del);
    }

    res.send(all);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};
