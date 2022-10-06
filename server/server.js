const express =  require('express');
const bodyParser = require('body-parser'); 

const app = express();
const mongoose = require('mongoose');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.text())


const productRoutes = require('./routes/products.routes');

//CAMBIAR CREDENCIALES DE MONGODB
const MONGODB_URI = 'mongodb+srv://Alejandro:c4p4f8yo2otozdNS@cluster0.uttpe.mongodb.net/productos';

app.use(productRoutes)


app.use(express.static(path.join(__dirname, '/public')));

app.set('view engine', 'ejs');
app.set('views', 'views');




mongoose
    .connect(MONGODB_URI)
    .then(result => {
        app.listen(process.env.PORT || 3000);
        console.info('Server started on port %s.', '3000')
    })
    .catch(err => {
        console.log(err);
    });
