const { Router } = require('express')
const router = Router()
const auth = require('../../middleware/auth.middleware')
//========================================================
// ADVER

router.post("/adver/registerall", auth, (req, res) => {
  require("./adver").registerAll(req, res);
});

router.post("/adver/register", auth, (req, res) => {
  require("./adver").register(req, res);
});

router.post("/adver/getall", auth, (req, res) => {
  require("./adver").getAll(req, res);
});

router.get("/adver", auth, (req, res) => {
  require("./adver").get(req, res);
});

router.put("/adver", auth, (req, res) => {
  require("./adver").update(req, res);
});

router.delete("/adver", auth, (req, res) => {
  require("./adver").delete(req, res);
});

router.delete("/adver/deleteall", auth, (req, res) => {
  require("./adver").deleteAll(req, res);
});


//=======================================================

router.post('/adver/clients_statistics/get', auth, (req, res) => {
  require('./statistics').getStatistics(req, res);
})

router.post('/adver/adver_statistics/get', auth, (req, res) => {
  require('./statistics').getAdverStatistics(req, res);
})

module.exports = router
