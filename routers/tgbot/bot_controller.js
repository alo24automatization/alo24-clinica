const { Clinica } = require("../../models/DirectorAndClinica/Clinica");
const { Product } = require("../../models/Warehouse/Product");
const bot = require("./bot");

const sendDataTg = (telegramId, product) => {
    try {
        bot.sendMessage(telegramId, 
        `Omborda maxsulot kam qoldi
        ${product.name}: ${product.total}`);

    } catch (error) {
        console.log(error)
    }
}

module.exports.checkMinimum = async (productId, clinicaId) => {
    try {
        const clinica = await Clinica.findById(clinicaId)
        .select("-__v -updatedAt -isArchive")
        .lean()

        if (clinica.telegramId) {
            const product = await Product.findById(productId)
            if (product.minimum && product.total <= product.minimum) {
                sendDataTg(clinica.telegramId, product)
            }
        }

    } catch (error) {
        console.log(error)
    }
}