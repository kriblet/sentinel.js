/**
 * Created by Ben on 10/07/2017.
 */


((angular)=>{
    'use strict';

    angular.module('profile',['data-service']);

    angular.module('xentinel').requires.push('profile');

})(angular);