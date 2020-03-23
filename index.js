var express = require('express');
var app = express();
var storange = require('./storanger/data.json');
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')

app.set('view engine', 'ejs')     // Setamos que nossa engine será o ejs
app.use(expressLayouts)           // Definimos que vamos utilizar o express-ejs-layouts na nossa aplicação
//Rota inicial
app.get('/', (req, res) => {
  res.render(__dirname + '/views/home', {params : storange});
});

//Rota para calculo de menor preço
app.get('/quote/:to/:from', (req, res) => {
  res.send(findRoute(req.params.to, req.params.from))
});

app.post('/register', (req, res) => {

});

app.listen(3000, function () {
  console.log('Servidor funcinando na porta 3000!');
});

var somaPrice = (x) => {
  function param(y, z) {
    return y + z;
  }

}

var findRoute = (from, to) => {
  var min = 0;
  var oneDistine;
  var onePrice;
  var twoDistine = [];
  var twoPrice;
  var threeDistine = [];
  var threePrice;
  var arrayTo = storange.filter(function (value) {
    let obj = Object.values(value)
    if (obj.indexOf("GRU") > -1) {
      return value
    }
  })
  var arrayFrom = storange.filter(function (value) {
    let obj = Object.values(value)
    if (obj.indexOf("CDG") > -1) {
      return value
    }
  })
  arrayTo.forEach(elTo => {
    arrayFrom.forEach(elfrom => {
      if (elTo.to === elfrom.to && elTo.from === elfrom.from) {
        oneDistine = elTo
      }
      if (elTo.from != "GRU" && elfrom.to != "CDG" && elTo.from === elfrom.to) {
        twoDistine.push(elTo, elfrom)
      }
      if (elTo.to != "GRU" && elfrom.from != "CDG" && elTo.to === elfrom.from) {
        threeDistine.push(elTo, elfrom)
      }
    });
  });

  if (!isEmpty(oneDistine)) {
    onePrice = Object.keys(oneDistine).indexOf(1) > -1 ? oneDistine.reduce((total, valor) => total + valor.price, 0) : oneDistine.price;
    min = onePrice
  }
  if (!isEmpty(twoDistine)) {
    twoPrice = Object.keys(twoDistine).indexOf(1) ? twoDistine.reduce((total, valor) => total + valor.price, 0) : twoDistine.price;
    if (onePrice && onePrice > twoPrice) {
      min = twoPrice
    } else {
      min = onePrice
    }
  }
  if (!isEmpty(threeDistine)) {
    threePrice = Object.keys(threeDistine).indexOf(1) ? threeDistine.reduce((total, valor) => total + valor.price, 0) : threeDistine.price;
    if (min > threePrice || min === 0) {
      min = threePrice
    }
  }


  if(onePrice == min){
    return oneDistine
  }

  if(twoPrice == min){
    return twoDistine
  }

  if(threePrice == min){
    return threeDistine;
  }

  console.log(min);
  // return {"preco1": onePrice, "preco2": twoPrice, "preco3": threePrice};
  return { "oneD": oneDistine, "twoD": twoDistine, "threeD": threeDistine };
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}