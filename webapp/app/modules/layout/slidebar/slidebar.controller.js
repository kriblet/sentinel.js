/**
 * Created by Ben on 10/07/2017.
 */


((angular)=>{
    'use strict';
    angular.module('layout')
        .controller('slidebarController',['$scope','$common','$dataService',function slidebarController($scope, $common, $dataService){

            $scope.initSlidebar = initSlidebar;
            $common.$timeout($scope.initSlidebar,100);

            function initSlidebar(){
                $.slidebars({
                    siteClose: true
                });
            }
        }])
})(angular);