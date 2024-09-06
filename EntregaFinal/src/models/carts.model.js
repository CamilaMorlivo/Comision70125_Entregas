const { Schema, model } = require('mongoose')

const cartsCollection = 'carts'

const CartSchema = new Schema({

    products: {
        type: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'products'
            },
            quantity: {
                type: Number
            }
        }]
    }

})


CartSchema.pre('findOne', function() {
    this.populate('products.product')
})

const cartModel = model(cartsCollection, CartSchema)

module.exports = {
    cartModel
}
