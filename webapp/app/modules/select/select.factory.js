/**
 * Created by Ben on 28/06/2017.
 */

((angular)=>{

    angular.module('select')
        .factory('$select', ['$dataService',function($dataService){
            return function(args){
                if (!args.selector){
                    throw new Error('selector parameter is not defined');
                }
                if (!args.model){
                    throw new Error('model parameter is not defined');
                }
                let selector = $(args.selector);
                selector.select2({
                    placeholder: args.placeholder || 'buscar',
                    minimumInputLength:  args.minimumInputLength || 3,
                    width: '100%',
                    allowClear: args.allowClear || false,
                    formatNoMatches: function () { return "No se encontraron resultados"; },
                    formatInputTooShort: function (input, min) { let n = min - input.length; return "Introduzca " + n + " letra" + (n == 1? "" : "s") + " porfavor"; },
                    formatInputTooLong: function (input, max) { let n = input.length - max; return "Borre " + n + " letra" + (n == 1? "" : "s"); },
                    formatSelectionTooBig: function (limit) { return "Solo puede seleccionar " + limit + " item" + (limit == 1 ? "" : "s"); },
                    formatLoadMore: function (pageNumber) { return "<i class='fa fa-spinner fa-spin'></i>"; },
                    formatSearching: function () { return "<i class='fa fa-spinner fa-spin'></i>"; },
                    query: function(query){
                        if (query.term !== ''){
                            let data = {
                                results: []
                            };

                            $dataService.autocomplete({
                                model: args.model,
                                query: query.term,
                                filter: args.filter ? args.filter() : null
                            })
                                .then((result)=>{
                                    if (result.isValid){
                                        if (args.success){args.success(result.data);}
                                        result.data.forEach((item)=>{
                                            data.results.push({id:item._id,data:item})
                                        });
                                    }
                                    query.callback(data);
                                })
                                .catch((err)=>{
                                    console.error(err);
                                    query.callback(data);
                                })
                        }
                    },
                    formatResult: args.formatResult || function(e){return e.name || e.description;},
                    formatSelection: args.formatSelection || function(e){return e.name || e.description;},
                    escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in results
                });

                selector.on('change', function () {
                    if (args.change) args.change(selector.val());
                });

                if (args.disabled){
                    selector.prop("disabled", true);
                }
                return {
                    val: selector.val(),
                    disable: function(){
                        selector.prop("disabled", true);
                    },
                    enable: function(){
                        selector.prop("disabled", false);
                    }
                }
            }


        }]);

})(angular);