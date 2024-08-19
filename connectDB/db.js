const mongoose = require("mongoose")
const config = require("config")

const PORT = config.get("PORT") || 9900

module.exports.start = async (app) => {
    try {
        await mongoose.connect(config.get("mongoUri"), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
            .then(() => { console.log('Connect to MongoDB') })
            .catch(() => { console.log('Connecting error to MongoDB') })
        // app.listen(PORT, () => console.log(`App has been started on port ${PORT}`))
    } catch (error) {
        console.log('Serverda xatolik yuz berdi', error.message)
        process.exit(1)
    }
}