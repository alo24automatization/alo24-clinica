const { Router } = require("express");
const router = Router();
const auth = require("../../middleware/auth.middleware");

router.post("/client/register", auth, (req, res) => {
  require("./clients.route").register(req, res);
});

router.post("/client/add", auth, (req, res) => {
  require("./clients.route").add(req, res);
});

router.post("/client/connector/add", auth, (req, res) => {
  require("./clients.route").addConnector(req, res);
});

router.post("/client/getall", auth, (req, res) => {
  require("./clients.route").getAll(req, res);
});
router.patch("/client/changeLastCardNumber/:clinica", auth, (req, res) => {
  require("./clients.route").addCardNumberToLastClient(req, res);
});
router.get("/client/lastCardNumber/:clinica", auth, (req, res) => {
  require("./clients.route").getLastCardNumber(req, res);
});
router.post("/client/getallreseption", auth, (req, res) => {
  require("./clients.route").getAllReseption(req, res);
});

router.put("/client/update", auth, (req, res) => {
  require("./clients.route").update(req, res);
});

router.put("/client/end", auth, (req, res) => {
  require("./clients.route").end(req, res);
});

router.post("/client/counter_doctors/get", auth, (req, res) => {
  require("./clients.route").getCounterDoctors(req, res);
});

router.post("/client/turns/get", auth, (req, res) => {
  require("./clients.route").getTurns(req, res);
});

router.post("/client/registeronline", auth, (req, res) => {
  require("./clients.route").registerOnline(req, res);
});

module.exports = router;
