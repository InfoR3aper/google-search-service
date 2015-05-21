var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');


app.use('/', express.static(__dirname + '/html'));


app.get('/search', function(req, res) {
	var query = req.query.q;
	var googleQuery = 'https://www.google.com/search?q=' + query;
	console.log(googleQuery)
	request(googleQuery, function(error, response, html) {
	    if (!error && response.statusCode == 200) {
	        var $ = cheerio.load(html);
	        var results = [];
	        $('#search .r a').each(function(){
	        	var href = $(this).attr('href').replace('/url?q=','').split('&');
	        	href = href[0];
	        	var resultsItem = {
	        		'title': $(this).text(),
	        		'href': $(this).attr('href')
	        	}
	        	results.push(resultsItem);
	        })
	        console.log(results)
	        res.json(results)
	    }
	    else{
	    	res.status(500).send(error+response.statusCode);
	    }
	});
});

app.listen(process.env.PORT || 3000);