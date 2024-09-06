const {Schema, model}  = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const  productsCollection = 'products'

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    price: Number,
    stock: Number,
    category: {
        type: String,
        required: true
    },
    create: {
        type: Date,
        default: Date.now()
    }

})

ProductSchema.plugin(mongoosePaginate)

const productModel = model(productsCollection, ProductSchema);

module.exports = {
    productModel
}