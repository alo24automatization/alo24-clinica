const { Room, validateRoom } = require('../../models/Rooms/Room')
const { Clinica } = require('../../models/DirectorAndClinica/Clinica')
const { Department } = require('../../models/Services/Department')

//Room registerall
module.exports.registerAll = async (req, res) => {
  try {
    const rooms = req.body
    const all = []
    for (const s of rooms) {
      const { error } = validateRoom(s)
      if (error) {
        return res.status(400).json({
          error: error.message,
        })
      }
      const { type, number, price, position, clinica, place } = s

      const clinic = await Clinica.findOne({ name: clinica })

      if (!clinic) {
        return res.status(400).json({
          message: "Diqqat! Klinika ma'lumotlari topilmadi.",
        })
      }

      const room = await Room.findOne({
        clinica: clinic._id,
        number,
        place,
        type,
      })

      if (room) {
        return res.status(400).json({
          message: `Diqqat! Ushbu ${number} xona va ${place} o'rin avval yaratilgan.`,
        })
      }

      const newRoom = new Room({
        type,
        number,
        price,
        position,
        clinica: clinic._id,
        place,
      })
      await newRoom.save()
      all.push(newRoom)
    }

    res.send(all)
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}

//Room register
module.exports.register = async (req, res) => {
  try {
    const { error } = validateRoom(req.body)
    if (error) {
      return res.status(400).json({
        error: error.message,
      })
    }

    const { type, number, price, position, clinica, place, doctorProcient, nurseProcient } = req.body

    const clinic = await Clinica.findById(clinica)

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      })
    }

    const room = await Room.findOne({
      clinica,
      place,
      number,
      type,
    })

    if (room) {
      return res.status(400).json({
        message: `Diqqat! Ushbu ${type} xona va ${place} o'rin avval yaratilgan.`,
      })
    }

    const newRoom = new Room({
      type,
      number,
      price,
      position,
      clinica,
      place,
      doctorProcient,
      nurseProcient
    })
    await newRoom.save()

    res.send(newRoom)
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}

//Room getall
module.exports.getAll = async (req, res) => {
  try {
    const { clinica } = req.body

    const clinic = await Clinica.findById(clinica)

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      })
    }

    const rooms = await Room.find({
      clinica,
    })

    res.send(rooms)
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}

//Room getnotbusy
module.exports.getnotbusy = async (req, res) => {
  try {
    const { clinica } = req.body

    const clinic = await Clinica.findById(clinica)

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      })
    }

    const rooms = await Room.find({
      clinica,
      position: false,
    })

    res.send(rooms)
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}

//Room update
module.exports.update = async (req, res) => {
  try {
    const { _id, type, number, price, position, clinica, place, nurseProcient, doctorProcient } = req.body

    const clinic = await Clinica.findById(clinica)

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      })
    }

    const room = await Room.findById(_id)

    if (!room) {
      return res.status(400).json({
        message: `Diqqat! ${number} xona ${place}  o'rin avval yaratilmagan.`,
      })
    }
    room.type = type;
    room.price = price;
    room.number = number;
    room.position = position;
    room.place = place;
    room.nurseProcient = nurseProcient;
    room.doctorProcient = doctorProcient;
    await room.save()

    res.send(room)
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}

//Room delete
module.exports.delete = async (req, res) => {
  try {
    const { _id, clinica, number, place } = req.body

    const clinic = await Clinica.findById(clinica)

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      })
    }

    const room = await Room.findByIdAndDelete(_id)

    if (!room) {
      return res.status(400).json({
        message: `Diqqat! ${number} xona ${place}  o'rin avval yaratilmagan.`,
      })
    }

    res.send(room)
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}

//Room deletealldepartment
module.exports.deleteAll = async (req, res) => {
  try {
    const { clinica } = req.body

    const clinic = await Clinica.findById(clinica)

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      })
    }

    const rooms = await Room.find({
      clinica,
    })

    let all = []
    for (const room of rooms) {
      const del = await Room.findByIdAndDelete(room._id)
      all.push(del)
    }

    res.send(all)
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}
