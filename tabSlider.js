/**
 * author:王星
 * date:2018/1/22
 */
function init(config) {
    var startX,startY,presentX,presentY,endX,endY,dir,counter=0;
    var qwidth=$('.'+config.container)[0].offsetWidth; //容器宽度
    var tabs=$(".tab");
    var tabbar=$(".tabbar")[0];
    var contentContainer=$('.content-container')[0];
    var activeLine=$('.active-line')[0];
    var tabNum=calculate(); //tab栏展示几个tab选项，根据grids-*计算得出
    var tabLong=qwidth/tabNum;
    initWidth();
    tabs.click(function () {
        tabs.removeClass('active');
        $(this).addClass('active');
        var index=$(this).attr('data-index');
        $(".inner").addClass('animate');
        setTimeout(function () {
            $(".inner").removeClass('animate');
        },500)
        move(activeLine,(index-1)*tabLong,0.5);
        move(contentContainer,-(index-1)*qwidth,0.5);
        moveTab(index,0.5);
        //用户设置了回调函数
        if(config.callback){
            config.callback(index);
        }
    });
    setDefault();
    tabFixed(0);
    //绑定触摸事件
    $(".content-container").on({
        touchstart:function (e) {
            dir=0;
            startX=e.originalEvent.touches[0].pageX;
            startY=e.originalEvent.touches[0].pageY;
        },
        touchmove:function (event) {
            var index=$('.active').attr('data-index');
            var presentX=event.originalEvent.touches[0].pageX;
            var presentY=event.originalEvent.touches[0].pageY;
            if(dir==0){
                direction(startX,startY,presentX,presentY);
            }
            if(dir==1){
                event.preventDefault();
                var distance=presentX-startX;
                move(contentContainer,-(index-1)*qwidth+distance,0);
                move(activeLine,(index-1)*tabLong-distance/tabNum,0);
            }
            if($(window).scrollTop()>=300){
                //alert(1);
                $(".content").css({
                    'overflow-y': 'scroll'
                });
            }else{
                $(".content").css({
                    'overflow-y': 'hidden'
                });
            }


        },
        touchend:function (e) {
            if(dir==1){
                endX=e.originalEvent.changedTouches[0].pageX;
                var index=$('.active').attr('data-index');
                if(Math.abs(endX-startX)<qwidth/6){
                    move(contentContainer,-(index-1)*qwidth,0.5);
                    move(activeLine,(index-1)*tabLong,0.5);
                }else if(endX-startX>0){
                    if(index==1){
                        move(contentContainer,-(index-1)*qwidth,0.5);
                        move(activeLine,(index-1)*tabLong,0.5);
                    }else{
                        $(".active").prev(".tab").click();
                    }
                }else if(endX-startX<0){
                    if(index==$(".tab").length){
                        move(contentContainer,-(index-1)*qwidth,0.5);
                        move(activeLine,(index-1)*tabLong,0.5);
                    }else{
                        $(".active").next(".tab").click();
                    }
                }
            }
        }
    });
    /****************
     * @method tabFixed:tab栏移动到顶端fix在顶部
     * @param none
     * @return none
     * ****************/
    function tabFixed(fixedTop) {
        var whight=screen.availHeight;
        var tabbarHeight=$(".item-contianer").css('height');
        $(".content").css({
            'height':(whight-parseInt(tabbarHeight))+'px'
        });
        var tabbar=$(".scoll-fixed");
        var tabbarTop = tabbar.offset().top ;
        tabbarStyle = new Array;
        tabbarStyle[0] = tabbar.css("position"),
        tabbarStyle[1] = tabbar.css("top"),
        tabbarStyle[2] = tabbar.css("zindex");

        $(window).scroll(function (e) {
            if($(window).scrollTop() >tabbarTop-fixedTop ){
                tabbar.css({
                    position: "fixed",
                    top: fixedTop + "px",
                    "z-index": 999
                });
                $('.outer').css({
                    'margin-top':tabbarHeight
                });

            }else{
                tabbar.css({
                    position: tabbarStyle[0],
                    top: tabbarStyle[1],
                    "z-index": tabbarStyle[2]
                });
                $('.outer').css({
                    'margin-top':'0px'
                });
            }
        })

        
    }

    /****************
     * @method direction:判断滑动方向
     * @param none
     * @return none
     *******************/
    function direction(sx,sy,ex,ey) {
        if(Math.abs(Math.abs(ex-sx)-Math.abs(ey-sy))<10){
            dir=0;//没有滑动
        }else if(Math.abs(ex-sx)>Math.abs(ey-sy)){
            dir=1;//左右滑动
        }else{
            dir=-1;//上下滑动
        }
    }

     /****************
     * @method initWidth:动态设置宽度
     * @param none
     * @return none
     *******************/
    function initWidth() {
        var contents=$('.content');
        contentContainer.style.width=parseInt(contents.length)*qwidth+'px';
        contentContainer.style.overflow='hidden';
        for(var i=0;i<contents.length;i++){
            contents[i].style.width=qwidth+'px';
        }
    }

   /****************
     * @method setDefault:设置默认显示的tab页
     * @param index:用户配置默认的tab页序号
     * @return none
     *******************/
    function setDefault() {
        var index=$('.active').attr('data-index');
        move(activeLine,(index-1)*(qwidth/calculate()),0);
        move(contentContainer,-(index-1)*qwidth,0);
        moveTab(index,0);
    }

    /****************
     * @method moveTab:移动tab栏
     * @param index:当前选中项序号，qwidth:容器宽度
     * @return
     *******************/
    function moveTab(index,time) {
        var allNum=tabs.length;
        //中间位
        var middle=Math.ceil(tabNum/2);
        //需要位移单位
        var need=index-middle;
        if(index==2){
            move(tabbar,0,time);
        }else if(index==(allNum-1)){
            move(tabbar,-tabLong*(allNum-tabNum),time);
        }else if(index==1 || index==allNum){   //不用移动tab栏的情况
            return;
        }else{
            move(tabbar,need*(-tabLong),time);  //移动tab栏
        }
        //奇数偶数条件不一致，这里处理一下
        function odd() {
            if(tabNum%2 ==0){
                return allNum-middle;
            }else{
                return allNum-middle+1;
            }
        }
    }

    /**
     * 计算展示几个tab
     * @method calculate
     * @param none
     * @return {int} 屏幕中展现的tab个数
     */
    function calculate () {
        var str=tabs[0].getAttribute("class");
        var classList=str.split(' ');
        for(var i=0;i<classList.length;i++){
            if(classList[i].indexOf('grids-')==-1){
                continue;
            }else{
                return parseInt(classList[i].split('-')[1]);
            }
        }
    }

    /**
     * 执行动画切换
     * @method move
     * @param {object} obj 执行动画的元素，leftOption 目标位置的X坐标
     * @return {int} 屏幕中展现的tab个数
     */
    function move(obj,leftOption,time) {
        obj.style.webkitTransition='all '+time+'s ease-in-out';
        obj.style.transition='all '+time+'s ease-in-out';
        obj.style.webkitTransform='translate('+leftOption+'px,0)';
        obj.style.transform='translate('+leftOption+',0)px';
    }
}






