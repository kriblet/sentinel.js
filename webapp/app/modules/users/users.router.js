/**
 * Created by Ben on 28/06/2017.
 */


((angular)=>{
    angular.module('users').config(function($routeProvider) {
        $routeProvider
            .when("/users", {
                title: 'Usuarios | x e n t i n e l . i o',
                templateUrl : "app/modules/users/users.htm"
            })
            .when("/users/create", {
                title: 'Crear usuario | x e n t i n e l . i o',
                templateUrl : "app/modules/users/user.htm"
            });
    });
})(angular);