var router = require('express').Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

router.get('/', function(req, res) {
	res.redirect('/');
});

router.post('/', function(req, res) {
	var page = Page.build( {
		title: req.body.title,
		content: req.body.content
	});
	page.save().then(function(savedPage){
  		res.redirect(savedPage.route);
	}).catch(function(err) {throw err});
});

router.get('/add', function(req, res) {
	res.render('addpage');
});

router.get('/:title', function(req, res) {
	Page.findAll({
		where: {
			urlTitle: req.params.title
		}
	})
	.then(function(results){
		res.render('wikipage', {
			page: results[0].dataValues, 
		})
	})
})


module.exports = router;