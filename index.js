var express = require('express');
var bodyParser = require('body-parser');
var knex = require('knex');

var db = knex({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        // TODO: replace with real username and password
        user: 'root',
        password: 'root',
        database: 'people_api'
    },
    pool: {
        min: 0,
        max: 7
    }
});

var app = express();
app.use(bodyParser.json());
app.use('/ui', express.static('ui'));

app.get('/api/people', function(req, res) {
    db.raw("select * from people").then(function(result) {
        res.status(200).send(result[0]);
    }, function() {
        res.status(500).send("Error: couldn't connect to the database");
    });
});

app.get('/api/people/:id', function(req, res) {
    db.raw("select * from people where id= ?", [req.params.id]).then(function(result) {
        if(result[0].length === 0) {
            res.status(404).send("Id number not found");
            return;
        }
        res.status(200).send(result[0][0]);
    }, function() {
       res.status(500).send("Error: couldn't connect to the database"); 
    });
});

app.delete('/api/people/:id', function(req, res) {
    db.raw("delete from people where id= ?", [req.params.id]).then(function(result) {
        res.status(204).send();
    }, function() {
        res.status(500).send("Error: couldn't connect to the database");
    });
});

app.put('/api/people/:id', function(req, res) {
    if(req.body.firstName.length < 1) {
        res.status(400).send('First name required');
        return;
    }
    if(req.body.lastName.length < 1 ){
        res.status(400).send('Last name required');
        return;
    }
    if(req.body.age < 1 ){
        res.status(400).send('Valid age required');
        return;
    }
    if(req.body.id != req.params.id ){
        res.status(400).send('Id in body must match URL request');
        return;
    }
    db.raw("insert into people values (?, ?, ?, ?)", [req.body.id, req.body.firstName, req.body.lastName, req.body.age]).then(function(result) {
        res.status(201).send();
    }, function() {
        res.status(500).send("Error: couldn't connect to the database");
    });
});

app.listen(3000);