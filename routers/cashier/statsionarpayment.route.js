const { validatePayment, StatsionarPayment } = require("../../models/Cashier/StatsionarPayment");
const { StatsionarService } = require("../../models/StatsionarClient/StatsionarService");
const { StatsionarClient } = require("../../models/StatsionarClient/StatsionarClient");
const { StatsionarProduct } = require("../../models/StatsionarClient/StatsionarProduct");
const { ProductConnector } = require("../../models/Warehouse/ProductConnector");
const { Product } = require("../../models/Warehouse/Product");
const { StatsionarConnector } = require("../../models/StatsionarClient/StatsionarConnector");
const { StatsionarDiscount, validateDiscount } = require("../../models/Cashier/StatsionarDiscount");
const { StatsionarRoom } = require("../../models/StatsionarClient/StatsionarRoom");
const { Clinica } = require("../../models/DirectorAndClinica/Clinica");
const { OfflinePayment } = require("../../models/Cashier/OfflinePayment");
//Payment
module.exports.payment = async (req, res) => {
    try {
        const { payment, discount, services, products } = req.body

        // CheckPayment
        const checkPayment = validatePayment(payment).error
        if (checkPayment) {
            return res.status(400).json({
                error: error.message,
            })
        }

        delete discount._id
        delete discount.isArchive
        delete discount.__v
        delete discount.createdAt
        delete discount.updatedAt

        // CheckDiscount
        const checkDiscount = validateDiscount(discount).error
        if (checkDiscount) {
            return res.status(400).json({
                error: error.message,
            })
        }

        //Update Services and Products
        services && services.map(async (service) => {
            const update = await StatsionarService.findByIdAndUpdate(service._id, service)

            //=========================================================
            // Product decrement
            const productconnectors = await ProductConnector.find({
                clinica: service.clinica,
                service: service.serviceid,
            })

            if (service.refuse) {
                for (const productconnector of productconnectors) {
                    const product = await Product.findById(productconnector.product)
                    product.total = product.total + productconnector.pieces * service.pieces
                    await product.save()
                }
            }

        })

        products && products.map(async (product) => {
            const update = await StatsionarProduct.findByIdAndUpdate(product._id, product)

            //=========================================================
            // Product decrement
            if (product.refuse) {
                const produc = await Product.findById(product.productid)
                produc.total = produc.total + product.pieces
                await produc.save()
            }
        })

        // Delete Debets
        const debts = await StatsionarPayment.find({ connector: payment.connector })
        for (const debt of debts) {
            const update = await StatsionarPayment.findByIdAndUpdate(debt._id, {
                debt: 0
            })
        }

        // CreatePayment
        const newpayment = new StatsionarPayment({ ...payment })
        await newpayment.save()

        const updateConnector = await StatsionarConnector.findById(payment.connector)
        updateConnector.payments.push(newpayment._id)

        // CreateDiscount
        if (updateConnector.discount) {
            await StatsionarDiscount.findByIdAndUpdate(updateConnector.discount, discount)
        } else if (discount.discount && discount.comment.length > 2) {
            const newdiscount = new StatsionarDiscount({
                ...discount,
                payment: newpayment._id
            })
            await newdiscount.save()

            newpayment.discount = newdiscount._id
            await newpayment.save()

            updateConnector.discount = newdiscount._id
        }


        await updateConnector.save()

        res.status(201).send(newpayment)
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

// PrePayment
module.exports.prepayment = async (req, res) => {
    try {
        const { payment, services, products } = req.body

        // CheckPayment
        const checkPayment = validatePayment(payment).error
        if (checkPayment) {
            return res.status(400).json({
                error: error.message,
            })
        }

        //Update Services and Products
        services && services.map(async (service) => {
            const update = await StatsionarService.findByIdAndUpdate(service._id, service)

            //=========================================================
            // Product decrement
            const productconnectors = await ProductConnector.find({
                clinica: service.clinica,
                service: service.serviceid,
            })

            if (service.refuse) {
                for (const productconnector of productconnectors) {
                    const product = await Product.findById(productconnector.product)
                    product.total = product.total + productconnector.pieces * service.pieces
                    await product.save()
                }
            }

        })

        products && products.map(async (product) => {
            const update = await StatsionarProduct.findByIdAndUpdate(product._id, product)

            //=========================================================
            // Product decrement
            if (product.refuse) {
                const produc = await Product.findById(product.productid)
                produc.total = produc.total + product.pieces
                await produc.save()
            }
        })

        // CreatePayment
        const newpayment = new StatsionarPayment({ ...payment })
        await newpayment.save()

        const updateConnector = await StatsionarConnector.findById(payment.connector)
        updateConnector.payments.push(newpayment._id)

        await updateConnector.save()

        res.status(201).send(newpayment)
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}


//Clients getall
module.exports.getAll = async (req, res) => {
    try {
        const { clinica, beginDay, endDay, clientborn, type } = req.body
        const clinic = await Clinica.findById(clinica)

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            })
        }

        let connectors = []

        if (clientborn) {
            connectors = await StatsionarConnector.find({
                clinica
            })
                .populate('client', '-updatedAt -isArchive -__v')
                .populate('services')
                .populate('products')
                .populate('room')
                .populate({
                    path: "payments",
                    select: "-__v -isArchive -updatedAt",
                    populate: {
                        path: "discount",
                        select: "-__v -isArchive -updatedAt"
                    }
                })
                .populate('discount')
                .sort({ _id: -1 })
                .lean()
                .then(connectors => connectors.filter(connector =>
                    new Date(new Date(connector.client.born).setUTCHours(0, 0, 0, 0)).toISOString() === new Date(new Date(clientborn).setUTCHours(0, 0, 0, 0)).toISOString()
                ))
        } else if (type === 'done') {
            connectors = await StatsionarConnector.find({
                clinica
            })
                .populate('client', '-updatedAt -isArchive -__v')
                .populate('services')
                .populate('products')
                .populate('room')
                .populate({
                    path: "payments",
                    select: "-__v -isArchive -updatedAt",
                    populate: {
                        path: "discount",
                        select: "-__v -isArchive -updatedAt"
                    }
                })
                .populate('discount')
                .then(connectors => connectors.filter(connector => connector.room && connector.room.endday 
                    && (new Date(connector.room.endday) >= new Date(beginDay) && new Date(connector.room.endday) <= new Date(endDay))))
        } else if (type === 'continue') {
            connectors = await StatsionarConnector.find({
                clinica,
                createdAt: {
                    $gte: beginDay,
                    $lte: endDay,
                }
            })
                .populate('client', '-updatedAt -isArchive -__v')
                .populate('services')
                .populate('products')
                .populate('room')
                .populate({
                    path: "payments",
                    select: "-__v -isArchive -updatedAt",
                    populate: {
                        path: "discount",
                        select: "-__v -isArchive -updatedAt"
                    }
                })
                .populate('discount')
                .then(statsionars => statsionars.filter(s => s?.room?.endday === null))
        }
        else {
            connectors = await StatsionarConnector.find({
                clinica,
                createdAt: {
                    $gte: new Date().setHours(0, 0, 0, 0),
                    $lte: new Date().setHours(23, 59, 59, 59),
                },
            })
                .populate('client', '-updatedAt -isArchive -__v')
                .populate('services')
                .populate('products')
                .populate('room')
                .populate({
                    path: "payments",
                    select: "-__v -isArchive -updatedAt",
                    populate: {
                        path: "discount",
                        select: "-__v -isArchive -updatedAt"
                    }
                })
                .populate('discount')
                .sort({ createdAt: -1 })
        }

        res.status(200).send(connectors)
    } catch (error) {
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}



// PrePayment
module.exports.updateservices = async (req, res) => {
    try {
        const { services, products } = req.body

        //Update Services and Products
        services && services.map(async (service) => {
            const update = await StatsionarService.findByIdAndUpdate(service._id, service)

            //=========================================================
            // Product decrement
            const productconnectors = await ProductConnector.find({
                clinica: service.clinica,
                service: service.serviceid,
            })

            if (service.refuse) {
                for (const productconnector of productconnectors) {
                    const product = await Product.findById(productconnector.product)
                    product.total = product.total + productconnector.pieces * service.pieces
                    await product.save()
                }
            }

        })

        products && products.map(async (product) => {
            const update = await StatsionarProduct.findByIdAndUpdate(product._id, product)

            //=========================================================
            // Product decrement
            if (product.refuse) {
                const produc = await Product.findById(product.productid)
                produc.total = produc.total + product.pieces
                await produc.save()
            }
        })


        res.status(201).send({ message: "Xizmatlar muvaffqqiyatli yangilandi!" })
    } catch (error) {
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

