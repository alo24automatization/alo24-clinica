const { Router } = require("express");
const router = Router();
const sections = require("../../models/Sections.json");

router.get("/", async (req, res) => {
  try {
    if (sections) {
      return res.send(sections);
    }

    res.status(404).json({ error: "Bo'limlar tizimda ro'yxatga olinmagan" });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
});

module.exports = router;
