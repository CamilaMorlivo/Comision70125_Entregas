const {connect} = require('mongoose')

module.exports.connectDB = async () => {

    console.log('Base de datos conectada')
    
    return await connect('mongodb+srv://Camila:Panyqueso1.@cluster0.miunx.mongodb.net/Ecommerse70125')

}