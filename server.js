const express = require('express');
const server =  express();


// Configurar arquivos extras, como css da página
server.use(express.static('public'))


// Habilitar o body do form
server.use(express.urlencoded({ extended: true }))

// Configurar conexao com banco de dados postgres
const Pool = require('pg').Pool
const db = new Pool({
  user: 'postgres',
  password: 'Felipe17',
  host: 'localhost',
  port: 5432,
  database: 'doe'
})



// Configurando a template NUNJUCKS engine (dependência)
// Nunjuck permite enviar dados pra dentro do HTML
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
  express: server,
  noCache: true, //não pegar do cache dos dados de donors
})

// Lista de doadores: Array


// Configurar a apresentação da página
server.get("/", function(req, res){
  db.query("SELECT * FROM donors", function(err, result) {
    if (err) return res.send("ERRO de banco de dados.")
  
    const donors = result.rows
    return res.render("index.html", { donors })
  })
  
})

server.post("/", function(req, res) {
  //Pegar dados do formulário
  const name = req.body.name
  const email = req.body.email
  const blood = req.body.blood



  // Tratamento de campos vazio no form
  if (name == "" || email == "" || blood == "") {
    return res.send("Todos os campos são obrigatórios.")
  }


  //Add no banco
  const query = `
    INSERT INTO donors ("name", "email", "blood")
    VALUES ($1, $2, $3)`
  
  const values = [name, email, blood];
  
  db.query(query, values, function(err) {
    if (err) return res.send("ERRO no banco de dados.")
  
    return res.redirect("/")
  })
})


server.listen(3000, function() {
  console.log("Servidor Iniciado...")
})