import express = require('express');
import routes = require('./routes/index');
import http = require('http');
import path = require('path');
import mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'app_nodetest',
    password: 'Letmein123',
    database: 'nodetest',
    debug: false
});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

import stylus = require('stylus');
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/contact', routes.contact);

app.get('/hello',(req, res) => {
    res.json("world! this is pretty nifty");
});

app.get('/api/v1/courseCatalog',(req, res) => {
    res.json("hello, course catalog!");
});

app.get('/api/v1/test',(req, res) => {
    res.json("hello, test catalog!");
});

app.get('/test/database',(req, res) => {

    pool.getConnection((err, conn) => {

        if (err) {
            console.log("err|" + err.message);
            res.json(100, "Error connecting to database");
            return;
        }

        console.log("connected|" + conn.threadId);

        conn.query("select * from coursecatalog",(err, rows) => {
            console.log("rows|");
            console.log(rows);
            res.json({
                hello: "world!",
                text: "so that happened",
                rows: rows
            });

        });

        conn.release();

    });


});

app.get('/test/add',(req, res) => {

    pool.getConnection((err, conn) => {

        if (err) {
            console.log("err|" + err.message);
            res.json(100, "Error connecting to database");
            return;
        }

        //// See: https://github.com/felixge/node-mysql/ (custom format)
        //conn.config.queryFormat = function (query, values) {
        //    if (!values) return query;
        //    return query.replace(/\:(\w+)/g, function (txt, key) {
        //        if (values.hasOwnProperty(key)) {
        //            return this.escape(values[key]);
        //        }
        //        return txt;
        //    }.bind(this));
        //};

        console.log("connected|" + conn.threadId);

        var post = { Json: 'Hello MySQL' };
        var query = conn.query('INSERT INTO coursecatalog SET ?', post,(err, result) => {

            if (err) {
                res.json("err!" + err.message);
            }
            else {
                res.json("writ!" + query.sql);
            }

        });
        console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'

        
      

        //var sql = 'INSERT INTO coursecatalog (json) VALUES("testing") ON DUPLICATE KEY UPDATE json = VALUES("testing")';

        //console.log("sql", sql);

        //conn.query(sql, (err) => {
           
        //    if (err) {
        //        res.json("err|" + err);
        //    }
        //    else {
        //        res.json("OK!");
        //    }

        //});

        conn.release();

    });


});


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
