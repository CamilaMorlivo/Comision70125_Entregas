const {Router}          = require('express')
const router            = Router()
const { productModel }  = require('../models/products.model');

const paginate = async(limit, page) => {

    const listaProductos          = await productModel.paginate({}, {limit, page})
    
    const productosResultadoFinal = listaProductos.docs.map( prod => {

        const{_id, ...rest} = prod.toObject()
        return rest

    })

    const respuesta = ({
        status:         'success', 
        payload:        productosResultadoFinal, 
        'totalPages':   listaProductos.totalPages,
        'prevPage':     listaProductos.prevPage,
        'nextPage':     listaProductos.nextPage,
        'page':         listaProductos.page,
        'hasPrevPage':  listaProductos.hasPrevPage,
        'hasNextPage':  listaProductos.hasNextPage,
        'prevLink':     null, 
        'nextLink':     null
    })

    return respuesta

}

const ordernarListaAsc = async () => {

    listaProductosOrdenada = await productModel.aggregate([
        {
            $sort: {
                price: 1
            }
        }
    ])

    return listaProductosOrdenada;

}

const ordernarListaDesc = async () => {

    listaProductosOrdenada = await productModel.aggregate([
        {
            $sort: {
                price: -1
            }
        }
    ])

    return listaProductosOrdenada;
}

router.get('/', async (req, res) => {

    try {

        let limit = req.query.limit || 10
        let page  = req.query.page  || 1
        let orden = req.query.sort
        let respuestaFinal


        if(orden == null || orden == undefined){

            const respuesta = await paginate(limit,page)

            res.send({respuesta})
    
        }else{
     
            if (orden != 'asc' && orden != 'desc') {
               return res.status(400).send({status: 'error', error: 'Los datos son incorrectos.' })  
            }
            
            if(orden == 'asc') {       
                respuestaFinal = await ordernarListaAsc()
            }else{

                respuestaFinal = await ordernarListaDesc()
            }
    
            res.send({status: 'success', data: respuestaFinal})
            
        }
        
    } catch (error) {

        console.log(error)
        res.status(500).send("Error.")

    }
    

})

router.get('/:id', async (req, res) => {

    try {

        const {id}    = req.params
        const product = await productModel.findOne({_id: id})

        res.send({status: 'success', payload: product})

    } catch (error) {

        console.log(error)
        res.status(500).send("Error.")

    }
    
})

router.post('/', async (req, res) => {

    try {

        const { body } = req
    
        if( !body.title         ||
            !body.description   ||
            !body.code          ||
            !body.price         || 
            !body.stock         ||
            !body.category    
        ){
            return res.status(400).send({status: 'error', error: 'Faltan datos.' })
        } 
    
        if(isNaN(body.price) || isNaN(body.stock)){
            return res.status(400).send({status: 'error', error: 'El tipo de dato es incorrecto.'})
        }
    
        const newProduct = await productModel.create(body)
        console.log(newProduct)
    
        res.status(200).send({status:'success', message:'Nuevo producto creado.', data:newProduct})

    } catch (error) {

        console.log(error)
        res.status(500).send("Error.")

    }
    

})

router.put('/:id', async (req, res) => {

    try {

        const { id }        = req.params
        const prodToReplace = req.body 

        const datosProduct  = await productModel.findById({_id:id})
        const result        = await productModel.updateOne({_id: id}, prodToReplace)
    
        res.send({status: 'succes', message: `El producto ${datosProduct.title} ha sido actualizado.`})

    } catch (error) {

        console.log(error)
        res.status(500).send("Error.")

    }
    
})

router.delete('/:id', async (req, res) => {

    try {

        const {id}   = req.params

        const datosProduct = await productModel.findById({_id:id})
        const result = await productModel.deleteOne({_id:id})

        res.send({status: 'succes', message: `El producto ${datosProduct.title} ha sido borrado.`})

    } catch (error) {

        console.log(error)
        res.status(500).send("Error.")

    }
      
})


module.exports = router


