const {
  Director,
  validateDirector,
  validateDirectorLogin,
} = require("../../models/DirectorAndClinica/Director");
const bcrypt = require("bcryptjs");
const { Clinica } = require("../../models/DirectorAndClinica/Clinica");
const config = require("config");
const jwt = require("jsonwebtoken");

//Director register
module.exports.register = async (req, res) => {
  try {
    const { error } = validateDirector(req.body);
    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    const { firstname, lastname, fathername, image, phone, password, clinica } =
      req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Ushbu klinika mavjud emas.",
      });
    }

    const director = await Director.findOne({
      clinica,
    });

    if (director) {
      return res.status(400).json({
        message:
          "Diqqat! Ushbu klinika direktori allaqachon ro'yxatdan o'tgan.",
      });
    }

    const hash = await bcrypt.hash(password, 8);
    const newDirector = new Director({
      firstname,
      lastname,
      fathername,
      image,
      phone,
      password: hash,
      clinica,
      type: "Director"
    });
    await newDirector.save();

    const token = jwt.sign(
      {
        userId: newDirector._id,
      },
      config.get("jwtSecret"),
      { expiresIn: "12h" }
    );

    res.send({
      token,
      userId: newDirector._id,
      user: newDirector,
      clinica: clinic,
    });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

// Director LOGIN
module.exports.login = async (req, res) => {
  try {
    const { error } = validateDirectorLogin(req.body);
    if (error) {
      return res.status(400).json({
        error: "Ma'lumot kiritishda xatolikka yo'l qo'yilgan",
        message: error.message,
      });
    }
    const { type, password } = req.body;

    const directors = await Director.find({
      type,
    })
      .populate({
        path: 'clinica',
        select: "-__v -isArchive -updatedAt",
        populate: {
          path: "filials",
          select: 'name phone1'
        }
      })
      .lean()

    let director = null;

    for (const d of directors) {
      const isMatch = await bcrypt.compare(password, d.password);
      if (isMatch) {
        director = d;
      }
    }

    if (!director) {
      return res.status(400).json({ message: `Parol noto'g'ri kiritilgan` });
    }

    const token = jwt.sign(
      {
        userId: director._id,
      },
      config.get("jwtSecret"),
      { expiresIn: "12h" }
    );

    if (new Date().getFullYear() === new Date(director?.clinica?.close_date).getFullYear()
      && new Date().getMonth() === new Date(director?.clinica?.close_date).getMonth()
      && new Date().getDate() === new Date(director?.clinica?.close_date).getDate()
    ) {
      director.clinica.isClose = true;
      const clinica = await Clinica.findById(director.clinica._id)
      clinica.isClose = true;
      await clinica.save()
    }

    res.send({
      token,
      userId: director._id,
      user: director,
      clinica: director.clinica,
    });
  } catch (e) {
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};

// Director UPADATE
module.exports.update = async (req, res) => {
  try {
    const { type, clinica, password } = req.body;

    const found = await Director.find({
      clinica,
      type,
    }).select("-password");

    if (found.length === 0) {
      return res.status(400).json({
        message: "Diqqat! Foydalanuvchi tizimda ro'yxatga olinmagan.",
      });
    }
    const hash = await bcrypt.hash(password, 8);
    const director = await Director.findByIdAndUpdate(
      req.body._id,
      { ...req.body, password: hash }
    ).select("-password");

    res.send(director);
  } catch (e) {
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};

// Director UPADATEPASSWORD
module.exports.updatePassword = async (req, res) => {
  try {
    const { oldpassword, newpassword, directorId } = req.body;

    const director = await Director.findById(directorId);

    if (!director) {
      return res.status(400).json({
        message: "Diqqat! Foydalanuvchi tizimda ro'yxatga olinmagan.",
      });
    }

    const isMatch = await bcrypt.compare(oldpassword, director.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Joriy parol noto'g'ri kiritilgan" });
    }

    const hash = await bcrypt.hash(newpassword, 8);
    director.password = hash;
    await director.save();

    res.send(director);
  } catch (e) {
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};

module.exports.getDirector = async (req, res) => {
  try {
    const { directorId } = req.body;

    if (!directorId) {
      return res.status(400).json({
        error: "Diqqat! Direktor ID si ko'rsatilmagan",
      });
    }

    const director = await Director.findById(directorId)
      .populate("clinica")
      .select("-password");

    if (!director) {
      return res.status(400).json({
        error: "Diqqat! Ushbu direktor ma'lumotlari ro'yxatdan o'tkazilmagan.",
      });
    }

    res.status(201).send(director);
  } catch (error) {
    res.status(501).json({ error: error });
  }
};
