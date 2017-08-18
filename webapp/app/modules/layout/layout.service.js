/**
 * Created by Ben on 10/07/2017.
 */


((angular)=>{
    'use strict';

    angular.module('layout')
        .service('$layoutService',[function layoutService(){
            let self = this;

            self.slidebar = {
                close: closeSlidebar,
                open: openSlidebar,
                toggle: toggleSlidebar
            };

            self.sidebar = {
                close: closeSidebar,
                open: openSidebar,
                toggle: toggleSidebar
            };
            function closeSidebar(){
                console.log("close sidebar");
            }
            function openSidebar(){
                console.log("open sidebar");
            }
            function toggleSidebar(){
                console.log("toggle sidebar");

                $('body').toggleClass('closed-sidebar');
                $('.glyph-icon.sidebar').toggleClass('icon-angle-right').toggleClass('icon-angle-left');
            }


            function closeSlidebar(_slidebar){
                $.slidebars.close(_slidebar);
            }
            function openSlidebar(_slidebar){
                $.slidebars.open(_slidebar);
            }
            function toggleSlidebar(_slidebar){
                $.slidebars.toggle(_slidebar);
            }


        }]);

})(angular);