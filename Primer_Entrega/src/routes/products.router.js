const {Router}  = require('express')
const fs        = require('fs');
const router    = Router()
const productos = []

const crearArchivo = (ruta, contenido) => {
    fs.writeFile(ruta, JSON.stringify(contenido), (error) => {
        if(error) return console.log("No se pudo escribir el archivo");
        console.log("Archivo creado!")
    })  
}

const actualizarArchivo = (ruta, contenido) => {
    fs.appendFile(ruta, JSON.stringify(contenido), (error) => {
        if(error) return console.log("No se pudo actualizar el archivo.");
        console.log("Archivo actualizado!")
    })
}


//1.Crear una ruta GET que debera listar todos los productos de la base []
router.get('/', (peticion, respuesta) => {

    const ruta = './getProducts.txt'

    crearArchivo(ruta, productos)

    respuesta.send({data: productos})
})

//2.Crear una ruta GET/:uid que debera traer solo un producto
router.get('/:id', (peticion, respuesta) => {

    const {id}          = peticion.params
    const producto      = productos.filter(producto => producto.id == Number(id))
    const archivoExiste = fs.existsSync('./getProduct.txt')
    const ruta          = './getProduct.txt' 

    if(!archivoExiste){
        crearArchivo(ruta, producto)
    }else{
        actualizarArchivo(ruta, producto)
    }

    respuesta.send(producto)
})

//3.Crear una ruta POST que agregara un nuevo producto a la base 
router.post('/', (peticion, respuesta) => {
    
    const { body }      = peticion
    const ruta          = './productosCreados.txt'

    if( !body.title         ||
        !body.description   ||
        !body.code          ||
        !body.price         || 
        !body.stock         ||
        !body.category    
    ){
        return respuesta.status(400).send({status: 'error', error: 'Faltan datos.' })
    } 

    if(isNaN(body.price) || isNaN(body.stock)){
        return respuesta.status(400).send({status: 'error', error: 'El tipo de dato es incorrecto.'})
    }

    productos.push({ id: productos.length + 1, ...body, status: true})

    crearArchivo(ruta, productos)

    respuesta.status(200).send({data:productos})

    
})

//4.Crear una ruta PUT/:uid para tomar un producto y actualizarlo con los campos enviados desde el body. 
router.put('/:id', (peticion, respuesta) => {
    
    const { body }      = peticion
    const { id }        = peticion.params
    const prodIndex     = productos.findIndex(prod => prod.id == Number(id))
    const archivoExiste = fs.existsSync('./productosModificados.txt')
    const ruta          = './productosModificados.txt' 


    if(prodIndex === -1){
        return respuesta.status(404).send({status: 'error', error: 'El producto no fue encontrado.'})
    }

    const updateProd = {
        id,
        ...body,
        status: true
    }

    productos[prodIndex] = updateProd

    

    if(!archivoExiste){
        crearArchivo(ruta, updateProd)
    }else{
        actualizarArchivo(ruta, updateProd)
    }

    return respuesta.status(200).json(updateProd)

})

//5.Crear una ruta DELETE/:uid que debera eliminar el producto con el uid indicado.
router.delete('/:id', (peticion, respuesta) => {

    const {id}              = peticion.params
    const nuevaLista        = productos.filter(producto => producto.id != Number(id))
    const productoEliminado = productos.find(p => p.id == Number(id))
    const archivoExiste     = fs.existsSync('./productosEliminados.txt')
    const ruta              = './productosEliminados.txt' 

    if(!archivoExiste){
        crearArchivo(ruta, productoEliminado)
    }else{
        actualizarArchivo(ruta, productoEliminado)
    }

    respuesta.send(nuevaLista)
})


module.exports = router