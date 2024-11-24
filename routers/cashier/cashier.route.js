const { Router } = require("express");
const router = Router();
const auth = require("../../middleware/auth.middleware");

router.post("/offline/payment", auth, (req, res) => {
  require("./offlinepayment.route").payment(req, res);
});

router.post("/offline/getall", auth, (req, res) => {
  require("./offlinepayment.route").getAll(req, res);
});

router.post("/offline/payments/getall", auth, (req, res) => {
  require("./offlinepayment.route").getPayments(req, res);
});

router.post("/offline/discounts", auth, (req, res) => {
  require("./discount.route").offline(req, res);
});

router.post("/offline/debts", auth, (req, res) => {
  require("./debts.route").offline(req, res);
});

router.post("/offline/debt/payment", auth, (req, res) => {
  require("./debts.route").payment(req, res);
});

router.post("/statsionar/debt/payment", auth, (req, res) => {
  require("./debts.route").paymentStatsionar(req, res);
});

router.post("/statsionar/getall", auth, (req, res) => {
  require("./statsionarpayment.route").getAll(req, res);
});

router.post("/statsionar/payment", auth, (req, res) => {
  require("./statsionarpayment.route").payment(req, res);
});

router.post("/statsionar/prepayment", auth, (req, res) => {
  require("./statsionarpayment.route").prepayment(req, res);
});

router.post("/statsionar/updateservices", auth, (req, res) => {
  require("./statsionarpayment.route").updateservices(req, res);
});

router.post("/statsionar/discounts", auth, (req, res) => {
  require("./discount.route").statsionar(req, res);
});

router.post("/statsionar/debts", auth, (req, res) => {
  require("./debts.route").statsionar(req, res);
});

//============================================================

router.post("/expense/create", auth, (req, res) => {
  require("./expense").create(req, res);
});

router.put("/expense/update", auth, (req, res) => {
  require("./expense").update(req, res);
});

router.post("/expense/get", auth, (req, res) => {
  require("./expense").get(req, res);
});

router.post("/expense/delete", auth, (req, res) => {
  require("./expense").delete(req, res);
});

router.post("/expense/total/get", auth, (req, res) => {
  require("./expense").getTotal(req, res);
});

//============================================================
// operation
router.post("/operation/findAll", auth, (req, res) => {
  require("./operation.route").findAll(req, res);
});
router.post("/operation/total/findAll", auth, (req, res) => {
  require("./operation.route").findAllAndTotalPrice(req, res);
});
router.post("/operation/create", auth, (req, res) => {
  require("./operation.route").create(req, res);
});
router.post("/operation/delete/:id", auth, (req, res) => {
  require("./operation.route").delete(req, res);
});
router.post("/operation/update/:id", auth, (req, res) => {
  require("./operation.route").update(req, res);
});

module.exports = router;
