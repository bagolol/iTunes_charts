var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var xml = require('./parseXml.js');
var request = require('request');
var parseString = require('xml2js').parseString;
var fs = require('fs');
var dir = process.cwd() || __dirname;



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 8080));


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
                var fileName = product + "_" + market.toUpperCase() + ".csv";
                console.log("File name", fileName);
                res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
                res.set('Content-Type', 'text/csv');
                res.charset = 'binary';
                res.send(data);         
            });
        };
    });
    
});

app.listen(app.get('port'), function () {
    console.log("server listening on port" + app.get('port'));
});