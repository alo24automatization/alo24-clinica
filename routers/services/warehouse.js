const {
  Warehouse,
  validateWarehouse,
} = require("../../models/Warehouse/Warehouse");
const { Clinica } = require("../../models/DirectorAndClinica/Clinica");
const { Product } = require("../../models/Warehouse/Product");

//Warehouse registerall
module.exports.registerAll = async (req, res) => {
  try {
    const warehouses = req.body;

    let all = [];
    for (const w of warehouses) {
      const { total, price, clinica, product, dateofreciept } = w;

      const clinic = await Clinica.findOne({ name: clinica });

      if (!clinic) {
        return res.status(400).json({
          message: "Diqqat! Klinika ma'lumotlari topilmadi.",
        });
      }

      const produc = await Product.findOne({
        clinica: clinic._id,
        name: product,
      });

      if (!produc) {
        return res.status(400).json({
          message: `Diqqat! Mahsulot avval yaratilmagan.`,
        });
      }

      let d = dateofreciept.split(".");

      const newWarehouse = new Warehouse({
        total,
        price,
        clinica: clinic._id,
        product: produc._id,
        dateofreciept: {
          year: parseInt(d[2]),
          month: parseInt(d[1] - 1),
          day: parseInt(d[0]),
        },
      });

      produc.total = parseInt (produc.total) + parseInt(total);
      await produc.save();
      await newWarehouse.save();
    }
    res.send(all);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Warehouse register
module.exports.register = async (req, res) => {
  try {
    const { error } = validateWarehouse(req.body);
    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    const { total, price, clinica, product, dateofreciept } = req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    const produc = await Product.findById(product);

    if (!produc) {
      return res.status(400).json({
        message: `Diqqat! Mahsulot avval yaratilmagan.`,
      });
    }

    const newWarehouse = new Warehouse({
      total,
      price,
      clinica,
      product,
      dateofreciept,
    });

    produc.total = parseInt(produc.total) + parseInt(total);
    await produc.save();
    await newWarehouse.save();

    res.send(newWarehouse);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Warehouse getall
module.exports.getAll = async (req, res) => {
  try {
    const { clinica } = req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    const warehouses = await Warehouse.find({
      clinica,
    }).populate("product", "name");

    res.send(warehouses);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Warehouse getallproduct
module.exports.getAllProduct = async (req, res) => {
  try {
    const { clinica, product } = req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    const produc = await Product.findById(product);

    if (!produc) {
      return res.status(400).json({
        message: `Diqqat! Mahsulot avval yaratilmagan.`,
      });
    }

    const warehouses = await Warehouse.find({
      clinica,
      product,
    });

    res.send(warehouses);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Warehouse update
module.exports.update = async (req, res) => {
  try {
    const { _id, total, price, clinica, product } = req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    const produc = await Product.findById(product);

    if (!produc) {
      return res.status(400).json({
        message: `Diqqat! Mahsulot avval yaratilmagan.`,
      });
    }

    const warehouse = await Warehouse.findById(_id);

    if (!warehouse) {
      return res.status(400).json({
        message: `Diqqat! Ushbu ${name} mahsuloti avval yaratilmagan.`,
      });
    }
    produc.total = produc.total - (warehouse.total - total);

    warehouse.total = total;
    warehouse.price = price;

    await produc.save();
    await warehouse.save();

    res.send(warehouse);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Warehouse delete
module.exports.delete = async (req, res) => {
  try {
    const { _id, product, clinica } = req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    const produc = await Product.findById(product);

    if (!produc) {
      return res.status(400).json({
        message: `Diqqat! Mahsulot avval yaratilmagan.`,
      });
    }

    const warehouse = await Warehouse.findByIdAndDelete(_id).populate(
      "product",
      "name"
    );

    produc.total = produc.total - warehouse.total;
    await produc.save();

    if (!warehouse) {
      return res.status(400).json({
        message: `Diqqat! Mahsulot avval qabul qilinmagan.`,
      });
    }

    res.send(warehouse);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Warehouse deleteall
module.exports.deleteAll = async (req, res) => {
  try {
    const { clinica } = req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    const warehouses = await Warehouse.find({
      clinica,
    });

    let all = [];
    for (const warehouse of warehouses) {
      const del = await Warehouse.findByIdAndDelete(warehouse._id);

      const produc = await Product.findById(warehouse.product);
      produc.total = produc.total - warehouse.total;
      await produc.save();
      all.push(del);
    }

    res.send(all);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Warehouse deleteallproduct
module.exports.deleteAllProduct = async (req, res) => {
  try {
    const { clinica, product } = req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    const produc = await Product.findById(product);

    if (!produc) {
      return res.status(400).json({
        message: `Diqqat! Mahsulot avval yaratilmagan.`,
      });
    }

    const warehouses = await Warehouse.find({
      clinica,
      product,
    });

    let all = [];
    for (const warehouse of warehouses) {
      const del = await Warehouse.findByIdAndDelete(warehouse._id);
      all.push(del);
    }

    res.send(all);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};
