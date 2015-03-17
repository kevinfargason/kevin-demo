var express = require('express')
var serveStatic = require('serve-static')
 
var app = express()
 
app.set('port', (process.env.PORT || 5000));
app.use(serveStatic('dist/', {'index': ['index.html']}));
app.listen(app.get('port'));