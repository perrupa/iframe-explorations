const express    = require('express')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const handlebars = require('express-handlebars').create({defaultLayout: 'html'});

const hostServer = express()
const appClient  = express()

// form parser
appClient.use(bodyParser.urlencoded({ extended: false }))

// Handlebars
appClient.engine('handlebars', handlebars.engine)
hostServer.engine('handlebars', handlebars.engine)
appClient.set('view engine', 'handlebars')
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
hostServer.get('/3', hostController('host3'))

// appClient Routes
appClient.get('/client', (_, response) => response.render('app') )
appClient.post('/client', appController)

// Start the Servers
hostServer.listen(8000, () => console.log('Host Server running on http://localhost:8000/') )
appClient.listen(3000, () => console.log('Example appClient running on http://localhost:3000/client') )

