/**
 * Created by Ben on 28/06/2017.
 */
((angular)=>{
    angular.module('login',['data-service']);
    angular.module('xentinel').requires.push('login');
})(angular);