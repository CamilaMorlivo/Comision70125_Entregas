const {Router} = require('express')

const router = Router()

router.use('/', (req, res) => {
    res.render('realTimeProducts', {
    })
})

module.exports = router