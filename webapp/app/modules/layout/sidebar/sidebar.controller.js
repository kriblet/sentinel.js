/**
 * Created by Ben on 10/07/2017.
 */
((angular)=>{
    'use strict';

    angular.module('xentinel')
        .controller('sidebarController',['$scope','$common',function($scope, $common){

            $scope.initSidebar = initSidebar;


            function initSidebar(){

// ADD SLIDEDOWN ANIMATION TO DROPDOWN //
                $('.dropdown').on('show.bs.dropdown', function(e){
                    $(this).find('.dropdown-menu').first().stop(true, true).slideDown();
                });

// ADD SLIDEUP ANIMATION TO DROPDOWN //
                $('.dropdown').on('hide.bs.dropdown', function(e){
                    $(this).find('.dropdown-menu').first().stop(true, true).slideUp();
                });

                /* Sidebar menu */

                $('#sidebar-menu').superclick({
                    animation: {
                        height: 'show'
                    },
                    animationOut: {
                        height: 'hide'
                    }
                });

                //automatically open the current path
                let path = window.location.pathname.split('/');
                path = path[path.length-1];
                if (path !== undefined) {
                    $("#sidebar-menu").find("a[href$='" + path + "']").addClass('sfActive');
                    $("#sidebar-menu").find("a[href$='" + path + "']").parents().eq(3).superclick('show');
                }


            }

        }])
})(angular);