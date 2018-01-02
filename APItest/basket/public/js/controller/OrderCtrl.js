app.controller('OrderController', function($scope,$http, $location,$routeParams)
{
            var id = $routeParams.id;
           $scope.yourorder = '';
             $scope.totalitem = '';
            $scope.totalamount = '';
            $http({
            method: 'GET',
            url: 'http://localhost:3000/order/message/'+id,
            headers: {'Content-Type': 'application/json'},
        })
            .then(function(response) {
                if(response.data.status == 401){
                    $scope.errormsg= response.data.message
                }else{
                    $scope.userOrder = response.data.data.item;
                    $scope.totalitem = response.data.data.totalitem;
                    $scope.totalamount = response.data.data.totalamount;
                    $scope.yourorder = "your Order";
                }
           });


});
