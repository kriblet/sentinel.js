/**
 * Created by Ben on 28/06/2017.
 */

((angular)=>{
    'use strict';
    angular.module('login')
        .controller('loginController',['$scope','$common','$dataService',($scope, $common, $dataService)=>{
            if ($common.$shared.user){
                return $common.$location.path('');
            }

            $scope.user = {
            };

            $scope.init = init;
            $scope.login = login;


            $scope.init();

            function login(){
                if(!$scope.user.username || !$scope.user.password){
                    return;
                }
                $scope.status = null;
                $dataService.login($scope.user, (response)=> {
                    if (response.isValid) {
                        let expireDate = new Date();
                        expireDate.setDate(expireDate.getDate() + 1);
                        $common.$cookies.put('lxs', response.session.token, {expires: expireDate, path: '/'});
                        $scope.$broadcast('login', response.user);
                        $scope.$emit('login', response.user);
                        $common.$location.path('');
                    } else {
                        $scope.status = response.error;
                    }
                    if(!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            }

            function init(){

            }
        }]);

})(angular);