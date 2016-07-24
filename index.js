var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
var people = [{firstName: "Julie", lastName: "Thompson", age: 30, id: 22}, 
              {firstName: "Kirk", lastName: "Thompson", age: 31, id: 7},
              {firstName: "Sabrina", lastName: "Thomlan", age: 77, id: 3}];

app.get('/api/people', function(req, res) {
    res.status(200).send(people);
});

app.get('/api/people/:id', function(req, res) {
    for(var i = 0; i < people.length; i++){
        if(people[i].id == req.params.id) {
            res.status(200).send(people[i]);
            return;
        } 
    }
    res.status(404).send('Id number not found');
});

app.delete('/api/people/:id', function(req, res) {
    for(var i = 0; i < people.length; i++){
        if(people[i].id == req.params.id) {
            res.status(204).send();
            people.splice(i, 1);
            return;
        } 
    }
    res.status(404).send('Id number not found');
});

app.put('/api/people/:id', function(req, res) {
    for(var i = 0; i < people.length; i++){
        if(people[i].id == req.params.id) {
            res.status(409).send('Id number already exists');
            return;
        } 
    }
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
    res.status(201).send();
    people.push(req.body);
});

app.listen(3000);