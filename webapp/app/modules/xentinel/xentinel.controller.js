/**
 * Created by Ben on 28/06/2017.
 */
((angular)=>{
    angular.module('xentinel')
        .controller("mainController",['$scope', '$common', '$dataService', ($scope, $common, $dataService)=>{
            $scope.$shared = $common.$shared;

            $scope.redirect = (location, _blank, _ask)=>{
                if (!_blank && !_ask) {
                    $common.$location.path(location).search('userId',null).search('clientId',null).search('articleId', null).search('salieId', null);
                } else if(!_ask){
                    $common.$window.open($common.$location.$$absUrl.replace($common.$location.$$path, location), '_blank');
                } else{
                    bootbox.dialog({
                        message: "<h3 class='text-info text-center'>Usted está saliendo de la pantalla actual, todos los cambios se perderán</h3><h2 class='text-primary text-center'>¿Está seguro?</h2>",
                        buttons: {
                            success: {
                                label: "Cancelar",
                                className: "btn-default"
                            },
                            danger: {
                                label: "Si, Salir",
                                className: "btn-primary",
                                callback: function() {
                                    $common.$location.path(location).search('userId',null).search('clientId',null).search('articleId', null).search('salieId', null);
                                    $scope.$apply();
                                }
                            }
                        }
                    });
                }
            }


            $scope.user = null;

            $scope.$on('login',(sender, user)=>{
                $common.$shared.user = user;
                $scope.user = user;
                $common.$shared.status = $dataService.status;
                $scope.$broadcast('loginReady',user);
                try{ $scope.$apply()
                }catch(err){}
            });

            $common.$shared.status = $dataService.status;
            $dataService.on('disconnect',()=>{
                $common.$shared.status = $dataService.status;
                try{ $scope.$apply()
                }catch(err){}
            });

            $dataService.on('welcome',()=>{
                $common.$shared.status = $dataService.status;
                $scope.$apply();
            });
            $scope.logout = ()=>{
                delete $common.$shared.user;
                $common.$cookies.remove('lvs');
                $common.$location.path('login');
            }

        }]).filter('numberFixedLen', function () {
            return function (n, len) {
                let num = parseInt(n, 10);
                len = parseInt(len, 10);
                if (isNaN(num) || isNaN(len)) {
                    return n;
                }
                num = '$'+num;
                while (num.length < len) {
                    num = ' '+num;
                }
                return num;
            };
        }).directive('initFocus', function() {
            let timer;

            return function(scope, elm, attr) {
                if (timer) clearTimeout(timer);

                timer = setTimeout(function() {
                    elm.focus();
                    elm.select();
                }, 0);
            };
        })
})(angular);