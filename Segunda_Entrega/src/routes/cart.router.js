const {Router}  = require('express')
const fs        = require('fs');
const router    = Router()
let carritos    = []

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

class Producto{
    constructor(id, quantity){
        this.id = id
        this.quantity = quantity
    }
}

//1.Crear una ruta POST que debera agregar un nuevo carrito con la siguiente estructura:
router.post('/', (peticion, respuesta) => {
    
    const { body }      = peticion
    const prods         = body.productos
    let productos       = []
    const ruta          = './carritosCreados.txt'

    if(!body.productos){
        return respuesta.status(400).send({status: 'error', error: 'Faltan datos.'})
    } 

    for (let i = 0; i < prods.length; i++) {      

        if(isNaN(prods[i])){
            return respuesta.status(400).send({status: 'error', error: 'Los datos son incorrectos.'})
        }

        let producto = new Producto(prods[i], 1)

        productos.push(producto)
   
    }

    carritos.push({ id: carritos.length + 1, productos})

    const carritoCompleto = carritos
 
    crearArchivo(ruta, carritos)

    respuesta.status(200).send({carritos:carritoCompleto})
})

//2.Crear una ruta GET/:id que debera obtener los productos que pertenezcan al carrito con el parametro cid
router.get('/:id', (peticion, respuesta) => {
    const getProducts   = fs.readFileSync('./getProducts.txt', 'utf-8')
    const archivoExiste = fs.existsSync('./getCarrito.txt')
    const ruta          = './getCarrito.txt' 
    const {id}          = peticion.params
    const cIndex        = carritos.findIndex(c => c.id == Number(id))
    const productos     = carritos[cIndex].productos
    const stockProducts = JSON.parse(getProducts)
    const idProductos   = []
    const valoresProd   = []
    const tProductos    = []

    for (let i = 0; i < productos.length; i++) {
        idProductos.push(productos[i].id)
    }

    for (let i = 0; i < idProductos.length; i++) {
        const vProductos = stockProducts.filter(s => s.id == idProductos[i]) 
        valoresProd.push(vProductos)
    }

    for (let i = 0; i < valoresProd.length; i++) {

        const valoresP = Object.values(valoresProd[i])
        const nombres = valoresP.map((n) => n.title)

        tProductos.push(nombres)
    }

    if(!archivoExiste){
        crearArchivo(ruta, tProductos)
    }else{
        actualizarArchivo(ruta, tProductos)
    }

    respuesta.send({carrito:tProductos})
})

//3.Crear una ruta POST/:cid/product/:pid que debera agregar el producto al arreglo "products" del carrito seleccionado, agregandose como un objeto
router.post('/:cid/product/:pid', (peticion, respuesta) => {

    const {cid}         = peticion.params
    const {pid}         = peticion.params
    const cIndex        = carritos.findIndex(c => c.id == Number(cid))
    const ruta          = './carritoModificado'
    const archivoExiste = fs.existsSync('./carritoModificado')

    if(cIndex == -1){
        return respuesta.status(404).send({status: 'error', error: 'El carrito no existe.'})
    }

    const pIndex = carritos[cIndex].productos.findIndex(p => p.id == Number(pid))

    if(pIndex != -1 ){
        carritos[cIndex].productos[pIndex].quantity++      
    }else{
        const newProduct = new Producto(Number(pid), 1)
        carritos[cIndex].productos.push(newProduct)
    }

    if(!archivoExiste){
        crearArchivo(ruta, carritos[cIndex])
    }else{
        actualizarArchivo(ruta, carritos[cIndex])
    }

    respuesta.status(200).send({carritos:carritos})

})


module.exports = router