var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated,function(req, res){
    perfumeSQL = 'SELECT * FROM Products'
	connection.query(perfumeSQL, function(err, rows, fields) {
		 if(err){
	           console.log("Error Selecting : %s ",err );
		 }
	            res.render('product/index',{page_title:"Perfume",data:rows});
	         });
});

router.get('/addperfume', ensureAuthenticated,function(req, res){
    console.log('test>>>');
	  res.render('product/add_perfume',{page_title:"Add Perfume"});
});


router.post('/insertperfume', ensureAuthenticated,function(req, res){
    data ={name: req.body.name,price:req.body.price}
    console.log('data>>>>',data);
    perfume_insert_SQL = "INSERT INTO Products set ? ";
		connection.query(perfume_insert_SQL,data,function(err, rows, fields) {
			 if(err){
		           console.log("Error Selecting : %s ",err );
			 }
			 res.redirect('/product');
		});
});

router.get('/editperfume', ensureAuthenticated,function(req, res){
	console.log(req.query.id);
	var id = req.query.id;
    perfume_edit_SQL = "SELECT * FROM Products WHERE id = ?";
	connection.query(perfume_edit_SQL,[id],function(err, rows, fields) {
		 if(err){
	           console.log("Error Selecting : %s ",err );
		 }
	            res.render('product/edit_perfume',{page_title:"Edit Perfume",data:rows});
	         });
});


router.post('/updateperfume', ensureAuthenticated,function(req, res){
	var id = req.body.id;
	data ={name: req.body.name,price:req.body.price}
    perfumes_update_SQL = "UPDATE Products set ? WHERE id = ? "
		connection.query(perfumes_update_SQL,[data,id],function(err, rows, fields) {
			 if(err){
		           console.log("Error Selecting : %s ",err );
			 }
			 //console.log(rows);
			 res.redirect('/product/');
		});
});

router.get('/delete', ensureAuthenticated,function(req, res){
	var id = req.query.id;
    perfumes_edit_SQL = "DELETE FROM Products  WHERE id = ?";
	connection.query(perfumes_edit_SQL,[id],function(err, rows, fields) {
		 if(err){
	           console.log("Error Selecting : %s ",err );
		 }
		 		res.redirect('/product/');
	         });
});


router.get('/search', ensureAuthenticated,function(req, res){
	var search_str = req.query.srch;
    perfumes_search_SQL = "SELECT * FROM Products WHERE name LIKE " + connection.escape('%'+search_str+'%') + "OR price LIKE " + connection.escape('%'+search_str+'%');
	connection.query(perfumes_search_SQL, function(err, rows, fields) {
			 if(err){
		           console.log("Error Selecting : %s ",err );
			 }
			 	res.render('product/index',{page_title:"Perfume",data:rows});
		     });
});


function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {    
		return next();
	} 
	res.redirect('/')
}

module.exports = router;
