var express = require('express');
var app = express();

//Rota inicial
app.get('/', (req, res) => {
     res.send('Hello World!');
});

//Rota para calculo de menor preço
app.get('/quote/{to}/{from}', (req, res) => {

});

app.post('/register', (req, res) => {

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
