var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var xml = require('./parseXml.js');
var request = require('request');
var parseString = require('xml2js').parseString;
var fs = require('fs');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');


app.get('/', function(req, res) {  
  res.render('index', { title: 'The index page!' })
});


app.post('/', function(req, res) {
    var market = req.body.market;
    var product = req.body.product;
    var entries = req.body.entries;
    
    var url = xml.createURL(market, product, entries);

    request(url, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            parseString(body, function (err, result) {

                var data = xml.saveList(result, market, product, entries);
                // Inserire codice per salvare il file
                var fileName = __dirname + product + "_" + market.toUpperCase() + ".csv" 
                fs.appendFile(fileName, data, function(e){
                    console.log("parseString", data);
                    console.log("................");
                    res.sendFile(fileName,  function (err) {
                        if (err) {
                            console.log(err);
                            res.status(err.status).end();
                        }
                        else {
                          console.log('Sent:', fileName);
                        }
                    });

                })
                
            });
        };
    });

    // var fileName = 
    // console.log(fileName);
    
});

app.listen(8080, function () {
    console.log("server listening on port 8080")
});