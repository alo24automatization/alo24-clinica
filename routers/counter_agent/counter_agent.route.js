const { Router } = require('express')
const router = Router()
const auth = require('../../middleware/auth.middleware');

router.post('/counter_agent/doctor/create', auth, (req, res) => {
    require('./counter_agent').create(req, res);
})

router.post('/counter_agent/doctors_services/get', auth, (req, res) => {
    require('./counter_agent').get(req, res);
})

router.post('/counter_agent/statsionar/get', auth, (req, res) => {
    require('./counter_agent').getStatsionarProfit(req, res);
})

router.post('/counter_agent/counterdoctorall/get', auth, (req, res) => {
    require('./counter_agent').getDcotors(req, res);
})
router.post('/counter_agent/counterdoctor_clients/:id', auth, (req, res) => {
    require('./counter_agent').getDoctorClients(req, res);
})

router.post('/counter_agent/get', auth, (req, res) => {
    require('./counter_agent').getCounterAgents(req, res);
})

router.post('/counter_agent/visit/create', auth, (req, res) => {
    require('./agent_visit').create(req, res);
})

router.post('/counter_agent/visit/get', auth, (req, res) => {
    require('./agent_visit').get(req, res);
})

router.post('/counter_agent/visit/edit', auth, (req, res) => {
    require('./agent_visit').edit(req, res);
})

module.exports = router;