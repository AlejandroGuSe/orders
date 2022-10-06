const mongoose = require('mongoose');
 
const Schema = mongoose.Schema;

const orderretribuirSchema = new Schema({
    id_order: 
        {
            type: Number, required: true,
        },
    user: {
        type: Number, required: true
    }
});

module.exports = mongoose.model('Order', orderretribuirSchema );