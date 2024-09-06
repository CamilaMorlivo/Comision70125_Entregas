const {Router}      = require('express')
const { cartModel } = require('../models/carts.model');
const router        = Router()

router.post('/', async (req, res) => {

    try {

        const { body } = req
        const newCart  = await cartModel.create(body)
 
        
        res.status(200).send({status: 'succes', message: `Nuevo carrito creado. ID: ${newCart._id}`})


    } catch (error) {
        console.log(error)
        res.status(500).send("Error.")
    }
      
})

router.get('/:id', async(req, res) => {
    
    try {

        const {id}     = req.params

        const carritos = await cartModel.findOne({_id: id})

        res.send({status: 'success', data: carritos})
    
    } catch (error) {
        console.log(error)
        res.status(500).send("Error.")
    }

})

router.post('/:cid/product/:pid', async(req, res) => {

    try {
        
        const {cid}     = req.params
        const {pid}     = req.params
        const quantity  = req.query.quantity
    
    
        const cart = await cartModel.findById({_id: cid})
    
        cart.products.push({product: pid, quantity: quantity})
    
        const respuesta = await cartModel.findByIdAndUpdate({_id: cid}, cart)

        res.status(200).send({status: 'succes', message: `El producto ${pid} se guardo en el carrito ${cid}.`, data:respuesta})


    } catch (error) {
        console.log(error)
        res.status(500).send("Error.")
    }

})

router.delete('/:cid/product/:pid', async(req, res) => {

    try {
        
        const {cid} = req.params
        const {pid} = req.params
        const cart  = await cartModel.findById({_id: cid})
        let index
        
        for (let i = 0; i < cart.products.length; i++) {
 
            let id = JSON.stringify(cart.products[i].product._id)

            id = id.slice(1);
            id = id.slice(0, -1)

            if ( id === pid ) {

                index = i       
            
            } 
        } 
  
        delete(cart.products[index])
        const newCart = cart.products.filter(p => p != null)
        
        const respuesta = await cartModel.findByIdAndUpdate({_id: cid }, {products: newCart})

        res.send({status: 'succes', message: `El producto ${pid} ha sido eliminado del carrito ${cid}.`})

   
    } catch (error) {
        console.log(error)
        res.status(500).send("Error.")
    }

})

router.put('/:cid/product/:pid', async(req,res) =>{

    try {

        
        const {cid}  = req.params
        const {pid}  = req.params
        const {body} = req   
        let idFund   = false    

        const cart = await cartModel.findById({_id:cid})

        cart.products.map( (prod) => {            

            if(prod.product._id == pid){
                idFund = true
                prod.quantity = body.quantity
            }

        })

        if(!idFund){
            return res.status(400).send({status: 'error', error: 'Los datos son incorrectos.' })
        }

        const respuesta = await cartModel.findByIdAndUpdate({_id: cid }, cart)

        res.send({status: 'succes', message: `El producto ${pid} ha sido actualizado.`})
 
    } catch (error) {
        console.log(error)
        res.status(500).send("Error.")
    }
    
})

router.delete('/:cid', async (req, res) => {

    try {
        
        const {cid} = req.params

        const respuesta = await cartModel.findByIdAndUpdate({_id: cid }, {products: []})
        
        res.send({status: 'succes', message: `El carrito ${cid} ha sido vaciado.`})
    
    } catch (error) {
        console.log(error)
        res.status(500).send("Error.")
    }

})

module.exports = router