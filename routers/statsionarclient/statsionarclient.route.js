const { Router } = require('express')
const router = Router()
const auth = require('../../middleware/auth.middleware')

router.post('/client/register', auth, (req, res) => {
    require('./clients.route').register(req, res)
})

router.post('/client/add', auth, (req, res) => {
    require('./clients.route').add(req, res)
})

router.post('/client/getall', auth, (req, res) => {
    require('./clients.route').getAll(req, res)
})

router.post('/client/getallreseption', auth, (req, res) => {
    require('./clients.route').getAllReseption(req, res)
})

router.put('/client/update', auth, (req, res) => {
    require('./clients.route').update(req, res)
})


router.post('/nurse_procient/get', auth, (req, res) => {
    require('./clients.route').getNurseProcient(req, res);
})

module.exports = router
