//Clients getall
const {validateTemplate, Template} = require("../../models/Templates/Template");

module.exports.createandupdate = async (req, res) => {
    try {
        const {template} = req.body
        if (template._id) {
            const update = await Template.findByIdAndUpdate(template._id, template)
            return res.status(200).send(update)
        } else {
            const {error} = validateTemplate(template)
            if (error) {
                return res.status(400).json({
                    error: error.message,
                })
            }

            const newTemplate = new Template({...template})
            await newTemplate.save()

            return res.status(200).send(newTemplate)
        }
    } catch (error) {
        res.status(501).json({error: 'Serverda xatolik yuz berdi...'})
    }
}

module.exports.createall = async (req, res) => {
    try {
        const {templates, clinica, doctor} = req.body
        let newTemplates = []
        for (const template of templates) {
            const {error} = validateTemplate({...template, clinica, doctor})
            if (error) {
                return res.status(400).json({
                    error: error.message,
                })
            }

            const newTemplate = new Template({...template, clinica, doctor})
            await newTemplate.save()
            newTemplates.push(newTemplate)
        }
        return res.status(200).send(newTemplates)

    } catch (error) {
        res.status(501).json({error: 'Serverda xatolik yuz berdi...'})
    }
}

module.exports.getAll = async (req, res) => {
    try {
        const {clinica, doctor} = req.body
        const templates = await Template.find({clinica, doctor})

        return res.status(200).send(templates)
    } catch (error) {
        res.status(501).json({error: 'Serverda xatolik yuz berdi...'})
    }
}

module.exports.delete = async (req, res) => {
    try {
        const {template} = req.body

        const del = await Template.findByIdAndDelete(template)

        return res.status(200).send(del)
    } catch (error) {
        res.status(501).json({error: 'Serverda xatolik yuz berdi...'})
    }
}
