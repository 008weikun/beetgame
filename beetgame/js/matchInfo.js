
$(function(){
    (function getRoomData(){
        var tonkenId='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0ODgzNDc4MzYsIm5iZiI6MTQ4ODM0NzgzNiwiZXhwIjoxNDg4OTUyNjM2LCJleHB0ZW1wIjoxNDg4MzUxNDM2LCJ1aWQiOjF9.BSl27AK1cuCUFy5KUYPHmOqBxPqvuzDjvCrWqRG6lxc',
        tpage= 1;
        $.ajax({
            type: "get",
            url: "http://api.beetgame.cn/fantasy/userplayingrooms",
            headers:{"Authorization":"Bearer "+tonkenId},
            dataType: "json",
            success: function (data) {
                renderRoom(data,$(".doing-match"));
                new JRoll("#doing", {scrollBarY:false}).refresh();//创建Jroll实例
            }
        });
        $.ajax({
            type: "get",
            url: "http://api.beetgame.cn/fantasy/userroomnotstart",
            headers:{"Authorization":"Bearer "+tonkenId},
            dataType: "json",
            success: function (data) {
                noStarted(data,$(".nodoing-match"));
                new JRoll("#notstart", {scrollBarY:false}).refresh();//创建Jroll实例
            }
        });
        function getEndData(page){
            $.ajax({
                type: "get",
                url: "http://api.beetgame.cn/fantasy/userroomover?page="+page,
                headers:{"Authorization":"Bearer "+tonkenId},
                dataType: "json",
                success: function (data) {
                    if(!data.data.length) return;
                    renderRoom(data,$(".ending-match"));
                    var jroll =new JRoll("#end", {scrollBarY:false}).refresh();//创建Jroll实例
                    jroll.on("scrollEnd", function() {
                        console.log("我被触发 我被触发")
                        if (this.y === this.maxScrollY) {
                            tpage++;
                            console.log(tpage);
                            getEndData(tpage);
                        }
                    })
                }
            });
        }
        getEndData(tpage);
    })()
    function renderRoom(matchNow,wrapParent){// 进行中，已结束房间信息
        roomTatal(matchNow,wrapParent);
        var imgCheck={
            "1":"../img/images/icon-b-y_03.png",
            "2":"../img/images/icon-b-y_07.png"
        }
        for(var i=0;i<matchNow.data.length;i++){
            var roomData=matchNow.data[i];
            var roomContent = wrapParent.find('.pogress-bar-wrap:first').clone();
            roomContent.find('.match-name').html(roomData.room_name);
            roomContent.attr("data-room",roomData.roomid);
            roomContent.find('.icon-font').attr('src',imgCheck[roomData.bonus_type]);
            roomContent.find('.thunbnail').attr('src',imgCheck[roomData.bonus_type]);
            roomContent.find('.reward').html(roomData.reward_rank_fan);
            roomContent.find('.now-rate').html(roomData.user_rank);
            roomContent.find('.programe-fair').html(roomData.join_cost);
            roomContent.find('.fan-val').html(roomData.user_fan);
            switch(roomData.bonus_type){
                case 1:
                    roomContent.find('.price-limit').html(roomData.silver_bonus);
                    break;
                case 2:
                    roomContent.find('.price-limit').html(roomData.cuprum_bonus);
                    break;
            }
            wrapParent.find('.scroller').append(roomContent);
            var $parent=roomContent.find(".progress-bar");
            var moveBar=matchNow.data[i];
            criticalPro($parent,moveBar.max_fan,moveBar.reward_rank_fan,moveBar.user_fan);
            roomContent.click(function(){
                console.log($(this).attr("data-room"));     //加上这句话
            })
        }
        if(!wrapParent.get(0).isRemoved){
            wrapParent.find('.pogress-bar-wrap:first').remove();
            wrapParent.get(0).isRemoved=!wrapParent.get(0).isRemoved;
        }
    }

    function noStarted(matchNow,wrapParent){       // 未进行
        roomTatal(matchNow,wrapParent);
        var imgCheck={
            "1":"../img/images/icon-b-y_03.png",
            "2":"../img/images/icon-b-y_07.png"
        }
        for(var i=0;i<matchNow.data.length;i++){
            var roomData=matchNow.data[i];
            var roomContent = wrapParent.find('.match-list:first').clone();
            roomContent.attr("roomID",roomData.roomid);
            roomContent.find('.list-up-title').html(roomData.room_name);
            roomContent.find('.active_player').html(roomData.user_count);
            roomContent.find('.activepay').html(roomData.join_cost);
            roomContent.find('.buns-type').attr('src',imgCheck[roomData.bonus_type]);
            roomContent.find('.active-time').html(roomData.start_time);
            switch(roomData.bonus_type){
                case 1:
                    roomContent.find('.price-pay').html(roomData.silver_bonus);
                    break;
                case 2:
                    roomContent.find('.price-pay').html(roomData.cuprum_bonus);
                    break;
            }
            wrapParent.find(".scroller").append(roomContent);
        }
        wrapParent.find('.match-list:first').remove();
    }
    //进度条数据
    function criticalPro(parens,maxpoint,nowpoint,userPoint){
        var bar=parens.find(".movebar");
        var indicato=parens.find(".indicato");
        var layer=parens.find(".layer-photo");
        var scale=nowpoint/maxpoint;
        var scaleP=userPoint/maxpoint;
        if(!scale) scale=0;
        if(!scaleP) scaleP=0;
        var fw=$('.father-bar').outerWidth();
        var targetW=fw-fw*scale;
        var targetX=fw*scale-indicato.outerWidth()/2;
        var targetZ=scaleP*fw-layer.outerWidth()/2;
        bar.css("width",targetW);
        indicato.css("transform","translateX("+targetX+"px)");
        layer.css("transform","translateX("+targetZ+"px)");
    }
    //页面奖金池部分数据渲染
    function roomTatal(data,p){
        var roomAdd= p.find(".price-tag").clone();
        roomAdd.find(".total-pay").html(data.total_user_cost);
        roomAdd.find(".expect").html(data.silver);
        roomAdd.find(".room_total").html(data.roominfo);
        roomAdd.find(".cuprum").html(data.cuprum);
        p.find('.scroller').append(roomAdd);
        if(!p.get(0).isRender){
            p.find(".price-tag:first").remove();
            p.get(0).isRender=true;
        }
    }

    $(".macth-title-info").click(function(){
        var activeNum=$(this).index();
        var barW=window.innerWidth/3;
        $(this).addClass("active-check").siblings().removeClass("active-check");
        $(".swiper-scrollbar-drag").css("transform","translateX("+barW*activeNum+"px)").css("transition",".5s");
        $(".swiper-scrollbar-drag").css("transform","translateX("+barW*activeNum+"px)").css("transition",".5s");
        $(".match-swiper-box").css("transform","translateX("+(-window.innerWidth*activeNum)+"px)").css("transition",".5s");
    })


})

