const { Router } = require('express')
const authMiddleware = require('../../middleware/auth.middleware')
const router = Router()


router.post('/approve', authMiddleware, (req, res) => {
    require('./labaratory').approve(req, res)
})

router.post('/clients/get', authMiddleware, (req, res) => {
    require('./labaratory').getLabClients(req, res);
})
router.post('/clientsforapprove/get', authMiddleware, (req, res) => {
    require('./labaratory').getLabClientsForApprove(req, res);
})

router.post('/adopt', authMiddleware, (req, res) => {
    require('./labaratory').adoptLabClient(req, res)
})

router.post('/statsionar/adopt', authMiddleware, (req, res) => {
    require('./labaratory').adoptStatsionarClient(req, res)
})

router.post('/clients/result', (req, res) => {
    require('./labaratory').getClientsForResult(req, res);
})

router.post('/servicetype/get', (req, res) => {
    require('./labaratory').getServicesType(req, res);
})

router.post('/conclusion/save', (req, res) => {
    require('./labaratory').saveConclusion(req, res);
})

router.post('/client/history/get', (req, res) => {
    require('./labaratory').getClientHistory(req, res);
})

router.post('/client/message/send', (req, res) => {
    require('../message/message').sendLabMessage(req, res);
})

module.exports = router;