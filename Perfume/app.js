var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
var async = require('async');
var session = require('express-session');

//Database Connection Start from here
var mysql = require('mysql');
var DATABASE = 'basket';
var db_config = {
    user: 'root',
    password: 'password',
    host: 'localhost',
    port: '3306',
    database: DATABASE
};

function handleDisconnect() {
    connection = mysql.createConnection(db_config);

    connection.connect(function(err) {
        if (err) {
            console.log("Database Connection didnt happen because : ", err);
            setTimeout(handleDisconnect, 1000);
        }
    });


    // This handler is for when the connection is lost for some strange reason.
    // Now there is no reason to wait - just call handleDisconnect again -
    // but do this only when the error is Protocol Connection Lost. For any other
    connection.on('error', function(err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST')  {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}


handleDisconnect();
var routes = require('./routes/index');
var usersresource = require('./routes/users');
var product = require('./routes/product');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'keyboard cat',resave:true,saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', usersresource);
app.use('/product', product);

var users = [];
function findById(id, fn) {
    connection.query("select * from user where id='"+ id +"' limit 1", function(err,user) {
        fn(null, user[0]);
    });
}
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new LocalStrategy(function(username,password,done){
        connection.query("select * from user where username='"+username+"' limit 1", function(err,user) {
            console.log(user);

            if(err) {
                return done(err);
            }
            if(user.length == 0){
                return done(null,false,{message: 'Incorrect user name'});
            }
            if(user[0].password != password) {
                return done(null,false,{message: 'Incorrect password'});
            }
            return done(null,user[0]);
        });
    }
));
// Authentication End here



// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
module.exports = app;