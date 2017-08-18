/**
 * Created by Ben on 08/07/2017.
 */
((angular)=>{
    angular.module('dashboard').config(function($routeProvider) {
        $routeProvider
            .when("/dashboard", {
                title: 'Inicio | x e n t i n e l . i o',
                templateUrl : "app/modules/dashboard/dashboard.htm"
            });
    });
})(angular);