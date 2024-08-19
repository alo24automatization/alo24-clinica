const {Product, validateProduct} = require("../../models/Warehouse/Product");
const {Warehouse,} = require("../../models/Warehouse/Warehouse");
const {OfflineProduct} = require("../../models/OfflineClient/OfflineProduct");
require("../../models/OfflineClient/OfflineClient");
require("../../models/OfflineClient/OfflineConnector");
require("../../models/OfflineClient/OfflineService");
require("../../models/Users");
const {Clinica} = require("../../models/DirectorAndClinica/Clinica");
const {ProductConnector} = require("../../models/Warehouse/ProductConnector");

//Product registerall
module.exports.registerAll = async (req, res) => {
    try {
        const products = req.body;
        const all = [];
        for (const s of products) {
            const {error} = validateProduct(s);
            if (error) {
                return res.status(400).json({
                    error: error.message,
                });
            }

            const {name, unit, price, total, clinica} = s;

            const clinic = await Clinica.findOne({name: clinica});

            if (!clinic) {
                return res.status(400).json({
                    message: "Diqqat! Klinika ma'lumotlari topilmadi.",
                });
            }

            const product = await Product.findOne({
                clinica: clinic._id,
                name,
            });

            if (product) {
                return res.status(400).json({
                    message: `Diqqat! Ushbu ${name} mahsuloti avval yaratilgan.`,
                });
            }

            const newProduct = new Product({
                name,
                unit,
                price,
                total,
                clinica: clinic._id,
            });
            await newProduct.save();
            all.push(newProduct);
        }

        res.send(all);
    } catch (error) {
        res.status(501).json({error: "Serverda xatolik yuz berdi..."});
    }
};

//Product register
module.exports.register = async (req, res) => {
    try {
        const {error} = validateProduct(req.body);
        if (error) {
            return res.status(400).json({
                error: error.message,
            });
        }

        const {name, unit, price, total, clinica, minimum} = req.body;

        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        const product = await Product.findOne({
            clinica,
            name,
        });

        if (product) {
            return res.status(400).json({
                message: `Diqqat! Ushbu ${name} mahsuloti avval yaratilgan.`,
            });
        }

        const newProduct = new Product({
            name,
            unit,
            price,
            total,
            clinica,
            minimum
        });
        await newProduct.save();

        res.send(newProduct);
    } catch (error) {
        res.status(501).json({error: "Serverda xatolik yuz berdi..."});
    }
};

//Product getall
module.exports.getAll = async (req, res) => {
    try {
        const {clinica} = req.body;

        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        const products = await Product.find({
            clinica,
        });

        res.send(products);
    } catch (error) {
        res.status(501).json({error: "Serverda xatolik yuz berdi..."});
    }
};

//Product getall
module.exports.getAllReseption = async (req, res) => {
    try {
        const {clinica} = req.body;

        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        const products = await Product.find({
            clinica,
        })
            .select('name price')

        res.send(products);
    } catch (error) {
        res.status(501).json({error: "Serverda xatolik yuz berdi..."});
    }
};

//Product update
module.exports.update = async (req, res) => {
    try {
        const {_id, name, unit, price, clinica, total, minimum} = req.body;

        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        const product = await Product.findById(_id);

        if (!product) {
            return res.status(400).json({
                message: `Diqqat! Ushbu ${name} mahsuloti avval yaratilmagan.`,
            });
        }
        product.name = name;
        product.unit = unit;
        product.price = price;
        product.minimum = minimum;
        product.total = total;
        await product.save();

        res.send(product);
    } catch (error) {
        res.status(501).json({error: "Serverda xatolik yuz berdi..."});
    }
};

//Product delete
module.exports.delete = async (req, res) => {
    try {
        const {_id, name, clinica} = req.body;

        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        const product = await Product.findByIdAndDelete(_id);

        if (!product) {
            return res.status(400).json({
                message: `Diqqat! ${name} mahsuloti avval yaratilmagan.`,
            });
        }

        const warehouses = await Warehouse.find({
            product: product._id,
            clinica: product.clinica
        })

        for (const warehouse of warehouses) {
            const del = await Warehouse.findByIdAndDelete(warehouse._id)
        }

        const productconnectors = await ProductConnector.find({
            product: product._id,
            clinica: product.clinica,
        });

        for (const productconnector of productconnectors) {
            const del = await ProductConnector.findByIdAndDelete(
                productconnector._id
            );
        }

        res.send(product);
    } catch (error) {
        res.status(501).json({error: "Serverda xatolik yuz berdi..."});
    }
};

//Product deletealldepartment
module.exports.deleteAll = async (req, res) => {
    try {
        const {clinica} = req.body;

        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        const products = await Product.find({
            clinica,
        });

        let all = [];
        for (const product of products) {
            const del = await Product.findByIdAndDelete(product._id);

            const warehouses = await Warehouse.find({
                product: product._id,
                clinica: product.clinica,
            });

            for (const warehouse of warehouses) {
                const del = await Warehouse.findByIdAndDelete(warehouse._id);
            }

            const productconnectors = await ProductConnector.find({
                product: product._id,
                clinica: product.clinica,
            });

            for (const productconnector of productconnectors) {
                const del = await ProductConnector.findByIdAndDelete(
                    productconnector._id
                );
            }
            all.push(del);
        }

        res.send(all);
    } catch (error) {
        res.status(501).json({error: "Serverda xatolik yuz berdi..."});
    }
};


module.exports.getProducts = async (req, res) => {
    try {
        const {clinica, beginDay, endDay} = req.body;

        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        const products = await OfflineProduct.find({
            clinica,
            refuse: false,
            payment: true,
            createdAt: {
                $gte: beginDay,
                $lte: endDay 
            }
        })
        .select("-__v -updatedAt -isArchive")
        .populate('client')
        .populate('connector')
        .populate('productid')
        .populate('reseption') 
        .populate('service')
        .lean()

        // let connectors = 

        res.status(200).json(products)
    } catch (error) {
        console.log(error);
        res.status(501).json({error: "Serverda xatolik yuz berdi..."});
    }
}

