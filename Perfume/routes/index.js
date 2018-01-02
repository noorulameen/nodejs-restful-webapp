var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',function(req, res){
    perfumeSQL = 'SELECT * FROM Products'
	connection.query(perfumeSQL, function(err, rows, fields) {
		 if(err){
	           console.log("Error Selecting : %s ",err );
		 }
	            res.render('index',{page_title:"Perfume",data:rows});
	         });
});


router.get('/search', ensureAuthenticated,function(req, res){
	var search_str = req.query.srch;
    perfumes_search_SQL = "SELECT * FROM Products WHERE name LIKE " + connection.escape('%'+search_str+'%') + "OR price LIKE " + connection.escape('%'+search_str+'%');
	connection.query(perfumes_search_SQL, function(err, rows, fields) {
			 if(err){
		           console.log("Error Selecting : %s ",err );
			 }
			 	res.render('index',{page_title:"Perfume",data:rows});
		     });
});


function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/')
}

module.exports = router;
