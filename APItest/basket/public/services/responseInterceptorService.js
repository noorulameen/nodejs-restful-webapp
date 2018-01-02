'use strict';
app.factory('responseInterceptor', ['$q', '$location', function ($q, location) {
    var responseInterceptor = {
         request: function(config) {
            config.headers['Authorization'] = localStorage.getItem('token');
            return config;
        }
    };
    return responseInterceptor;
}]);
