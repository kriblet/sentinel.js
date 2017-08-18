/**
 * Created by Ben on 28/06/2017.
 */
((angular)=>{
    angular.module('dashboard')
        .controller("dashboardController",['$scope', '$common', ($scope, $common)=>{
            $common.$validate();

            $scope.initContentBox = contentBox;
            $scope.initOverlay = overlay;
            $scope.initWidgetsInit = widgetsInit;
            $scope.initLayout = layout;

            $scope.initContentBox();$scope.initOverlay();$scope.initLayout();

            Promise.all([
                $common.$loadScript("assets/widgets/charts/sparklines/sparklines-demo.js"),
                $common.$loadScript("assets/widgets/charts/piegage/piegage-demo.js"),
                $common.$loadScript("assets/widgets/charts/flot/flot-demo-1.js"),
                $common.$loadScript("assets/widgets/charts/piegage/piegage-demo.js")
            ]).then(()=>{

            }).catch((err)=>{
                console.error(err);
            });



            /* Initialization functions widgets and jQuery stuff. */
            function contentBox(){
                $('.switch-button').click(function(ev){

                    ev.preventDefault();

                    let switchParent = $(this).attr('switch-parent');
                    let switchTarget = $(this).attr('switch-target');

                    $(switchParent).slideToggle();
                    $(switchTarget).slideToggle();

                });

                /* Content Box Show/Hide Buttons */

                $('.hidden-button').hover(function(){

                    $(".btn-hide", this).fadeIn('fast');

                },function(){

                    $(".btn-hide", this).fadeOut('normal');

                });


                /* Content Box Toggle */

                $('.toggle-button').click(function(ev) {

                    ev.preventDefault();

                    $(".glyph-icon", this).toggleClass("icon-rotate-180");

                    $(this).parents(".content-box:first").find(".content-box-wrapper").slideToggle();

                });

                /* Content Box Remove */

                $('.remove-button').click(function(ev){

                    ev.preventDefault();

                    let animationEFFECT = $(this).attr('data-animation');

                    let animationTARGET = $(this).parents(".content-box:first");

                    $(animationTARGET).addClass('animated');
                    $(animationTARGET).addClass(animationEFFECT);

                    let wait = window.setTimeout( function(){
                            $(animationTARGET).slideUp()},
                        500
                    );

                    /* Demo show removed content box */

                    let wait2 = window.setTimeout( function(){
                            $(animationTARGET).removeClass(animationEFFECT).fadeIn()},
                        2500
                    );

                });

                /* Close Info Boxes */

                $(function() { "use strict";

                    $(".infobox-close").click(function(ev){

                        ev.preventDefault();

                        $(this).parent().fadeOut();

                    });


                });
            }

            function overlay(){

                /* Loader Show */

                $('.overlay-button').click(function(){

                    let loadertheme = $(this).attr('data-theme');
                    let loaderopacity = $(this).attr('data-opacity');
                    let loaderstyle = $(this).attr('data-style');


                    let loader = '<div id="loader-overlay" class="ui-front loader ui-widget-overlay ' + loadertheme + ' opacity-' + loaderopacity + '"><img src="../../assets/images/spinner/loader-' + loaderstyle + '.gif" alt="" /></div>';

                    if ( $('#loader-overlay').length ) {
                        $('#loader-overlay').remove();
                    }
                    $('body').append(loader);
                    $('#loader-overlay').fadeIn('fast');

                    //demo

                    setTimeout(function() {
                        $('#loader-overlay').fadeOut('fast');
                    }, 3000);

                });

                /* Refresh Box */

                $('.refresh-button').click(function(ev){

                    $('.glyph-icon', this).addClass('icon-spin');

                    ev.preventDefault();

                    let refreshParent = $(this).parents('.content-box');

                    let loaderTheme = $(this).attr('data-theme');
                    let loaderOpacity = $(this).attr('data-opacity');
                    let loaderStyle = $(this).attr('data-style');


                    let loader = '<div id="refresh-overlay" class="ui-front loader ui-widget-overlay ' + loaderTheme + ' opacity-' + loaderOpacity + '"><img src="../../assets/images/spinner/loader-' + loaderStyle + '.gif" alt="" /></div>';

                    if ( $('#refresh-overlay').length ) {
                        $('#refresh-overlay').remove();
                    }
                    $(refreshParent).append(loader);
                    $('#refresh-overlay').fadeIn('fast');

                    //DEMO

                    setTimeout(function() {
                        $('#refresh-overlay').fadeOut('fast');
                        $('.glyph-icon', this).removeClass('icon-spin');
                    }, 1500);

                });
            }

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

            function layout(){

                body_sizer();

                $("div[id='#fixed-sidebar']").on('click', function() {

                    if ($(this).hasClass("switch-on")) {
                        let windowHeight = $(window).height();
                        let headerHeight = $('#page-header').height();
                        let contentHeight = windowHeight - headerHeight;

                        $('#page-sidebar').css('height', contentHeight);
                        $('.scroll-sidebar').css('height', contentHeight);

                        $('.scroll-sidebar').slimscroll({
                            height: '100%',
                            color: 'rgba(155, 164, 169, 0.68)',
                            size: '6px'
                        });

                        let headerBg = $('#page-header').attr('class');
                        $('#header-logo').addClass(headerBg);

                    } else {
                        let windowHeight = $(document).height();
                        let headerHeight = $('#page-header').height();
                        let contentHeight = windowHeight - headerHeight;

                        $('#page-sidebar').css('height', contentHeight);
                        $('.scroll-sidebar').css('height', contentHeight);

                        $(".scroll-sidebar").slimScroll({
                            destroy: true
                        });

                        $('#header-logo').removeClass('bg-gradient-9');

                    }

                });


                $(window).on('resize', function() {
                    body_sizer();
                });

                function body_sizer() {

                    if ($('body').hasClass('fixed-sidebar')) {

                        let windowHeight = $(window).height();
                        let headerHeight = $('#page-header').height();
                        let contentHeight = windowHeight - headerHeight;

                        $('#page-sidebar').css('height', contentHeight);
                        $('.scroll-sidebar').css('height', contentHeight);
                        $('#page-content').css('min-height', contentHeight);

                    } else {

                        let windowHeight = $(document).height();
                        let headerHeight = $('#page-header').height();
                        let contentHeight = windowHeight - headerHeight;

                        $('#page-sidebar').css('height', contentHeight);
                        $('.scroll-sidebar').css('height', contentHeight);
                        $('#page-content').css('min-height', contentHeight);

                    }

                }

                function pageTransitions() {

                    let transitions = ['.pt-page-moveFromLeft', 'pt-page-moveFromRight', 'pt-page-moveFromTop', 'pt-page-moveFromBottom', 'pt-page-fade', 'pt-page-moveFromLeftFade', 'pt-page-moveFromRightFade', 'pt-page-moveFromTopFade', 'pt-page-moveFromBottomFade', 'pt-page-scaleUp', 'pt-page-scaleUpCenter', 'pt-page-flipInLeft', 'pt-page-flipInRight', 'pt-page-flipInBottom', 'pt-page-flipInTop', 'pt-page-rotatePullRight', 'pt-page-rotatePullLeft', 'pt-page-rotatePullTop', 'pt-page-rotatePullBottom', 'pt-page-rotateUnfoldLeft', 'pt-page-rotateUnfoldRight', 'pt-page-rotateUnfoldTop', 'pt-page-rotateUnfoldBottom'];
                    for (let i in transitions) {
                        let transition_name = transitions[i];
                        if ($('.add-transition').hasClass(transition_name)) {

                            $('.add-transition').addClass(transition_name + '-init page-transition');

                            setTimeout(function() {
                                $('.add-transition').removeClass(transition_name + ' ' + transition_name + '-init page-transition');
                            }, 1200);
                            return;
                        }
                    }

                }

                pageTransitions();

            }
        }])
})(angular);