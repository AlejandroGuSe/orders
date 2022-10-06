const Product = require('../models/product')
const Order= require('../models/order')
const fs = require('fs')
const formidable = require('formidable')
const path = require('path')
const { parse } = require('csv-parse')
const async = require('async')

exports.loadordenes = (req, res, next) => {
    res.render('loadordenes', {
        path: '/loadordenes'
     })
}

exports.viewload = (req, res, next) => {
     let form = new formidable.IncomingForm()
    let column1 = []
    let column2 = []
    let column3 = []

    form.parse(req, function(err, fields, files){
  
        var oldPath = files.profilePic.filepath;
         var newPath = './public/product.csv'
         console.log(files.profilePic.filepath)       
         var rawData = fs.readFileSync(oldPath)
      
         fs.writeFile(newPath, rawData, function(err){
             if(err) console.log(err)
         })
         let contador = 0; 
        fs.createReadStream('./public/product.csv')
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", function (row) {
              console.log(row)  
              column1[contador] = row[0];
              column2[contador] = row[1];
              column3[contador] = row[2];
              contador++;
        })
        .on("end", function () {
                 let dataArray = []
                 let contador = 0;
                 let indexorder = 1;
                 let bandera = 0;
                  Product.findOne({}, {}, { sort: { 'id_order' : 'descending' } }, function(err, post) {
                     if(post === null){indexorder = 1;} else {indexorder = post.id_order  + 1;}



                     column1.forEach((element, index) => {
                        console.log(column2[contador])
                        dataArray[contador] = {id:column1[contador], productos: {
                           sku: column2[contador],
                           quantity: column3[contador],
                        } }
                        contador++    
                    }) 
                   async.eachOfSeries(dataArray, function(dataVar, key, callback) {
                       Product.findOne({
                           id: dataVar.id, 
                           id_order: indexorder
                       }, function(err, product) {
                           if (!product) { 
                               var productSchema = new Product({
                                   id: dataVar.id,
                                   productos: dataVar.productos,
                                   id_order: indexorder
                               });
                               productSchema.save(function(err, result) {
                                   console.log('New Record Inserted')
                                   bandera++;
                                   callback();
                               })
                           } else { 
                               Product.findOneAndUpdate({id: dataVar.id, id_order: indexorder}, {$push: {productos: dataVar.productos}}, {id_order: indexorder},  function(err, result) {
                                   console.log('Record Updated')
                                   bandera++;
                                   callback();
                               })
                           }
                       })
                   }, function(err) {
                       if (err) console.log(err.message)
                       
                      $timeout = setInterval(() => {
                           if(bandera > 0) {
                               res.redirect('/ordenes');
                           }else{
                            console.log('Intentelo de nuevo no surgio un problema al  archivo') 
                            res.redirect('/products');
                               
                           }
                           clearInterval($timeout);
                       }, 5000);  
                       console.log("DONE ")
                   });
            });



            })
                    .on("error", function (error) {
                        console.log(error.message);
                    });
            })
            }


exports.getOrders = (req, res, next) => {
    Product.find().then(orders => {
        res.render('ordenes', {
        path: '/orders',
        orders: orders
    }
    );
})
};

exports.setOrders = (req, res, next) => {
    const orderId = req.body.claveorder
    console.log(orderId)
     Order.findOne({id_order: req.body.claveorder}).then(orders => {
        console.log(orders)
        if(!orders){
            const  order = new Order({
                id_order: req.body.claveorder,
                user: 1
            });
            return order.save()
        }
    }
    ).then(resp => {
        res.redirect('/orden-retr');
    }).catch(err => {
        console.log(err)
    })
};
