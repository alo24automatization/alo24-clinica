const { Router } = require('express')
const router = Router()
const auth = require('../../middleware/auth.middleware')


// Templates
router.post('/template/create', auth, (req, res) => {
    require('./templates').createandupdate(req, res)
})

router.post('/template/getall', auth, (req, res) => {
    require('./templates').getAll(req, res)
})

router.post('/template/createall', auth, (req, res) => {
    require('./templates').createall(req, res)
})

router.post('/template/delete', auth, (req, res) => {
    require('./templates').delete(req, res)
})


// Tables
router.post('/table/services', auth, (req, res) => {
    require('./services.route').services(req, res)
})

router.post('/table/serviceupdate', auth, (req, res) => {
    require('./services.route').update(req, res)
})

router.post('/table/delete', auth, (req, res) => {
    require('./services.route').delete(req, res)
})

router.post('/table/column', auth, (req, res) => {
    require('./tables').column(req, res)
})

router.post('/table/columndelete', auth, (req, res) => {
    require('./tables').columndelete(req, res)
})

router.post('/table/table', auth, (req, res) => {
    require('./tables').table(req, res)
})

router.post('/table/update', auth, (req, res) => {
    require('./tables').updateTable(req, res)
})

router.post('/table/tabledelete', auth, (req, res) => {
    require('./tables').tabledelete(req, res)
})

router.post('/table/createall', auth, (req, res) => {
    require('./tables').createall(req, res)
})

// Clients
router.post('/clients/getclients', auth, (req, res) => {
    require('./getclients.route').getAll(req, res)
})
router.post('/clients/getclients/filtr', auth, (req, res) => {
    require('./getclients.route').getClientsByFilter(req, res)
})

router.post('/clients/statsionarclients/get', auth, (req, res) => {
    require('./getclients.route').getStatsionarAll(req, res)
})

router.post('/clients/gettemplates', auth, (req, res) => {
    require('./getclients.route').gettemplates(req, res)
})

router.post('/clients/service/add', auth, (req, res) => {
    require('./getclients.route').addservices(req, res)
})

router.post('/clients/statsionar/service/add', auth, (req, res) => {
    require('./getclients.route').addStatsionarService(req, res)
})

router.post('/clients/adopt', auth, (req, res) => {
    require('./getclients.route').adoptClient(req, res);
})

router.post('/clients/statsionar/adopt', auth, (req, res) => {
    require('./getclients.route').adoptStatsionarClient(req, res);
})

router.post('/clients/services/get', auth, (req, res) => {
    require('./getclients.route').getServices(req, res);
})


// 
router.post('/table/correct', auth, (req, res) => {
    require('./tables').correctTables(req, res);
})


//Filial transfer
router.post('/table/filialtransfer', (req, res) => {
    require('./tables').transferTables(req, res);
})

//Conclusion
router.post('/conclusion/client_info/get', (req, res) => {
    require('./conclusion').getClientInfo(req, res);
})

router.post('/conclusion/client/save', (req, res) => {
    require('./conclusion').save(req, res)
})


router.post('/conclusion/template/create', (req, res) => {
    require('./conclusion').createTemp(req, res);
})

router.post('/conclusion/template/get', (req, res) => {
    require('./conclusion').getTemps(req, res);
})

router.post('/conclusion/template/delete', (req, res) => {
    require('./conclusion').delete(req, res);
})


router.post('/conclusion/clients/get', (req, res) => {
    require('./conclusion').getClients(req, res);
})


//==============================================================
router.post('/client/history/get', (req, res) => {
    require('./getclients.route').getClientHistory(req, res);
})


//===============================================================
//===============================================================

router.post('/directdoctors/get', (req, res) => {
    require('./directdoctors').getDirectDoctors(req, res)
})

router.post('/directdoctors/services/get', (req, res) => {
    require('./directdoctors').getDirectService(req, res)
})
router.get('/complaint', auth, (req, res) => {
    require('./directdoctors').getComplaint(req, res)
})
router.post('/complaint', auth, (req, res) => {
    require('./directdoctors').updateAndCreateComplaint(req, res)
})


//===============================================================
//===============================================================

router.post('/statsionardoctors/get', auth, (req, res) => {
    require('./statsionardoctor').getStatsionarDoctor(req, res)
})

router.post('/statsionardoctors/room/get', auth, (req, res) => {
    require('./statsionardoctor').getStatsionarRoom(req, res)
})




module.exports = router
