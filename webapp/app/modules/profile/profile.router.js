/**
 * Created by Ben on 10/07/2017.
 */


((angular)=>{
    'use strict';

    angular.module('profile')
        .config(function($routeProvider) {
            $routeProvider
                .when("/profile", {
                    title: 'Mi perfil | x e n t i n e l . i o',
                    templateUrl : "app/modules/profile/profile.htm"
                });
        });

})(angular);