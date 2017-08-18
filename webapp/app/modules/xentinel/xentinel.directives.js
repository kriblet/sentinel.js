/**
 * Created by Ben on 09/07/2017.
 */
((angular)=>{
    angular.module('xentinel').directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit(attr.onFinishRender);
                    });
                }
            }
        }
    }).directive("digitalClock",function($timeout,dateFilter){
        return function(scope,element,attrs) {

            element.addClass('text-center');

            scope.updateClock = function(){
                $timeout(function(){
                    element.text(dateFilter(new Date(), 'yyyy/MM/dd hh:mm:ss'));
                    scope.updateClock();
                },1000);
            };

            scope.updateClock();

        };
    }).directive('enterSubmit', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.enterSubmit);
                    });

                    event.preventDefault();
                }
            });
        };
    }).directive('leftMenu', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.on('click', '.left-menu-link', function() {

                    if (!$(this).closest('.left-menu-list-submenu').length) {
                        $('.left-menu-list-opened > a + ul').slideUp(200, function(){
                            $('.left-menu-list-opened').removeClass('left-menu-list-opened');
                        });
                    }

                });
            }
        };
    });
})(angular);