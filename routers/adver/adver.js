const { Adver, validateAdver } = require('../../models/Adver/Adver')
const { Clinica } = require('../../models/DirectorAndClinica/Clinica')

//Adver register
module.exports.registerAll = async (req, res) => {
  try {
    const advers = req.body
    const all = []
    for (const d of advers) {
      const { error } = validateAdver(d)
      if (error) {
        return res.status(400).json({
          error: error.message,
        })
      }

      const { name, clinica } = d

      const clinic = await Clinica.findOne({ name: clinica })

      if (!clinic) {
        return res.status(400).json({
          message: "Diqqat! Klinika ma'lumotlari topilmadi.",
        })
      }

      const adver = await Adver.findOne({
        clinica: clinic._id,
        name,
      })

      if (adver) {
        return res.status(400).json({
          message: `Diqqat! ${name} reklamasi avval yaratilgan.`,
        })
      }

      const newAdver = new Adver({
        name,
        clinica: clinic._id,
      })
      await newAdver.save()
      all.push(newAdver)
    }

    res.send(all)
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}

//Adver register
module.exports.register = async (req, res) => {
  try {
    const { error } = validateAdver(req.body)
    if (error) {
      return res.status(400).json({
        error: error.message,
      })
    }

    const { name, clinica } = req.body

    const adver = await Adver.findOne({
      clinica,
      name,
    })

    if (adver) {
      return res.status(400).json({
        message: 'Diqqat! Ushbu reklama avval yaratilgan.',
      })
    }

    const clinic = await Clinica.findById(clinica)

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      })
    }

    const newAdver = new Adver({
      name,
      clinica,
    })
    await newAdver.save()

    res.send(newAdver)
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}

//Adver update
module.exports.update = async (req, res) => {
  try {
    const { name, clinica } = req.body

    const adver = await Adver.findById(req.body._id)

    if (!adver) {
      return res.status(400).json({
        message: 'Diqqat! Ushbu reklama topilmadi.',
      })
    }

    const clinic = await Clinica.findById(clinica)

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      })
    }

    adver.name = name
    await adver.save()

    res.send(adver)
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}

//Adver getall
module.exports.getAll = async (req, res) => {
  try {
    const { clinica } = req.body
    const clinic = await Clinica.findById(clinica)

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      })
    }

    const advers = await Adver.find({
      clinica,
    })

    res.send(advers)
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}

//Adver get
module.exports.get = async (req, res) => {
  try {
    const { clinica, _id } = req.body

    const clinic = await Clinica.findById(clinica)

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      })
    }

    const adver = await Adver.findById(_id)

    if (!adver) {
      return res.status(400).json({
        message: "Diqqat! Bo'lim topilmadi.",
      })
    }

    res.send(adver)
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}

//Adver delete
module.exports.delete = async (req, res) => {
  try {
    const { _id, clinica } = req.body

    const clinic = await Clinica.findById(clinica)

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      })
    }

    const adver = await Adver.findByIdAndDelete(_id)

    res.send(adver)
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}

//Adver deleteall
module.exports.deleteAll = async (req, res) => {
  try {
    const { clinica } = req.body

    const clinic = await Clinica.findById(clinica)

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      })
    }

    const advers = await Adver.find({
      clinica,
    })
    // .select("_id");
    for (const adver of advers) {
      const del = await Adver.findByIdAndDelete(adver)
    }

    res.send(advers)
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}
