/**
 * Created by Ben on 08/06/2017.
 */


((angular)=>{
    let app = angular.module('xentinel',['ngRoute','ngCookies']);

    app.run(['$rootScope', '$route', '$window', '$location', function($rootScope, $route, $window, $location) {
        $rootScope.$on('$routeChangeSuccess', function() {
            $window.document.title = $route.current.title;

            // Set to default (show) state left and top menu, remove single page classes
            $('body').removeClass('single-page single-page-inverse');
            $rootScope.hideLeftMenu = true;
            $rootScope.hideTopMenu = true;
            $rootScope.hiddenLoader = false;

            // Firefox issue: scroll top when page load
            $('html, body').scrollTop(0);

            // Set active state menu after success change route
            $('.left-menu-list-active').removeClass('left-menu-list-active');
            $('nav.left-menu .left-menu-list-root .left-menu-link').each(function(){
                if ($(this).attr('href') == '#' + $location.path()) {
                    $(this).closest('.left-menu-list-root > li').addClass('left-menu-list-active');
                }
            });


        });
    }]);

    app.value("$shared",{
        serverStatus: 'Offline'
    });

})(angular);