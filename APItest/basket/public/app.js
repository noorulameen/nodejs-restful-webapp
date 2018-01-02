var app = angular.module("myuser",['ngRoute'])
    .config(['$routeProvider','$locationProvider','$httpProvider',function ($routeProvider,$locationProvider,$httpProvider) {
        $httpProvider.interceptors.push('responseInterceptor');
    $routeProvider
        .when('/',{
            templateUrl: 'view/allproduct/index.html',
            controller: 'AllproductController'
        })
        .when('/order/:id',{
            templateUrl: 'view/order/index.html',
            controller: 'OrderController'
        })
        .otherwise({redirectTo:'/login'});
    //$locationProvider.html5Mode(true);
    
}]);
