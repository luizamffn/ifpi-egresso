var express = require('express')
var path = require('path')
var serveStatic = require('serve-static')
// const secure = require ('express-force-https')

var app = express()
// app.use (secure)
app.use(serveStatic(path.join(__dirname, 'dist')))
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/dist/index.html')
})

var port = process.env.PORT || 5000
app.listen(port)
console.log('server started ' + port)


// const express = require('express');
// const port = process.env.PORT || 8080
// const app = express()
//
// app.use(express.static(__dirname, 'dist'));
// app.get(/.*/, function (req, res) {
//     res.sendFile(__dirname + '/dist/index.html')
// })
//
// app.listen(port);
//
// console.log('server started ' + port)


// var express = require('express')
// var path = require('path')
// var serveStatic = require('serve-static')
//
// var app = express()
// app.use(serveStatic(path.join(__dirname, 'dist')))
//
// var port = process.env.PORT || 5000
// app.listen(port)
// console.log('server started ' + port)
