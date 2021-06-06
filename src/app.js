const request = require('request')
const path = require('path') // core module so no need to install it from npm
const express = require('express')
const hbs = require('hbs') // for partials

//console.log(__dirname) // return the path of diroctory in which current file is located (upto src)
// /var/www/Personal_Projects/node_course_1/web-server/src
//console.log(__filename) // returns the complete path of current file (upto app.js)
// /var/www/Personal_Projects/node_course_1/web-server/src/app.js

const app = express() // this line creating new express application
//to set up ports of heroku or local
const port = process.env.PORT || 3000;

const publicDirPath = path.join(__dirname, '../public')

// template engines using handle bars to create dynamic html content
// by default there should be 'views' folder in the project directory where package.json lies. Here it is web-server folder
app.set('view engine','hbs')

//to change the name and path of views folder we need to define a path then set it as:
const viewsPath = path.join(__dirname, '../templates/views')
app.set('views', viewsPath)

// setting partials path
const partialsPath = path.join(__dirname, '../templates/partials')
hbs.registerPartials(partialsPath)

//this means whenever we hit localhost:3000 it should run this path
app.use(express.static(publicDirPath))

//creating a server
// app.get('', (req, res) => { // to run this use: localhost:3000 (defined in app.listen)
//     res.send('Hello world!') // to send something back to client or requester // on browser
// })

app.get('', (req, res)=>{
    res.render('index', { //to render .hbs views // first arguement: name of hbs view 2nd arg: dynamic values
        title: 'Weather App',
        name: 'Sultan'
    })
})

app.get('/about', (req, res)=>{
    res.render('about', {
        title: 'About Me',
        name: 'Sultan'
    })
})

app.get('/help', (req, res)=>{
    res.render('help', {
        title: 'Help',
        name: 'Sultan'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({ error: 'Address is missing!'})
    }
    const url = 'http://api.weatherstack.com/current?access_key=8bfcae9216b56729ca9606c760ebb0de&query='+req.query.address;

    request({ url: url, json: true}, (error, response)=>{
        if(error) return res.send(error)

        const data = response.body
        res.send(data)

    })
})

// if any other url types other than mention in routings we will diplay customize message instead of default can not get /path
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Sultan',
        errMsg: 'Page Not Found!'
    })
})

//start a server up

app.listen(port, () => {
    console.log('server is up on port ' + port) // not displayed to browser
})