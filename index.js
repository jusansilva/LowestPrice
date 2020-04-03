var express = require('express');
var app = express();
const storange = require('./storanger/data.json');
const fs = require('fs');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');

app.set('view engine', 'ejs')     // Setamos que nossa engine será o ejs
app.use(expressLayouts)           // Definimos que vamos utilizar o express-ejs-layouts na nossa aplicação
//Rota inicial
app.get('/', (req, res) => {
  param = storange.reduce((init, city) => {
    init.push(city.to)
    init.push(city.from)

    return init
  }, [])

  params = param.filter((city, i) => {
    return param.indexOf(city) === i;
  })
  res.render(__dirname + '/views/home', { params , sucess: false});
});

//Rota para calculo de menor preço
app.get('/quote/:to/:from', (req, res) => {
  res.send(findRoute(req.params.to.toString(), req.params.from.toString()))
});

//registrar novas rotas
app.post('/register', (req, res) => {
  let param = {
    from: req.params.from,
    to: req.params.to,
    price: req.params.price
  }

  let data = JSON.stringify(param, null, 2);
  if(fs.writeFileSync(storange, data)){
    res.redirect('/', {sucess: "arquivo salvo com sucesso"})
  }
  
});

app.listen(3000, function () {
  console.log('Servidor funcinando na porta 3000!');
});

var findRoute = (from, to) => {
  //todos os destinos selecionado igual ao destino
  const onlyTo = storange.filter(travel => travel.to === to || travel.from === to)
  //Todas as origens que é igual a origem selecionada
  const onlyFrom = storange.filter(travel => travel.from === from || travel.to === from)


  let oneDistine = []
  onlyTo.filter((to) => {
    onlyFrom.filter((from) => {
      if (to.from == from.from && to.to === from.to) {
        oneDistine.push(to);
      }
    })
    return oneDistine;
  });


//primeiro nivel
// se A.destino === to && 
let firstLevel = []
onlyTo.filter(travel => {
  onlyFrom.forEach(el => {
    if(travel.to === to && (travel.from === el.from || travel.from === el.to) 
    || travel.from === to && (travel.to === el.from || travel.to === el.to))
    {
      firstLevel.push(travel, el)
    }
    return firstLevel
  });
})






  const paralelomach = onlyTo.reduce((init, to) => {
    onlyFrom.filter((from) => {
      if (to.from == from.to || to.to === from.from) {
        init.push(from, to)
      }
    })
    return init
  }, [])

  const twoDistine = firstLevel.reduce((init, travel) => {

    if (!(travel.from === from && travel.to === to)) {
      if (travel.from === from || travel.to == to)
        init.push(travel)
    }

    return init
  }, [])

return twoDistine;
  const someTwo = twoDistine.reduce((init, travel) => {
    return init + travel.price;
  }, 0)

  if (someTwo > oneDistine.price) {
    return oneDistine;
  } else {
    return twoDistine;
  }
};


