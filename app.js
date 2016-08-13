var express = require('express');
var bodyParser = require('body-parser');
var swig = require('swig');
var morgan = require('morgan');
var models = require('./models');
var Page = models.Page;
var wikiRouter = require('./routes/wiki');

var app = express();

app.use(bodyParser());
app.use(morgan('dev'));
app.use('/wiki', wikiRouter);

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', swig.renderFile);
swig.setDefaults({cache: false});
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
	Page.findAll()
	.then(function(results) {
		var pages = [];
		results.forEach(function(page) {
			pages.push(page.dataValues);
		})
		res.render('index', {pages: pages});
	});
});


models.User.sync( {force: true} )
.then(function() {
	return models.Page.sync( {force: true} );
})
.then(function() {
	app.listen(3000, function() {
		console.log('Sever listening on port 3000');
	});
})
.catch(console.error);