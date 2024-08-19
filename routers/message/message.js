const axios = require('axios');
const config = require("config")
const { Product } = require('../../models/Warehouse/Product')
const { Clinica } = require('../../models/DirectorAndClinica/Clinica')
require('../../models/Services/Department')
const { OnlineClient } = require('../../models/OnlineClient/OnlineClient')
const { OfflineConnector } = require('../../models/OfflineClient/OfflineConnector')
const { StatsionarClient } = require('../../models/StatsionarClient/StatsionarClient')
require('../../models/OfflineClient/OfflineClient')
require('../../models/StatsionarClient/StatsionarClient')


const handleSend = async (smsKey, number, message) => {
    axios.get(`https://smsapp.uz/new/services/send.php?key=${smsKey}&number=${number}&message=${message}`)
        .then(res => {
            console.log('ok');
        })
        .catch(err => {
            console.log('Error: ', err.message);
        });
}


module.exports.sendLabMessage = async (req, res) => {
    try {

        const { connectorId, clientId } = req.body;

        let connector = {}

        if (String(clientId).toLocaleLowerCase().includes('s')) {
            connector = await StatsionarClient.findById(connectorId)
                .select("-__v -isArchive -updatedAt")
                .populate('client')
                .populate('clinica')

            // connector.isSended = true;
            // await connector.save()
        } else {
            connector = await OfflineConnector.findById(connectorId)
                .select("-__v -isArchive -updatedAt")
                .populate('client')
                .populate('clinica')
            // connector.isSended = true;
            // await connector.save()
        }



        if (connector.clinica.smsKey) {
            handleSend(connector.clinica.smsKey, `998${connector.client.phone}`, `Hurmatli ${connector.client.firstname} ${connector.client.lastname} sizning ${connector.clinica.name} ga topshirgan tahlil natijalaringiz tayyor! Yuklab olish: ${config.get('baseUrl')}/clienthistory/laboratory/${connector._id}`).then(async (data) => {
                connector.isSended = true;
                await connector.save()

            })
        }
        res.status(200).json({ message: 'Xabar yetkazildi!' })
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
}


module.exports.sendMessage = async () => {
    const onlineclients = await OnlineClient.find({
        brondate: {
            $gte: new Date()
        }
    })
        .select("-__v -isArchive -updatedAt")
        .populate('clinica')
        .populate('department', "name")
        .lean()


    for (const client of onlineclients) {
        const { phone, firstname, lastname, department, clinica, brondate } = client;
        const { name: deparmtent_name } = department;
        const { name: clinica_name } = clinica

        handleSend(client.clinica.smsKey, `998${phone}`, `Huramtli ${firstname} ${lastname}! Eslatib o'tamiz, siz ${new Date(brondate).toLocaleDateString('ru-RU')} kuni, soat ${new Date(brondate).getHours()}:${new Date(brondate).getMinutes() < 10 ? '0' + new Date(brondate).getMinutes() : new Date(brondate).getMinutes()} da ${clinica_name} ning ${deparmtent_name} bo'limiga qabulga yozilgansiz! Iltimos kech qolmang! Ma'lumot uchun: +998992234244`)
    }
}
