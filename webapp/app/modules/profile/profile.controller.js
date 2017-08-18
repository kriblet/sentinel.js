/**
 * Created by Ben on 10/07/2017.
 */

((angular)=>{
    'use strict';
    angular.module('profile')
        .controller('profileController',['$scope','$common','$dataService','$select',function($scope, $common, $dataService, $select){
            $common.$validate();

            $scope.saveProfile = saveProfile;
            $scope.initTabs = initTabs;
            $scope.initProfile = initProfile;


            Promise.all([
                $common.$loadScript("assets/widgets/uniform/uniform-demo.js"),
                $common.$loadScript("assets/widgets/chosen/chosen-demo.js"),
                $common.$loadScript("assets/widgets/tabs/tabs.js")
            ]).then(()=>{
                $scope.$on('loginReady',initProfile);
                if ($common.$shared.user){
                    initProfile(null, $common.$shared.user);
                }
            }).catch((err)=>{
                console.error(err);
            });

            function initProfile(sender, user){
                $scope.initTabs();

                $scope.lastCountries = [];
                $scope.selectedCountry = null;
                $scope.selectedState = null;
                $scope.selectedCity = null;

                $scope.selectCountry = new $select({
                    selector: '#select-country',
                    placeholder: user.information.country.name.common || 'Buscar país',
                    model: 'countries',
                    success: function(data){
                        $scope.lastCountries = data;
                    },
                    change: function(val){
                        $scope.selectedCountry = val;
                    },
                    formatResult: function(e){
                        return e.data.name.common;
                    },
                    formatSelection: function(e){
                        return e.data.name.common;
                    }
                });
                $scope.selectState = new $select({
                    selector: '#select-state',
                    placeholder: user.information.state.name || 'Buscar estado',
                    model: 'states',
                    disabled: true,
                    filter: function(){
                        return {
                            country: $scope.selectedCountry
                        }
                    },
                    success: function(data){
                        $scope.lastStates = data;
                    },
                    change: function(val){
                        $scope.selectedState = val;
                    },
                    formatResult: function(e){
                        return e.data.name;
                    },
                    formatSelection: function(e){
                        return e.data.name;
                    }
                });
                $scope.selectCity = new $select({
                    selector: '#select-city',
                    placeholder: user.information.city.name || 'Buscar ciudad',
                    model: 'cities',
                    disabled: true,
                    filter: function(){
                        return {
                            state: $scope.selectedState
                        }
                    },
                    success: function(data){
                        $scope.lastCities = data;
                    },
                    change: function(val){
                        $scope.selectedCity = val;
                    },
                    formatResult: function(e){
                        return e.data.name;
                    },
                    formatSelection: function(e){
                        return e.data.name;
                    }
                });

                $scope.genre = $('#checkbox-genre');
                $scope.genre.bootstrapSwitch('state',user.information.male);
                $scope.genre.on('switchChange.bootstrapSwitch', function (event, state) {
                    $common.$shared.user.information.male = state;
                });

            }

            function initTabs() {
                $(function () {
                    "use strict";
                    $('.input-switch').bootstrapSwitch();

                    $('.textarea-autosize').autosize();

                    let Tab = function (element) {
                        this.element = $(element)
                    };

                    Tab.VERSION = '3.2.0';

                    Tab.prototype.show = function () {
                        let $this    = this.element;
                        let $ul      = $this.closest('ul:not(.dropdown-menu)');
                        let selector = $this.data('target');

                        if (!selector) {
                            selector = $this.attr('href');
                            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '');
                        }

                        if ($this.parent('li').hasClass('active')) return;

                        let previous = $ul.find('.active:last a')[0];
                        let e        = $.Event('show.bs.tab', {
                            relatedTarget: previous
                        });

                        $this.trigger(e);

                        if (e.isDefaultPrevented()) return;

                        let $target = $(selector);

                        this.activate($this.closest('li'), $ul);
                        this.activate($target, $target.parent(), function () {
                            $this.trigger({
                                type: 'shown.bs.tab',
                                relatedTarget: previous
                            })
                        })
                    };

                    Tab.prototype.activate = function (element, container, callback) {
                        let $active    = container.find('> .active');
                        let transition = callback
                            && $.support.transition
                            && (($active.length && $active.hasClass('fade')) || !!container.find('> .fade').length);

                        function next() {
                            $active
                                .removeClass('active')
                                .find('> .dropdown-menu > .active')
                                .removeClass('active');

                            element.addClass('active');

                            if (transition) {
                                element[0].offsetWidth ;
                                element.addClass('in');
                            } else {
                                element.removeClass('fade');
                            }

                            if (element.parent('.dropdown-menu')) {
                                element.closest('li.dropdown').addClass('active');
                            }

                            callback && callback();
                        }

                        $active.length && transition ?
                            $active
                                .one('bsTransitionEnd', next)
                                .emulateTransitionEnd(150) :
                            next();

                        $active.removeClass('in');
                    };


                    // TAB PLUGIN DEFINITION
                    // =====================

                    function Plugin(option) {
                        return this.each(function () {
                            let $this = $(this);
                            let data  = $this.data('bs.tab');

                            if (!data) $this.data('bs.tab', (data = new Tab(this)));
                            if (typeof option == 'string') data[option]();
                        })
                    }

                    let old = $.fn.tab;

                    $.fn.tab             = Plugin;
                    $.fn.tab.Constructor = Tab;


                    // TAB NO CONFLICT
                    // ===============

                    $.fn.tab.noConflict = function () {
                        $.fn.tab = old;
                        return this;
                    };


                    // TAB DATA-API
                    // ============

                    $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
                        e.preventDefault();
                        Plugin.call($(this), 'show');
                    })
                });
            }

            function saveProfile(){
                console.log("Saving profile");
            }
        }]);
})(angular);