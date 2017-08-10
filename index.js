const express    = require('express')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const handlebars = require('express-handlebars').create({defaultLayout: 'html'});

const hostServer = express()
const app        = express()

// form parser
app.use(bodyParser.urlencoded({ extended: false }))

// Handlebars
app.engine('handlebars', handlebars.engine)
hostServer.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')
hostServer.set('view engine', 'handlebars')

const dummyJSON = {
  type: "Dog",
  name: "Hamburger",
  age: 6,
}

const hostController = view => (_, response) =>
  response.render(view, {
    json: JSON.stringify(dummyJSON, null, 2),
    clientURL: "http://localhost:3000/client"
  })

const appController = (request, response) => {
  const body = JSON.stringify(
    JSON.parse(request.body.text),
    null, 2)
  console.info("I was posted to", body)
  const postData = {
    json: body,
  }
  response.render('app', postData)
}

// Host Routes
hostServer.get('/', hostController('host'))
hostServer.get('/2', hostController('host2'))

// App Routes
app.get('/client', (_, response) => response.render('app') )
app.post('/client', appController)

// Start the Servers
hostServer.listen(8000, () => console.log('Host Server listening on port 8000!') )
app.listen(3000, () => console.log('Example app listening on port 3000!') )

