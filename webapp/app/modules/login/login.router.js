/**
 * Created by Ben on 28/06/2017.
 */


((angular)=>{
    angular.module('login').config(function($routeProvider) {
        $routeProvider
            .when("/login", {
                title: 'Login | x e n t i n e l . i o',
                templateUrl : "app/modules/login/login.htm"
            })
            .when("/terms", {
                templateUrl : "app/modules/pages/terms.htm"
            });
    });
})(angular);