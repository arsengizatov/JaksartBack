const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const http = require("http");

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'database'
});

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/add', (req, res, next) => {
    var body = req.body;
    var n03 = body.no3;
    var me = body.me;
    var al = body.al;
    var c1 = body.c1;
    var ni = body.ni;
    var no2 = body.no2;
    var cr = body.cr;
    var cd = body.cd;
    var ph = body.pH;
    var hW = body.hW;
    var country = body.country;
    var source = body.source;

    con.query('SELECT * FROM Colors WHERE country=? AND source=?',[country, source], (err, result, fields) =>{
        con.on('error', function(err){
            console.log("MYSQL ERROR: " + err); 
        });

        if (result && result.length) {
            res.json("Location already exist");
        } else {
            con.query('INSERT INTO `colors`(`no3`, `me`, `al`, `c1`, `ni`, `no2`, `cr`, `cd`, `pH`, `hW`, `country`, `source`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
                        [n03, me, al, c1, ni, no2, cr, cd, ph, hW, country, source], (err, result, fields) => {
                            con.on('error', function(err) {
                                console.log("MYSQL ERROR: " + err)
                                res.json('Insert error: ' + err);
                            });

                            res.json("Insert succesful!!!");
                        });
        }
    });
});

app.post('/check', (req, res, next) => {
    var body = req.body;

    var country = body.country;
    var source = body.source;

    con.query('SELECT * FROM Colors WHERE country=? AND source=?',[country, source], function(err, result, fields) {
        con.on('error', function(err) {
            console.log("MYSQL ERROR", err);
            res.json("LOGIN error", err);
        });

        if (result && result.length) {
            res.end(JSON.stringify({
                'country' : result[0].country,
                'source' : result[0].source
            }));
        } else {
            res.end(JSON.stringify("Location does't exist"));
        }
    });
});

var httpServer = http.createServer(app);

httpServer.listen(3000, '10.48.38.252', function() {
    console.log("SERVER IS STARTED WITH 10.48.38.252");
})
