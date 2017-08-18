/**
 * Created by Ben on 08/07/2017.
 */

((angular)=>{
    angular.module('dashboard',['data-service']);
    angular.module('xentinel').requires.push('dashboard');
})(angular);