const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

//homePageTemplate.hbs and aboutTemplate.hbs have the same footer info.
//This footer info can be separate into a partail hbs file and can be reused
//We do following to use partials in hbs
hbs.registerPartials(__dirname + '/views/partials')


//Following is needed to use templates and Handlebars (hbs). hbs package is a wrapper on top of the actual handlebars package.
//Express looks for templates by default in a directory called views
app.set('view_engine', 'hbs');

//below we are registering another middleware where we take three input objects. next() is awesome.
// Once a request comes in you HAVE to call next() for the application to proceed further.
// If you dont then none of the actual website routes will ever get fired. i.e. locahost:3000 in the browser will never load home page
app.use((request, response, next) => {
  var now = new Date().toString();
  var log = `${now}:${request.method} ${request.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (error) => {
    if (error) {
      console.log('Couldnt append to log file');
    }
  });
  // console.log(request);
  next();
});

//If following code is enabled then the website (localhost:3000) will render the maintenance page and will not move forward
// app.use((request, response, next) => {
//   response.render('maintenanceTemplate.hbs');
// });


//When localhost:3000/help.html is called in browser following route is fired on webserver.
//Essentially it renders public/help.html on the browser
// __dirname = path uptill nodewebserver directory
//app.use is to be used to register Express middleware. Below we are registering the static middleware
app.use(express.static(__dirname + '/public'));


//currentYear can be added to partial as a helper function which will execute when the page is called/loaded

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

//helper functions can take input arguments
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase()
});

//When localhost:3000 is called in browser following route is fired on webserver
app.get('/', (request, response) => {

response.render('homePageTemplate.hbs', {
  pageTitle: 'Home Page',
  welcomeMessage: 'Welcome to our beloved website (csbasics.com) home page!!! :)'
  //currentYear: new Date().getFullYear()
});

  // response.send('<h1>Hello Express!!!<h1>');
  // response.send({
  //   name: 'Salil',
  //   likes: [
  //     'PingPong',
  //     'Cricket',
  //     'Tennis'
  //   ]
  // })
});

//When localhost:3000/about is called in browser following route is fired on webserver
app.get('/about', (request, response) => {
  // response.send('<h1>About Page:<h1>');
  //following is to render html pages with dynamic data based on templates and hbs usage
  response.render('aboutTemplate.hbs', {
    pageTitle: 'About Page'
    //currentYear: new Date().getFullYear()
  });
});

//When localhost:3000/bad is called in browser following route is fired on webserver
app.get('/bad', (request, response) => {
  response.send({
    errorNo: 999,
    errorMessage: 'Bad Page Request'
  })
});

app.listen(3000, () =>  {
  console.log('Server is up on port 3000');
});
