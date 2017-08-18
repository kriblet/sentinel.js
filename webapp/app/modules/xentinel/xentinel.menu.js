/**
 * Created by Ben on 08/07/2017.
 */


((angular)=>{
    let app = angular.module('xentinel');


    app.directive('leftMenu', function() {
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

    app.controller('leftMenuController',['$scope', ($scope)=>{
        $scope.leftMenuInit = leftMenuInit;


        function leftMenuInit(){
            $(function () {
                // CSS STYLING & ANIMATIONS
                let cssAnimationData = {
                        labels: ["S", "M", "T", "W", "T", "F", "S"],
                        series: [
                            [11, 14, 24, 16, 20, 16, 24]
                        ]
                    },
                    cssAnimationOptions = {
                        fullWidth: !0,
                        chartPadding: {
                            right: 2,
                            left: 30
                        },
                        axisY: {
                            position: 'end'
                        }
                    },
                    cssAnimationResponsiveOptions = [
                        [{
                            axisX: {
                                labelInterpolationFnc: function(value, index) {
                                    return index % 2 !== 0 ? !1 : value
                                }
                            }
                        }]
                    ];

                new Chartist.Line(".example-left-menu-chart", cssAnimationData, cssAnimationOptions, cssAnimationResponsiveOptions);

                /////////////////////////////////////////////////////////////////////////////
                // Slide toggle menu items on click

                $('.left-menu .left-menu-list-submenu > a').on('click', function(){
                    var accessDenied = $('body').hasClass('menu-top') && $(window).width() > 768;

                    if (!accessDenied) {
                        var that = $(this).parent(),
                            opened = $('.left-menu .left-menu-list-opened');

                        if (!that.hasClass('left-menu-list-opened') && !that.parent().closest('.left-menu-list-submenu').length)
                            opened.removeClass('left-menu-list-opened').find('> ul').slideUp(200);

                        that.toggleClass('left-menu-list-opened').find('> ul').slideToggle(200);
                    }
                });

                /////////////////////////////////////////////////////////////////////////////
                // Toggle menu on viewport < 768px

                $('.left-menu-toggle').on('click', function(){
                    $(this).toggleClass('active');
                    $('nav.left-menu').toggleClass('left-menu-showed');
                    $('.main-backdrop').toggleClass('main-backdrop-showed')
                });

                $('nav.left-menu a.left-menu-link').on('click', function(){
                    if (!$(this).parent().hasClass('left-menu-list-submenu')) {
                        $('.left-menu-toggle').removeClass('active');
                        $('nav.left-menu').removeClass('left-menu-showed');
                        $('.main-backdrop').removeClass('main-backdrop-showed')
                    }
                });


            });



        }
    }]);

    app.controller('topMenuController',['$scope',($scope)=>{
        $scope.topMenuInit = topMenuInit;

        function topMenuInit(){
            $(function () {
                let topMenuChart = $("#topMenuChart").peity("bar", {
                    fill: ['#01a8fe'],
                    height: 22,
                    width: 44
                });

                setInterval(function() {
                    let random = Math.round(Math.random() * 10);
                    let values = topMenuChart.text().split(",");
                    values.shift();
                    values.push(random);
                    topMenuChart.text(values.join(",")).change()
                }, 1000);

            });

            /////////////////////////////////////////////////////////////////////////////
            // Main menu scripts

            if (!$('body').hasClass('menu-top')) {
                if (!cleanUI.hasTouch) {
                    if (!cleanUI.hasTouch) {
                        $('nav.left-menu .scroll-pane').each(function() {
                            $(this).jScrollPane({
                                autoReinitialise: true,
                                autoReinitialiseDelay: 100
                            });
                            var api = $(this).data('jsp'),
                                throttleTimeout;
                            $(window).bind('resize', function() {
                                if (!throttleTimeout) {
                                    throttleTimeout = setTimeout(function() {
                                        api.reinitialise();
                                        throttleTimeout = null;
                                    }, 50);
                                }
                            });
                        });
                    }
                }
            }

            if ($('body').hasClass('menu-top')) {

                var translateSelector = $('nav.left-menu .left-menu-inner'),
                    startTranslateX = 0;

                translateSelector.addClass('scrolled-to-left');

                $(window).on('resize', function(){
                    startTranslateX = 0;
                    translateSelector.css('transform', 'translate3d(' + 0 + 'px, 0px, 0px)');
                });

                $('nav.left-menu').on('mousemove', function(e) {

                    if ($(window).width() > 751) {

                        console.log(e)

                        var menuWidth = $('nav.left-menu').width(),
                            windowWidth = $(window).width(),
                            boxedOffset = (windowWidth - menuWidth) / 2,
                            innerWidth = (function() {
                                var width = 0;
                                $('nav.left-menu .left-menu-list-root > *').each(function(){
                                    width += $(this).width();
                                });
                                return width;
                            })(),
                            logoWidth = $('nav.left-menu .logo-container').outerWidth(),
                            deltaWidth = menuWidth - logoWidth - innerWidth,
                            hoverOffset = 100;

                        if (deltaWidth < 0) {

                            if (e.clientX < windowWidth - menuWidth - boxedOffset + logoWidth + hoverOffset) {

                                if (startTranslateX < 0 || startTranslateX < deltaWidth) {

                                    startTranslateX = startTranslateX - deltaWidth;
                                    translateSelector
                                        .removeClass('scrolled-to-right')
                                        .addClass('scrolled-to-left')
                                        .css('transform', 'translate3d(' + startTranslateX + 'px, 0px, 0px)')

                                }

                            }

                            if (e.clientX > menuWidth + boxedOffset - hoverOffset) {

                                if (startTranslateX >= 0 || startTranslateX > deltaWidth) {

                                    startTranslateX = deltaWidth;
                                    translateSelector
                                        .removeClass('scrolled-to-left')
                                        .addClass('scrolled-to-right')
                                        .css('transform', 'translate3d(' + startTranslateX + 'px, 0px, 0px)')

                                }

                            }
                        }

                    }

                });

            }


        }
    }]);

})(angular);