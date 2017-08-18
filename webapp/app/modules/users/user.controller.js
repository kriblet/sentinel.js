/**
 * Created by Ben on 28/06/2017.
 */


((angular)=>{
    'use strict';
    angular.module('users').controller('userController',['$scope','$common', '$dataService',($scope, $common, $dataService)=>{
        $common.$validate();
        $common.$rootScope.hiddenLoader = true;
        $scope.newUser = {};

        $scope.saveUser = saveUser;
        $scope.initUserCreate = initUserCreate;

        if ($common.$location.search().userId){
            let userId = $common.$location.search().userId;
            $dataService.findById({model:'users', query:userId, select: '-password -createdAt -__v -updatedAt'})
                .then((response)=>{
                console.log("response", response);
                    if (response.isValid){
                        $scope.newUser = response.data;
                        $scope.editing = true;
                        $scope.$apply();
                    }

                })
                .catch((err)=>{
                    console.log(err);
                })
        }

        function saveUser(){

            $scope.status = null;
            $scope.result = null;
            $scope.saving = true;
            if (!$scope.editing) {
                $dataService.save('users', $scope.newUser)
                    .then((result) => {
                        $scope.saving = false;
                        if (result.isValid) {
                            $scope.result = 'Bien Hecho. El usuario ha sido registrado correctamente';
                        } else {
                            if (result.error.code === 11000) {
                                $scope.status = 'Usuario ya registrado';
                            } else {
                                $scope.status = result.error;
                            }
                        }
                        $scope.$apply();
                    })
                    .catch((err) => {
                        $scope.saving = false;
                        $scope.status = err.message;
                        $scope.$apply();
                    })
            }else{
                $dataService.update('users', $scope.newUser)
                    .then((result) => {
                        $scope.saving = false;
                        if (result.isValid) {
                            $scope.result = 'Bien Hecho. El usuario ha sido registrado correctamente, redirección en 3 segundos';
                            let total = 3;
                            $scope.editing = false;
                            $common.$interval(()=>{
                                total--;
                                $scope.result = 'Bien Hecho. El usuario ha sido registrado correctamente, redirección en '+total+' segundos';
                            },1000);
                            $common.$timeout(()=>{
                                $common.$location.url($common.$location.path());
                            },3000);
                        } else {
                            $scope.status = result.error;
                        }
                        $scope.$apply();
                    })
                    .catch((err) => {
                        $scope.saving = false;
                        $scope.status = err.message;
                        $scope.$apply();
                    })
            }
        }
    }])
})(angular);