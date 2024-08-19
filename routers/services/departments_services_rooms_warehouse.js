const { Router } = require('express')
const router = Router()
const auth = require('../../middleware/auth.middleware')
//========================================================
// DEPARTMENT
router.post('/department/registerall', auth, (req, res) => {
    require('./department').registerAll(req, res)
})

router.post('/department/register', auth, (req, res) => {
    require('./department').register(req, res)
})
router.patch('/department/switchTurn', auth, (req, res) => {
    require('./department').switchTurn(req, res)
})
router.post('/department/getall', (req, res) => {
    require('./department').getAll(req, res)
})

router.post('/department/reseption', auth, (req, res) => {
    require('./department').getAllReseption(req, res)
})

router.post('/department/reseptionbyid', auth, (req, res) => {
    require('./department').getAllReseptionById(req, res)
})

router.get('/department', auth, (req, res) => {
    require('./department').get(req, res)
})

router.put('/department', auth, (req, res) => {
    require('./department').update(req, res)
})

router.delete('/department', auth, (req, res) => {
    require('./department').delete(req, res)
})

router.delete('/department/deleteall', auth, (req, res) => {
    require('./department').deleteAll(req, res)
})

//========================================================
// SERVICE
router.post('/service/registerall', auth, (req, res) => {
    require('./service').registerAll(req, res)
})

router.post('/service/register', auth, (req, res) => {
    require('./service').register(req, res)
})

router.post('/service/getalldepartment', auth, (req, res) => {
    require('./service').getAllDepartment(req, res)
})

router.post('/service/getall', auth, (req, res) => {
    require('./service').getAll(req, res)
})

router.put('/service/update', auth, (req, res) => {
    require('./service').update(req, res)
})

router.delete('/service', auth, (req, res) => {
    require('./service').delete(req, res)
})

router.delete('/service/deleteall', auth, (req, res) => {
    require('./service').deleteAll(req, res)
})

router.delete('/service/deletealldepartment', auth, (req, res) => {
    require('./service').deleteAllDepartment(req, res)
})

router.post('/service/popular/get', auth, (req, res) => {
    require('./popularservices').get(req, res);
})

//========================================================
// SERVICETYPE
router.post('/servicetype/registerall', auth, (req, res) => {
    require('./servicetype').registerAll(req, res)
})


router.post('/servicetype/findById', auth, (req, res) => {
    require('./servicetype').findById(req, res)
})

router.post('/servicetype/register', auth, (req, res) => {
    require('./servicetype').register(req, res)
})

router.post('/servicetype/getalldepartment', auth, (req, res) => {
    require('./servicetype').getAllDepartment(req, res)
})

router.post('/servicetype/getall', auth, (req, res) => {
    require('./servicetype').getAll(req, res)
})

router.put('/servicetype/update', auth, (req, res) => {
    require('./servicetype').update(req, res)
})

router.delete('/servicetype', auth, (req, res) => {
    require('./servicetype').delete(req, res)
})

router.delete('/servicetype/deleteall', auth, (req, res) => {
    require('./servicetype').deleteAll(req, res)
})

router.delete('/servicetype/deletealldepartment', auth, (req, res) => {
    require('./servicetype').deleteAllDepartment(req, res)
})

//========================================================
// ROOMS
router.post('/room/registerall', auth, (req, res) => {
    require('./room').registerAll(req, res)
})

router.post('/room/register', auth, (req, res) => {
    require('./room').register(req, res)
})

router.post('/room/getall', auth, (req, res) => {
    require('./room').getAll(req, res)
})

router.post('/room/notbusy', auth, (req, res) => {
    require('./room').getnotbusy(req, res)
})

router.put('/room/update', auth, (req, res) => {
    require('./room').update(req, res)
})

router.delete('/room', auth, (req, res) => {
    require('./room').delete(req, res)
})

router.delete('/room/deleteall', auth, (req, res) => {
    require('./room').deleteAll(req, res)
})

//========================================================
// PRODUCTS
router.post('/product/registerall', auth, (req, res) => {
    require('./product').registerAll(req, res)
})

router.post('/product/register', auth, (req, res) => {
    require('./product').register(req, res)
})

router.post('/product/getall', auth, (req, res) => {
    require('./product').getAll(req, res)
})

router.post('/product/getproducts', auth, (req, res) => {
    require('./product').getProducts(req, res)
})

router.post('/product/getallreseption', auth, (req, res) => {
    require('./product').getAllReseption(req, res)
})

router.put('/product/update', auth, (req, res) => {
    require('./product').update(req, res)
})

router.delete('/product', auth, (req, res) => {
    require('./product').delete(req, res)
})

router.delete('/product/deleteall', auth, (req, res) => {
    require('./product').deleteAll(req, res)
})

//========================================================
// WAREHOUSE
router.post('/warehouse/registerall', auth, (req, res) => {
    require('./warehouse').registerAll(req, res)
})

router.post('/warehouse/register', auth, (req, res) => {
    require('./warehouse').register(req, res)
})

router.post('/warehouse/getall', auth, (req, res) => {
    require('./warehouse').getAll(req, res)
})

router.post('/warehouse/getallproduct', auth, (req, res) => {
    require('./warehouse').getAllProduct(req, res)
})

router.put('/warehouse/update', auth, (req, res) => {
    require('./warehouse').update(req, res)
})

router.delete('/warehouse', auth, (req, res) => {
    require('./warehouse').delete(req, res)
})

router.delete('/warehouse/deleteall', auth, (req, res) => {
    require('./warehouse').deleteAll(req, res)
})

router.delete('/warehouse/deleteallproduct', auth, (req, res) => {
    require('./warehouse').deleteAllProduct(req, res)
})

//========================================================
// PRODUCTCONNECTOR
router.post('/productconnector/register', auth, (req, res) => {
    require('./productconnector').register(req, res)
})

router.post('/productconnector/getall', auth, (req, res) => {
    require('./productconnector').getAll(req, res)
})

router.put('/productconnector/update', auth, (req, res) => {
    require('./productconnector').update(req, res)
})

router.delete('/productconnector', auth, (req, res) => {
    require('./productconnector').delete(req, res)
})

router.delete('/productconnector/deleteall', auth, (req, res) => {
    require('./productconnector').deleteAll(req, res)
})


//=========================================================
//=========================================================


module.exports = router
