const {Router}          = require('express')
const { productModel }  = require('../models/products.model')
const { cartModel }     = require('../models/carts.model')
const router            = Router()

router.get('/products', async (req,res) => {

    let page  = req.query.page  || 1
    let limit = req.query.limit || 10

    try {

        const listadoProducts = await productModel.paginate({}, {limit, page})
        
        const productsResultadoFinal = listadoProducts.docs.map( prod => {
            const {id, ...rest} = prod.toObject()
            return rest
        })

        res.render('home', {
            styless:        'estilosHome.css',
            title:          'HOME',
            productos:      productsResultadoFinal,
            hasPrevPage:    listadoProducts.hasPrevPage,
            hasNextPage:    listadoProducts.hasNextPage,
            prevPage:       listadoProducts.prevPage,
            nextPage:       listadoProducts.nextPage,
            currentPage:    listadoProducts.page,
            totalPages:     listadoProducts.totalPages
        })

    } catch (error) {
        console.log(error)
        res.status(500).send("Error.")
    }
})

router.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts', {
        styless: 'estilosRealTimeProducts.css',
        title: 'INGRESAR UN PRODUCTO'
    })
})

router.get('/carts/:cid', async (req, res) => {

    try {
        const {cid}     = req.params
        const carrito   = await cartModel.findOne({_id: cid})


        const productsCart = carrito.products.map( prod => {
            const {id, ...rest} = prod.toObject()
            return rest
        })

        console.log(productsCart)

        res.render('carrito', {
            carrito:    productsCart,
            title:      'CARRITO',
            styless:    'estilosHome.css'
        })        

    } catch (error) {
        console.log(error)
        res.status(500).send("Error.")
    }
})


module.exports = router