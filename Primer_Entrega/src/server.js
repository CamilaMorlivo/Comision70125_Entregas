const express       = require('express')
const productRouter = require('./routes/products.router.js')
const cartRouter    = require('./routes/cart.router.js')

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/products', productRouter)
app.use('/api/cart', cartRouter)

app.listen(PORT, () => {
    console.log('Escuchando en el puerto: ', PORT)
})