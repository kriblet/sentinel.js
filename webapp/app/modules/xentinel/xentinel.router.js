/**
 * Created by Ben on 08/06/2017.
 */


((angular)=>{
    let app = angular.module('xentinel');
    app.config(['$routeProvider', ($routeProvider)=>{
        $routeProvider
            .when("/", {redirectTo: '/dashboard'})
            .otherwise({redirectTo:'/page-404'});
    }]);


})(angular);