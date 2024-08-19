const { User, validateUserLogin } = require("../../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

module.exports.register = async (req, res) => {
    try {
        const { firstname, lastname, phone, password } = req.body;

        const isExist = await User.findOne({
            firstname,
            lastname,
            phone
        })

        if (isExist) {
            return res.status(400).json({
                message: "Diqqat! Ushbu foydalanuvchi avval ro'yxatdan o'tkazilgan.",
            });
        }

        const users = await User.find({
            type: 'Admin'
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

        const admin = new User({
            firstname,
            lastname,
            phone,
            password: hash,
            type: 'Admin'
        })
        await admin.save();

        res
            .status(201)
            .send({ message: "Foydalanuvchi muvaffaqqiyatli yaratildi!" });

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
}

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
        }).populate("clinica");
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

        res.send({
            token,
            userId: user._id,
            user: user,
        });

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
}