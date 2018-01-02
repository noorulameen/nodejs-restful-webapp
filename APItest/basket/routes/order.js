var express = require('express');
var router = express.Router();
var async = require('async');


/* GET home page. */
router.get('/message/:id',function(req, res){
    console.log('req.params.id>>',req.params.id);
    var result = {};
    var getdata = [];
    if(req.params.id != '' && !isNaN(req.params.id)){
        console.log('yes');
        perfumeSQL = 'SELECT ord.orderid,ord.amount,od.productid,od.price,od.quantity,pr.name FROM orders as ord inner join order_details od on(ord.orderid = od.orderid) inner join Products pr on(pr.id = od.productid) where ord.orderid='+req.params.id;
        connection.query(perfumeSQL, function(err, rows) {
            if(err){
                console.log("Error Selecting : %s ",err );
            }
            result.totalitem = rows.length;
            result.totalamount = rows[0].amount;

            rows.forEach(function (data) {
                console.log(rows.length,'data',data)
                getdata.push({name: data.name,price:data.price,quantity:data.quantity})
            });
            result.item =getdata ;

            res.send({data:result});
        });
    }else{
        res.send({status: 401, message:"no orderid!"});
    }
    /**/
});



router.post('/storeorder',function(req, res) {
    var dataObj = req.body.orderdata;
    //console.log('dataObj>>>',JSON.stringify(dataObj));
    var selectItem = [];
    var totalamt = 0;
    dataObj.forEach(function (ele) {
        if (ele.selected) {
            selectItem.push(ele)
            totalamt += (ele.price * ele.quentity)
        }
        ;
    });

    if (selectItem.length > 0) {
    var finaldata = {};
    var orderdetails = [];
    var orderId;
    async.waterfall([
        function (callback) {
            var order_insert_SQL = "INSERT INTO orders set ? ";
            connection.query(order_insert_SQL, {amount: totalamt}, function (err, rows) {
                if (err) {
                    console.log("Error Selecting : %s ", err);
                }
                orderId = rows.insertId;
                selectItem.forEach(function (data) {
                    orderdetails.push([rows.insertId, data.id, data.price, data.quentity])
                });
                callback(null, orderdetails,orderId);
            });

        },
        function (orderdetails,orderId, callback) {
            var order_details = "INSERT INTO order_details (orderid,productid,price,quantity) VALUES ? ";
            connection.query(order_details, [orderdetails], function (err, rows) {
                if (err) {
                    console.log("Error Selecting : %s ", err);
                }
                callback(null,orderId);
            });
        },

    ], function (err,orderId) { //This function gets called after the two tasks have called their "task callbacks"
        if (err) return next(err);
        console.log('orderId>>>',orderId)
        res.send({status: 200, message: 'orderupdated',orderid:orderId});

    });
}else{
        console.log('No order');
    res.send({status: 401, message: 'No order'});
}
});

module.exports = router;
