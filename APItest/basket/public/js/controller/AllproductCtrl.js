app.controller('AllproductController', function($scope,$http, $location)
{
    $scope.errorder ='';
            $http({
            method: 'GET',
            url: 'http://localhost:3000/data',
            headers: {'Content-Type': 'application/json'},
        }).then(function(response) {

            console.log('response>>>',response)
                if(response.data.status == 401){
                    $scope.errormsg= response.data.message
                }else{
                    $scope.userProduct = response.data.data;
                    for(var i in $scope.userProduct){
                        $scope.userProduct[i].selected = false;
                    }
                }
           });

            $scope.onOrder = function(){
                var order ={orderdata:$scope.userProduct};
                $http({
                    method: 'POST',
                    url: 'http://localhost:3000/storeorder',
                    headers: {'Content-Type': 'application/json'},
                    data: order
                }).then(function(response) {
                    console.log('response>>>',response);
                    if(response.data.status == 401){
                        $scope.errorder= response.data.message
                    }else{
                       $location.path('/order/'+response.data.orderid);
                    }
                });



            }
});
