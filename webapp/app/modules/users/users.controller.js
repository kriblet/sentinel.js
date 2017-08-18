/**
 * Created by Ben on 28/06/2017.
 */


((angular)=>{
    angular.module('users').controller('usersListController',['$scope','$common', '$dataService',($scope, $common, $dataService)=>{
        $scope.editUser = (_id)=>{
            $common.$location.path('users/create').search('userId', _id);
            $scope.$apply();
        };
        $scope.deleteUser = (_id)=>{
            _id = _id.replace('d-','');
            bootbox.dialog({
                message: "<h2 class='text-danger text-center'>Está a punto de borrar un usuario.</h2><h3 class='text-danger text-center'>¿Está seguro?</h3>",
                buttons: {
                    success: {
                        label: "Cancel",
                        className: "btn-default"
                    },
                    danger: {
                        label: "Yes, Delete!",
                        className: "btn-danger",
                        callback: function() {
                            $dataService.delete('users',{_id:_id})
                                .then((result)=>{
                                    if (result.isValid){
                                        let notice = new PNotify({
                                            type: 'info',
                                            title: 'Delete Successful',
                                            text: 'User has been deleted',
                                            icon: 'fa fa-trash',
                                            styling: 'fontawesome'
                                        });
                                    }
                                })
                                .catch((err)=>{
                                    console.log(err);
                                });
                        }
                    }
                }
            });
        };

        $dataService.on('remove-users',(user)=>{
            let removed = $scope.users.filter((o)=>{
                return o._id === user._id;
            });
            if (removed.length > 0){
                let index = $scope.users.indexOf(removed[0]);
                $scope.users.splice(index, 1);
                $scope.table.fnClearTable();
                if ( $scope.users.length > 0) {
                    $scope.table.fnAddData($scope.users);
                }
                $scope.table.fnDraw();
                $scope.setEvents();
            }
            $scope.$apply();
        });

        $dataService.on('save-users',(user)=>{
            $scope.users.push(user);

            $scope.table.fnClearTable();
            if ( $scope.users.length > 0) {
                $scope.table.fnAddData($scope.users);
            }
            $scope.table.fnDraw();
            $scope.setEvents();

            $scope.$apply();
        });

        $scope.setEvents = ()=>{

            $('.edit-button').unbind('click');
            $('.edit-button').click(function(e){
                e.stopPropagation();
                e.preventDefault();
                $scope.editUser(this.id.replace('e-',''));
            });
            $('.delete-button').unbind('click');
            $('.delete-button').click(function(e){
                e.stopPropagation();
                e.preventDefault();
                $scope.deleteUser(this.id.replace('e-',''));
            });
        };

        $scope.initTable = (data)=>{
            $scope.table = $('#example').dataTable({
                "language": {
                    "lengthMenu": "_MENU_",
                    "sProcessing": "Procesando...",
                    "sZeroRecords": "No se encontraron resultados",
                    "sEmptyTable": "Ningún dato disponible en esta tabla",
                    "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                    "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                    "sInfoPostFix": "",
                    "sSearch": "Buscar:",
                    "sUrl": "",
                    "sInfoThousands": ",",
                    "sLoadingRecords": "Cargando...",
                    "oPaginate": {
                        "sFirst": "Primero",
                        "sLast": "Último",
                        "sNext": "Siguiente",
                        "sPrevious": "Anterior"
                    },
                    "oAria": {
                        "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                    }
                },
                data: data,
                aoColumns: [
                    {"sTitle": "Nombre", "sClass": "header", "mDataProp": "name", "bSearchable": true},
                    {"sTitle": "Apellidos", "sClass": "header", "mDataProp": "lastName", "bSearchable": true},
                    {"sTitle": "Email", "sClass": "header", "mDataProp": "email", "bSearchable": true},
                    {  "sTitle": "Fecha", "sWidth": "100px", "sClass": "header", "mDataProp": "createdAt",
                        "render": function ( data, type, row ) {
                            // If display or filter data is requested, format the date
                            if ( type === 'display' || type === 'filter' ) {
                                return $common.$formatDate(new Date(data));
                            }
                            // Otherwise the data type requested (`type`) is type detection or
                            // sorting data, for which we want to use the raw date value, so just return
                            // that, unaltered
                            return data;
                        }


                    },
                    {
                        "sTitle": "<i class='fa fa-bolt'></i>",
                        "sType": "status-bar",
                        "sWidth": "100px",
                        "sClass": "header",
                        "mDataProp": "_id",
                        "mData": function(source, type, value){
                            let $edit = $("<div>", {id: `e-${source['_id']}`, "class": "btn btn-sm btn-default edit-button", html: '<i class="fa fa-pencil"></i>'});
                            let $delete = $("<div>", {id: `d-${source['_id']}`, "class": "btn btn-sm btn-default delete-button", html: '<i class="fa fa-trash"></i>'});
                            let $container = $("<div />");
                            $container.append($edit);
                            $container.append($delete);
                            return $container.html();
                        }
                    }
                ]
            });

            $scope.setEvents();
            $('.dataTables_filter input').attr('placeholder','Buscar...');
            //DOM Manipulation to move datatable elements integrate to panel
            $('.panel-ctrls').append($('.dataTables_filter').addClass("pull-right")).find("label").addClass("panel-ctrls-center");
            $('.panel-ctrls').append("<i class='separator'></i>");
            $('.panel-ctrls').append($('.dataTables_length').addClass("pull-left")).find("label").addClass("panel-ctrls-center");

            $('.panel-footer').append($(".dataTable+.row"));
            $('.dataTables_paginate>ul.pagination').addClass("pull-right m-n");
        };

        $scope.users = [];

        $dataService.find({
                model:'users',
                select: '-password',
                query: {active: true}
            })
            .then((result)=>{
                if (result.isValid){
                    $scope.users = result.data;
                    $scope.initTable($scope.users);
                }
                $scope.$apply();
            })
            .catch((err)=>{
                console.log(err);
            })


    }])
})(angular);