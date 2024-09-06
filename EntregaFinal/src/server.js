const express       = require('express')
const productRouter = require('./routes/products.router.js')
const viewsRouter   = require('./routes/views.router.js')
const handlebars    = require('express-handlebars')
const cartRouter    = require('./routes/cart.router.js')


const { Server  } = require('socket.io')
const {connectDB} = require('./config/database.js')


const app  = express()
const PORT = 8080

 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))


app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')


connectDB()


app.use('/', viewsRouter)
app.use('/api/cart', cartRouter)
app.use('/api/products', productRouter)


app.use((error, req, res, next) => {
    console.log(error.stack)
    res.status(500).send('error de server')
})


const httpServer = app.listen(PORT, () => {
    console.log('escuchando en el puerto: ', PORT)
})

const io = new Server(httpServer)

let productos = []

io.on('connection', socket => {

    console.log('Nuevo cliente conectado')

    socket.emit('productosExistentes', productos)

    socket.on('nuevoProducto', data => {

        productos.push(data.datosProd)

        io.emit('mostrarProductos', productos)
       
    })
    
})
