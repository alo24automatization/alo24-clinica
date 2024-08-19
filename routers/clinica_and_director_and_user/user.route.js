const { User, validateUser, validateUserLogin } = require("../../models/Users");
const bcrypt = require("bcryptjs");
const { Clinica } = require("../../models/DirectorAndClinica/Clinica");
const { Department } = require("../../models/Services/Department");
const config = require("config");
const jwt = require("jsonwebtoken");
const { Director } = require("../../models/DirectorAndClinica/Director");
const ObjectId = require("mongodb").ObjectId;

module.exports.register = async (req, res) => {
  try {
    const {
      _id,
      firstname,
      lastname,
      fathername,
      image,
      phone,
      password,
      clinica,
      specialty,
      blanka,
      type,
      user,
      signature,
      statsionar_profit,
    } = req.body;

    if (type === "Director" && _id) {
      const hash = await bcrypt.hash(password, 8);
      const director = await Director.findByIdAndUpdate(_id, {
        ...req.body,
        clinica: clinica._id,
        password: hash,
      }).select("-password");

      return res.status(200).json({ message: "Director o'zgarildi!" });
    }

    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    if (_id) {
      if (password) {
        const hash = await bcrypt.hash(password, 8);
        req.body.password = hash;
      }
      const update = await User.findByIdAndUpdate(_id, {
        ...req.body,
        statsionar_profit: Number(statsionar_profit) || 0,
      });

      if (type === "Doctor" || type === "Laborotory") {
        const department = await Department.findById(specialty);
        department.doctor = _id;
        await department.save();
      }

      return res.status(201).send({
        message: "Foydalanuvchi ma'lumotlari muvaffaqqiyatli o'zgartirildi!",
      });
    }

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message:
          "Diqqat! Foydalanuvchi ro'yxatga olinayotgan klinika dasturda ro'yxatga olinmagan.",
      });
    }

    const olduser = await User.find({
      clinica,
      type,
      firstname,
      lastname,
      specialty,
      isArchive: false,
    });

    if (olduser.length > 0) {
      return res.status(400).json({
        message: "Diqqat! Ushbu foydalanuvchi avval ro'yxatdan o'tkazilgan.",
      });
    }

    const users = await User.find({
      type,
      isArchive: false,
    });

    for (const d of users) {
      const isMatch = await bcrypt.compare(password, d.password);
      if (isMatch) {
        return res.status(400).json({
          message:
            "Diqqat! Parol tizimda xavfsiz bo'lmagan deb topildi. Iltimos boshqa parol yarating.",
        });
      }
    }

    const hash = await bcrypt.hash(password, 8);
    const newUser = new User({
      firstname,
      lastname,
      fathername,
      image,
      blanka,
      phone,
      password: hash,
      clinica,
      type,
      specialty,
      user,
      signature,
      statsionar_profit: Number(statsionar_profit) || 0,
    });
    await newUser.save();

    if (type === "Doctor" || type === "Laborotory") {
      const department = await Department.findById(specialty);
      department.doctor = newUser._id;
      await department.save();

      newUser.statsionar_profit = statsionar_profit || 0;
      await newUser.save();
    }

    if (user) {
      const counteragent = await User.findByIdAndUpdate(user, {
        $push: {
          users: new ObjectId(newUser._id),
        },
      });
    }

    res
      .status(201)
      .send({ message: "Foydalanuvchi muvaffaqqiyatli yaratildi!" });
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

// User LOGIN
module.exports.login = async (req, res) => {
  try {
    const { error } = validateUserLogin(req.body);
    if (error) {
      return res.status(400).json({
        error: "Ma'lumot kiritishda xatolikka yo'l qo'yilgan",
        message: error.message,
      });
    }
    const { type, password } = req.body;

    const users = await User.find({
      type,
      isArchive: false,
    })
      .populate({
        path: "clinica",
        select: "-__v -isArchive -updatedAt -requiredFields",
        populate: {
          path: "filials",
          select: "name phone1 image",
        },
      })
      .populate("specialty");

    let user = null;

    for (const d of users) {
      const isMatch = await bcrypt.compare(password, d.password);

      if (isMatch) {
        user = d;
      }
    }

    if (!user) {
      return res.status(400).json({ message: `Parol noto'g'ri kiritilgan` });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      config.get("jwtSecret"),
      { expiresIn: "12h" }
    );

    if (
      new Date().getFullYear() ===
      new Date(user?.clinica?.close_date).getFullYear() &&
      new Date().getMonth() ===
      new Date(user?.clinica?.close_date).getMonth() &&
      new Date().getDate() === new Date(user?.clinica?.close_date).getDate()
    ) {
      user.clinica.isClose = true;
      const clinica = await Clinica.findById(user.clinica._id);
      clinica.isClose = true;
      await clinica.save();
    }

    res.send({
      token,
      userId: user._id,
      user: user,
      clinica: user.clinica,
    });
  } catch (e) {
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "Diqqat! Foydalanuvchi ID si ko'rsatilmagan",
      });
    }

    const user = await User.findById(userId).populate("clinica");

    if (!user) {
      return res.status(400).json({
        error:
          "Diqqat! Ushbu foydalanuvchi ma'lumotlari ro'yxatdan o'tkazilmagan.",
      });
    }

    res.status(201).send(user);
  } catch (error) {
    res.status(501).json({ error: error });
  }
};

module.exports.getUserType = async (req, res) => {
  try {
    const { clinica, type } = req.body;

    if (!clinica) {
      return res.status(400).json({
        error: "Diqqat! Clinica ma'lumotlari topilmadi.",
      });
    }

    const users = await User.find({
      clinica,
      type,
    });

    res.status(201).send(users);
  } catch (error) {
    res.status(501).json({ error: error });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const { user_id } = req.params;
    const findedUser = await User.findById(user_id).select("accessCreateClient")
    if (!findedUser) {
      res.status(400).json({ message: "Shifokor topilmadi!" })
    }
    res.status(200).send(findedUser);
  } catch (error) {
    res.status(501).json({ error: error });
  }
}

module.exports.getUsers = async (req, res) => {
  try {
    const { clinica } = req.body;

    const users = await User.find({
      clinica,
      isArchive: false,
    })
      .populate("specialty", "name")
      .select("-password -isArchive -createdAt -updatedAt -__v ")
      .sort({ _id: -1 });

    res.status(201).send(users);
  } catch (error) {
    res.status(501).json({ error: error });
  }
};
module.exports.addAccess = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { accessCreateClient } = req.body
    const findedUser = await User.findById(user_id)
    if (!findedUser) {
      res.status(400).json({ message: "Shifokor topilmadi!" })
    }
    findedUser.accessCreateClient = accessCreateClient;
    await findedUser.save()
    res.status(200).send({ message: "Shifokor ma'lumotlari yangilandi." });
  } catch (error) {
    res.status(501).json({ error: error });
  }
};

module.exports.removeUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "Diqqat! Foydalanuvchi ID si ko'rsatilmagan",
      });
    }

    const user = await User.findById(userId).populate("clinica");

    if (!user) {
      return res.status(400).json({
        error:
          "Diqqat! Ushbu foydalanuvchi ma'lumotlari ro'yxatdan o'tkazilmagan.",
      });
    }

    const updateUser = await User.findByIdAndUpdate(userId, {
      isArchive: true,
    });

    res
      .status(201)
      .send({ message: "Foydalanuvchi muvaffaqqiyatli o'chirildi" });
  } catch (error) {
    res.status(501).json({ error: error });
  }
};
