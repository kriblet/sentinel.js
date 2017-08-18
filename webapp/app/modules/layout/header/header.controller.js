/**
 * Created by Ben on 10/07/2017.
 */


((angular)=>{
    'use strict';
    angular.module('layout')
        .controller('headerController',['$scope','$common', '$layoutService',function($scope, $common, $layoutService){

            $scope.toggleSlidebar =  $layoutService.slidebar.toggle;
            $scope.toggleSidebar = $layoutService.sidebar.toggle;

            $scope.initWidgetsInit = widgetsInit;

            $common.$timeout($scope.initWidgetsInit,100);

            function widgetsInit(){
                /* Prevent default on # hrefs */


                $('a[href="#"]').click(function(event) {
                    event.preventDefault();
                });

                /* To do check toggle */

                $(".todo-box li input").on('click', function() {
                    $(this).parent().toggleClass('todo-done');
                });

                /* Horizontal timeline */


                let overall_width = 0;

                $('.timeline-scroll .tl-row').each(function(index, elem) {
                    let $elem = $(elem);
                    overall_width += $elem.outerWidth() + parseInt($elem.css('margin-left'), 10) + parseInt($elem.css('margin-right'), 10);
                });

                $('.timeline-horizontal', this).width(overall_width);

                /* Input switch alternate */

                $('.input-switch-alt').simpleCheckbox();

                /* Slim scrollbar */

                $('.scrollable-slim').slimScroll({
                    color: '#8da0aa',
                    size: '10px',
                    alwaysVisible: true
                });

                $('.scrollable-slim-sidebar').slimScroll({
                    color: '#8da0aa',
                    size: '10px',
                    height: '100%',
                    alwaysVisible: true
                });

                $('.scrollable-slim-box').slimScroll({
                    color: '#8da0aa',
                    size: '6px',
                    alwaysVisible: false
                });

                /* Loading buttons */


                $('.loading-button').click(function() {
                    let btn = $(this)
                    btn.button('loading');
                });



                $('.tooltip-button').tooltip({
                    container: 'body'
                });


                /* Close response message */

                $('.alert-close-btn').click(function() {
                    $(this).parent().addClass('animated fadeOutDown');
                });

                /* Popovers */


                $('.popover-button').popover({
                    container: 'body',
                    html: true,
                    animation: true,
                    content: function() {
                        let dataID = $(this).attr('data-id');
                        return $(dataID).html();
                    }
                }).click(function(evt) {
                    evt.preventDefault();
                });


                $('.popover-button-default').popover({
                    container: 'body',
                    html: true,
                    animation: true
                }).click(function(evt) {
                    evt.preventDefault();
                });

                /* Color schemes */

                let mUIColors = {
                    'default':      '#3498db',
                    'gray':         '#d6dde2',
                    'primary':      '#00bca4',
                    'success':      '#2ecc71',
                    'warning':      '#e67e22',
                    'danger':       '#e74c3c',
                    'info':         '#3498db'
                };

                let getUIColor = function (name) {
                    if (mUIColors[name]) {
                        return mUIColors[name];
                    } else {
                        return mUIColors['default'];
                    }
                }

                /* Screenfull */

                if(document.getElementById('fullscreen-btn')) {
                    document.getElementById('fullscreen-btn').addEventListener('click', function () {
                        if (screenfull.enabled) {
                            screenfull.request();
                        }
                    });
                }

            }


        }]);
})(angular);