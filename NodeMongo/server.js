//Inicio das declarações genéricas para poder funcionar o servidor
//São sempre iguais
const express = require("express");
const bodyParse = require("body-parser");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const app = express();
 
const port = "3000";
 
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: true }));

//Fim das declarações

//Declaração do endereço do meu servidor
//Realiza a conexão com o BD
mongoose.connect("mongodb+srv://nome:senha@bdquiz-f0ugo.mongodb.net/test?retryWrites=true&w=majority");
 
//Declaração de como será a estrutura do JSON que será salvo no BD 

const schema = new Schema({
 
    name:{
        type: String,
        required: [true, "Nome é Obrigatório!"],
        trim: true,
        unique: true
    },
    level:{
        type: Number,
        required: [true, "Level é Obrigatório!"]
    },
    score:{
        type: Number,
        required: [true, "Score é Obrigatório!"]
    }
 
});
 
//Criou uma estrutura que é tipo uma tabela do MySQL
const Player = mongoose.model('Player', schema);
 

//Estruturas que fazem a comunicação com BD utilizando o Node 
app.get("/", function(req, res, next){
 
    res.status(200).send("<h1>Hello Word!</h1>");    
 
});
 
//Dados do Player
app.get("/player", function(req, res, next){
 
 
    Player.find({}).then(data => {   
 
        if (data && data.length != 0) {
            res.status(200).send(data); 
        }else{
            res.status(204).send(); 
        }         
 
    }).catch(e => {
        res.status(500).send(e);
    })
 
});
 
app.get("/player/:name", function(req, res, next){
 
    Player.find({ name: req.params.name}).then(data => { 
        
        if (data && data.length != 0) {
            res.status(200).send(data);  
        }else{
            res.status(204).send();  
        }                    
 
    }).catch(e => {
        res.status(500).send(e);
    })
 
});
 
 
app.post("/player", function(req, res, next){
 
    var playerTemp = new Player(req.body);
 
    playerTemp.save().then(data => {
        if (data && data.length != 0) {
 
            res.status(201).send({
                message: "done"
            });    
 
        }else{
            res.status(400).send({
                message: "check the value"
            });
        }
        
    }).catch(e => {
        res.status(500).send({
            message: "erro",
            erro: e + " "
        });
 
    });
 
});
 
app.put("/player/:name", function(req, res, next){
 
    var query = {name: req.params.name};
 
    Player.findOneAndUpdate(query, req.body, (erro, data) => {
        if (erro) {
            res.status(500).send(erro);
        }else{
            if (data && data.length != 0) {
                res.status(202).send({message: "done"});
            }else{
                res.status(204).send();
            }            
        }
    });
 
});
 
app.delete("/player/:name", function(req, res, next){
 
    
    //res.status(200).send(player);
    var query = {name: req.params.name}
    //var value = req.body;
 
    Player.findOneAndDelete(query).then(data => {
        if (data && data.length != 0) {
            res.status(202).send({message: "done"});
        }else{
            res.status(204).send();
        }
        
    }).catch(e => {
        res.status(500).send(e);
    });
 
 
});
 
 
app.listen(port, function(){
 
    console.log("Server listening on port " + port + "...");
 
});