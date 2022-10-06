const mongoose = require('mongoose');
 
const Schema = mongoose.Schema;

const productSchema = new Schema({
    id : {
        type: Number,
        required: true
    },
    productos: [
        {
            sku: {type: String, required: true},
            quantity: {type: String, required: true} 
        }
    ],
    id_order :  {
        type: Number,
        required: true
    } 
});




module.exports = mongoose.model('Productos', productSchema);