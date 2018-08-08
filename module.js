/**
 * Created by LinFF on 2017/5/6.
 */
(function($){
    'use strict';

    var ModuleName = 'st_lnht';

    var Module = function(elem,options){
        this.elem = $(elem);
        this.childMax = options.childMax;
        this.inputParent = options.inputParent;
        this.isFirst = false;
        this.winWidth = 0;
        this.appendDiv = options.appendDiv;
        this.isPosition = options.isPosition;
        this.total = '';//用戶選擇間數人數的數據
        this.obj = '.' + ModuleName;
        this.callback = options.callback;
        this.newpackage = options.newpackage;
        this.warningText = options.warningText;
        this.noticeText = options.noticeText;
        this.kidsNoBed = options.kidsNoBed;
        this.readonly = options.readonly;
        this.closeManually = options.closeManually;
        this.opt = options;
        this.activeRoomCount = 1; // 目前間數
        this.newCloseBtnClass = options.closeBtnClass; // 新增的close btn class

        // append 出來的 彈跳視窗 Dom 物件
        this.$targetObj = null;
    };

    Module.DEFAULTS = {
        childMax: 3,//设置小孩select個數最大值
        inputParent: $('.room'),//input的父级对象 用来定位
        appendDiv: null, //將創建的彈窗添加到哪個容器里
        isPosition: false, //移動端是否需要定位
        newpackage: false,
        warningText: null,
        noticeText: null,
        kidsNoBed: false,
        mode: 'select', // tab | select 切換是下拉模式或Tab
        tabCount: 7,
        tabActiveIndex: 0, // 預設房間參數
        defaultCloseBtnClass: ['close'], // 預設的close btn class.
        readonly: true, // 預設input 是readonly
        closeManually: false, //M版時 改為true
        callback: {
            whenInitRoom: function(elem,$module){
                console.log('whenInit',elem,$module);
            },
            whenInitChildAge: function(elem){
                console.log('whenInitChildAge',elem);
            },
            whenInitPeopleNum: function(adult,child,$module){
                console.log('whenInitChildAge',adult,child,$module);
            },
            whenTabBtnClick: function($tabBtn){
                console.log('whenTabBtnClick',$tabBtn);
            },
        },
        isCustomMobile: false
    };

    Module.prototype.init = function(){
        var _this = this;
        // select click event
        this.selectMouseDown(_this.initRoomNumSelect,_this.initPeopleNum,_this.closePopup);

        this.bodyMouseDown();

        this.divClickEvent();
        
        this.mergeCloseBtnClass();

    };

    // 合併close btn class array.
    Module.prototype.mergeCloseBtnClass = function(){
        this.opt.defaultCloseBtnClass = this.opt.defaultCloseBtnClass.concat(this.opt.closeBtnClass);
    }

    // 註冊tab btn 事件
    Module.prototype.tabBtnEvents = function(){
        var self = this;
        self.elem.siblings('.tab-mode-container')
                 .find('.tab-btn-group')
                 .on('click', '.tab-btn', function(e) {
                    console.log('click')
                    $('.tab-btn').removeClass('active')
                    $(e.currentTarget).addClass('active');
                    var count = $(e.currentTarget).data('room-count')
                    self.activeRoomCount = count;
                    self.optionsMouseDown($(e.currentTarget),self.activeRoomCount );
                    // tab 模式 click 時callback
                    self.opt.callback.whenTabBtnClick($(this));
                });
        // 註冊init預設資料傳進來要build對應房間數
        self.opt.callback.whenInitRoom( self.elem.siblings('.tab-mode-container')
                                                 .find('.tab-btn.active') ,self)
    }
    Module.prototype.stopEvents = function(elem){
        var self = this;
        elem.on('mousedown',function(e){
            e.stopPropagation();    
        });
    };

    Module.prototype.bodyMouseDown = function(){
        var _this = this;
        $('body').on('mousedown',function(){
            // 在tab模式不要按到body就收合
            if(_this.opt.mode !== 'tab' && !_this.opt.closeManually){
                $(_this.obj).addClass('d-no');
            }
            
        });
    };

    Module.prototype.closePopup = function(self,elem){
        $(elem).on('mousedown',function(){
            $(self.obj).addClass('d-no');
        });
    };

    Module.prototype.selectMouseDown = function(initRoomNumSelect,initPeopleNum,callback){
        var _this = this;
        $(this.elem).on('mousedown',function(e){
            var device = _this.isMobile();
            e.stopPropagation();
            var elem = $(_this.obj);
            var len = elem.length;
            var detail = null;
            var adult = null;
            var adultBox = null;
            var childBox = null;
            var select = null;
            var closeBtn = null;
            var top = $(this).offset().top + $(this).outerHeight(true);
            var left = $(this).offset().left;
            var right = 0;
            var width = 0;
            _this.winWidth = $(window).width();

            // 沒有這個 st_lnht 時 建立一個物件
            if(len <= 0){
                console.log(device)
                // PC版
                if(!device){
                    var createHtmlStr = _this.createPopup();
                    // 將要append 到容器內的 Dom 物件先存放
                    _this.$targetObj = $(createHtmlStr);
                    if (typeof _this.appendDiv === 'string' && $(_this.appendDiv).length !== 0) {
                        $(_this.appendDiv).append(_this.$targetObj);
                    } else {
                        $('body').append(_this.$targetObj);
                    }
                }
                else{
                    // M版
                    // 2種模式一個是append到div內
                    // 一個是append到body
                    if(_this.appendDiv){
                        var createHtmlStr = _this.createPopup();
                        // 將要append 到容器內的 Dom 物件先存放
                         _this.$targetObj = $(createHtmlStr);
                        $(_this.appendDiv).append(_this.$targetObj);
                    }else{
                        var createHtmlStr = _this.createPopup();
                        // 將要append 到容器內的 Dom 物件先存放
                         _this.$targetObj = $(createHtmlStr);
                        $('body').append(_this.$targetObj);
                    }
                }
                elem = $(_this.obj);
                select = elem.find('#if-disabled');
                detail = elem.find('.detail');
                adult = detail.find('.adult');
                adultBox = detail.eq(0).find('.test1');
                childBox = detail.eq(0).find('.test3');
                closeBtn = elem.find('.close');
                if(select){
                    initRoomNumSelect(select,_this);
                }
                // tab 模式在註冊tab 事件
                if(_this.opt.mode === 'tab'){
                    _this.tabBtnEvents();
                }
                if(adultBox || childBox){
                    initPeopleNum(adultBox,childBox,_this);
                }
                console.log('_this.$targetObj',_this.$targetObj)

            }else{
                elem.removeClass('d-no');
            }
            if(!device || _this.isPosition){
                width = elem.width();
                right = _this.winWidth - left - $(_this.inputParent).width();

                if(width + left > _this.winWidth){
                    elem.css({'position': 'absolute','top': top,'right': right,'left': 'auto','z-index': 999});
                }else{
                    elem.css({'position': 'absolute','top': top,'left': left,'z-index': 999});
                }
            }
            

             _this.stopEvents(elem);

            callback(_this,closeBtn);
        });
    };

    Module.prototype.divClickEvent = function(){
        var _this = this;
        $(this.inputParent).on('click',function(){
            $(_this.elem).trigger('mousedown')
        });
    };

    Module.prototype.initRoomNumSelect = function(elem,self){
        self.callback.whenInitRoom(elem,self);
    };

    // 當選擇選項時執行的function,不支援mobile版預設select時
    // $module.optionsMouseDown($this,$this.val()); //点击options时创建detail
     // 增加大人小孩房數 
    // 可以寫在tab btn click 時，call optionsMouseDown( click的Btn物件, 要build的房間數) 
    Module.prototype.optionsMouseDown = function(self,num){
        var str = '';
        var elem = $(this.obj);
        var detail = elem.find('.detail');
        var len = detail.length;
        var len2 = 0;
        var adult = null;
        var child = null;
        if(num - len > 0){
            for(var i = 1; i <= num - len ;i++){
                str += this.createDetail(len + i);
            }
        }else if(num - len < 0){
            for(var j = 1; j <= Math.abs(num - len) ;j++){
                detail.eq(len - j).remove();
            }
        }
        self.parents('.content').append(str);
        detail = elem.find('.detail');
        len2 = detail.length;
        if(num - len > 0){
            for(var m = 1; m <= Math.abs(len2 - len); m ++){
                var adultBox = detail.eq(len2 - m).find('.test1');
                var childBox = detail.eq(len2 - m).find('.test3');
                // 執行callback whenInitPeopleNum
                this.initPeopleNum(adultBox,childBox,this);
            }
        }
        // 更新 該input 上組成文字
        this.elem.val(this.updateValue(0,$(this.obj),self));
    };

    Module.prototype.initPeopleNum = function(adult,child,self){
        self.callback.whenInitPeopleNum(adult,child,self);
    };

    Module.prototype.minusChild = function(self){
        var ageBox = self.parents('.common').find('.age');
        var selectBox = $(ageBox).find('.select_box');
        var len = $(selectBox).length;
        if(len >= 0){
            len --;
            selectBox.eq(len).remove();
            this.elem.val(this.updateValue(1,$(this.obj),null));
        }
    };

    // 增加小孩select
    Module.prototype.addChild = function(self){
        var ageBox = self.parents('.common').find('.age');
        var len = ageBox.find('.select_box').length;
        var selectBox = null;
        if(len + 1 > this.childMax){
            return
        }
        var $select = $(this.createChildAge())
        $(ageBox).append($select);
        selectBox = $(ageBox).find('.select_box');
        this.initChildAge(selectBox, $select);
        this.elem.val(this.updateValue(1,$(this.obj),null));
    };

    Module.prototype.initChildAge = function(elem, $elem){
        this.callback.whenInitChildAge(elem, $elem);
    };

    // 取得目前總房數總人數 2018/03/16
    Module.prototype.getAllRoomPeopleCount = function(){
        var _this = this;
        if(_this.opt.mode === 'tab'){
             // 抓取目前房間數量
            var roomCount =$(this.obj).find('.tab-btn.active').data('room-count');
            var obj = {
                room : roomCount,
                people: 0
            }
            //input.amount
            // this.obj === .st_lnht
            var peopleCount = 0; // 預設總人數
            $(this.obj).find('input.amount') 
                       .each(function(index,ele){
                            // console.log('人數',$(ele).val())
                            peopleCount +=  parseInt($(ele).val() );
                       })
            obj.people = peopleCount;
            return obj;
        }
       
    }

    // 取得房間人數與大人小孩數(含歲數) 
    Module.prototype.getRoomDetailInfos = function(){
        var self = this;
        var totalObj = {
            roomCount: 0,
            roomPeopleCount : []
            /*
            {
                adult: 0,
                childrenNeedBed: [1,5,12]...,
                childrenNotNeedBed: [1,5,12]...
            }

             */
        };
        // 房數需區別 tab 模式 已另外方法計算去抓tab上的值
        if(self.opt.mode === 'tab'){

            totalObj.roomCount = self.$targetObj.find('.tab-btn.active').data('room-count');

        }
        else{
            // 預設select模式計算房數，直接去抓select上的值
            
            // select.st_lnls 
            totalObj.roomCount = self.$targetObj.find('select.st_lnls').val();
        }

        self.$targetObj.find('.detail')
                       .each(function(index, el) {

                            console.log('detail',index)
                            var peopleObj = {
                                adult: 0,
                                childrenNeedBed: [],
                                childrenNotNeedBed: []
                            };
                            // 存adult
                            peopleObj.adult  =  $(el).find('.adult')
                                                     .find('input.amount')
                                                     .val();
                            // 存小孩占床不佔床
                            var $childNeedBedObj = $($(el).find('.child').children('.common')[0]);
                            var $childNotNeedBedObj = $($(el).find('.child').children('.common')[1]);
                            
                            $childNeedBedObj.find('.select_box')
                                            .each(function(idx,elem){
                                                var childAge = $(elem).find('select.st_lnls').val();
                                                peopleObj.childrenNeedBed.push( childAge );
                                            })

                            // 不佔床
                            
                            $childNotNeedBedObj.find('.select_box')
                                               .each(function(idx,elem){
                                                var childAge = $(elem).find('select.st_lnls').val();
                                                peopleObj.childrenNotNeedBed.push( childAge );
                                               })


                            totalObj.roomPeopleCount.push(peopleObj);
                            
                       });


        return totalObj;
    }


    // 更新input中的文字
    Module.prototype.updateValue = function(key,elem,obj){
        var self = this;
        var str = '';
        var roomNum = '';
        var detail = elem.find('.detail');
        var adult = detail.find('.adult');
        var adultLen = adult.length;
        var adultNum = 0;
        var common = detail.find('.child').find('.common');
        var commonLen = $(common).length;
        var commonNum = 0;
        var roomPeopArry = [];
        if(key){
            roomNum = (function(){
                var text = '';
                // text = $(elem).find('.count').find('.st-selected').text();
                if(self.opt.mode === 'tab'){
                    text = $(elem).find('.count').find('.tab-btn.active').text();
                }
                if(self.opt.mode==='select'){
                    text = $(elem).find('.count').find('.st-selected').text();
                }
                return text;
            })();
        }else{
            if(self.opt.mode === 'tab'){
                roomNum = '共' + self.activeRoomCount  + '間';
            }
            else{
                roomNum = '共' + $(obj).val() + '間';
            }
            
        }
        for(var i = 0; i < adultLen; i++){
            adultNum += Number($(adult).eq(i).find('#test1').val());
        }
        for(var j = 0; j < commonLen; j++){
            commonNum += Number(common.eq(j).find('#test3').val());
        }
        if(this.newpackage){
        	for(let s = 0 ; s < adultLen ; s++){
        		let kidNum = 0;
        		detail.eq(s).find('.kid').each((index,ele)=>{

        			kidNum += Number( $(ele).val() );
        		})
				kidNum = Number( kidNum );
        		roomPeopArry[s] = Number($(adult).eq(s).find('#test1').val()) + kidNum ;
        	}
        	for(let n = 0 ; n < roomPeopArry.length ; n++){
        		str = roomNum + roomPeopArry;
        	}
        	str=str.replace(/,/g, "、")+'人'
        	str = str.replace(/(間)/,'$1，');
        }else{
        	str += roomNum + '，' + adultNum + '位大人、' + commonNum + '位小孩';
        }
        this.total = str;
        return str;
    };

    // create 小孩select數 UI
    Module.prototype.createChildAge = function(){
        return  '<div class="select_box">'+
            '<select class="st_lnls sm">'+
            '</select>'+
            '</div>';
    };

    // 建立主要panelUI
    Module.prototype.createPopup = function(){
        var detail = this.createDetail(1);
        var self = this;
        // var tempCloseBtnClass =
        // console.log('closeBtnClass: ', this.opt.defaultCloseBtnClass);
        var modeText = (function(){
            var htmlStr =  ''
            if(self.opt.mode=== 'tab'){
                var maxRoomCount = 7; // 最大房間數
                htmlStr =   '<div class="count reset-size d-b">'+
                                '<div class="tab-btn-group d-b">';
                                    for(var i = 0; i<self.opt.tabCount && i < maxRoomCount;i++){
                                        if(i === self.opt.tabActiveIndex)
                                            htmlStr += '<div class="bt_slbx  tab-btn active" data-room-count="'+(i+1)+'">共'+(i+1)+'間</div>'
                                        else
                                            htmlStr += '<div class="bt_slbx tab-btn" data-room-count="'+(i+1)+'">共'+(i+1)+'間</div>'
                                    }
                htmlStr +=      '</div>'+
                            '</div>';
            }

            if(self.opt.mode=== 'select'){
                htmlStr = '<div class="count">'+
                            '<select class="st_lnls" data-label="間數:" id="if-disabled"></select>'+
                          '</div>';
            }
            return htmlStr;
        })();
        return  "<div class='" + (this.newpackage? "st_lnht newpackage" : "st_lnht") + "'>"+
            '<div class="content">'+
            '<a class="' + this.opt.defaultCloseBtnClass.join(" ") + '"></a>' +
            modeText +
            detail +
            '</div>'+
            (this.noticeText?'<div class="notice">'+this.noticeText+'</div>':'') +
            '<div class="wt">'+
            '<div class="left">'+
            (this.warningText?'<i class="ic-ln icon toolremind"></i>': '') +
            '</div>'+
            '<div class="right">'+
            (this.warningText?this.warningText:'') +
            '</div>'+
            '</div>'+
            '</div>';
    };

    Module.prototype.createDetail = function(num){
    	let kidsNoBed = '';
    	let kidsHasBed = '<span>小孩</span>';
    	if(this.kidsNoBed) {
    		kidsNoBed='<div class="common"><div class="amounts"><span>小孩不佔床</span><div class="btg_gpct xin test3 gray"><input id="test3" class="amount kid" type="text" value="0" readonly></div></div><div class="age"></div></div>';
        	kidsHasBed = '<span style="width: 5em;">小孩佔床</span>';
        }
        
        if(this.readonly){
            return '<div class="detail">'+
            '<div class="item">'+
            '<div class="num">'+ num +'</div>'+
            '<div class="info">'+
            '<div class="adult">'+
            '<div class="common">'+
            '<span>成人</span>'+
            '<div class="btg_gpct xin test1 gray">'+
            '<input id="test1" class="amount" type="text" value="1" readonly>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '<div class="child">'+
            '<div class="common">'+
            '<div class="amounts">'+
            kidsHasBed+
            '<div class="btg_gpct xin test3 gray">'+
            '<input id="test3" class="amount kid" type="text" value="0" readonly>'+
            '</div>'+
            '</div>'+
            '<div class="age"></div>'+
            '</div>'+
            kidsNoBed+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>';
        }else{
            return '<div class="detail">'+
            '<div class="item">'+
            '<div class="num">'+ num +'</div>'+
            '<div class="info">'+
            '<div class="adult">'+
            '<div class="common">'+
            '<span>成人</span>'+
            '<div class="btg_gpct xin test1 gray">'+
            '<input id="test1" class="amount" type="text" value="1">'+
            '</div>'+
            '</div>'+
            '</div>'+
            '<div class="child">'+
            '<div class="common">'+
            '<div class="amounts">'+
            kidsHasBed+
            '<div class="btg_gpct xin test3 gray">'+
            '<input id="test3" class="amount kid" type="text" value="0">'+
            '</div>'+
            '</div>'+
            '<div class="age"></div>'+
            '</div>'+
            kidsNoBed+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>';
        }

    };

    // 是否為M版
    Module.prototype.isMobile = function(){

        if (this.opt.isCustomMobile === false ){
            if(navigator.userAgent.match(/Android/i) || navigator.userAgent.indexOf('iPhone') != -1 || navigator.userAgent.indexOf('iPod') != -1 || navigator.userAgent.indexOf('iPad') != -1) {
                if($(window).outerWidth() > 980 )
                    return false;
                else
                    return true;
                
            }
            else {
                return false;
            }
        }
        else{
            if($(window).outerWidth() > 980 )
                return false;
            else
                return true;
            
        }
        
    };

    $.fn[ModuleName] = function ( options1,options2,options3) {
        return this.each(function(){
            var $this = $(this);
            var module = $this.data( ModuleName );
            var opts = null;
            if ( !!module ) {
                if ( typeof options1 === 'string' &&  typeof options2 === 'undefined' &&  typeof options3 === 'undefined') {
                    module[options1]();
                } else if ( typeof options1 === 'string' &&  typeof options2 === 'string' ||  options2 instanceof Array && typeof options3 === 'boolean') {
                    module[options1](options2,options3);
                } else {
                    console.log('unsupported options!');
                    throw 'unsupported options!';
                }
            } else {
                opts = $.extend( {}, Module.DEFAULTS,( typeof options1 === 'object' && options1 ));
                module = new Module(this, opts);
                $this.data( ModuleName, module );
                module.init();
            }
        });
    };
})(jQuery);