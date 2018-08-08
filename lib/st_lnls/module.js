(function($) {
    'use strict';

    var ModuleName = 'st_lnls';

    var Module = function(element, options) {
        this.ele = element;
        this.$ele = $(element);
        this.stele = {};
        this.option = options;
        this.className = null;
        this.isClicked = false;
        this.intOldVal = null;
    };

    Module.DEFAULT = {
        highestZindex: null,
        addClass: {
            WrapClass: '',
            SelectClass: '',
            OptionsClass: '',
            OutClass: ''
        },
        addLabel:null, // 用傳入api方式來create label
        group: 'on', // 'on' , 'off'  是否使用group功能
        openDirection: 'down', // 'up' , 'down' 控制展開方向
        optionObj: null, // 傳入一個obj產生option, value值為obj的key ,內文為obj的值
        defaultSelector: 'on', // 'on' , 'off' 是否使用預設selector
        haveDefaultDisabledVal: true, // 傳入disabled選項的值
        defaultSelectedVal: "", // 傳入預設選取的值
        menuMaxHeight:"", // option menu 展開後最高高度
        actInput:false,//是否啟動補字功能
        customInput:{ //客製化input actInput必須要啟動
            name:null,
            class:null,
            id:null,
            style:{}
        },
        whenOpen: function($this) {

        },
        whenSelected: function($this) {

        },
        whenClose: function($this) {

        },whenInited: function($this,$stSelected){

        }
    };
    Module.prototype.menuDirection = function(ele, $stOptions, highestZindex) {
        var opts = this.option,
            DocHeight = $(window).height(),
            optionsOffset = ele.getBoundingClientRect(),
            $stOptionsHeight = !!opts.menuMaxHeight ? opts.menuMaxHeight : $stOptions.outerHeight(),
            overWindow = ((optionsOffset.top + optionsOffset.height +　$stOptionsHeight)　> DocHeight ) ? true : false,
            topLevel = (opts.openDirection == "up" || overWindow)?'inherit':optionsOffset.height,
            bottomLevel = (opts.openDirection == "up" || overWindow)?optionsOffset.height:'inherit',
            scaleRate = opts.openDirection == "up"?4 / 5:3 / 4,
            menuMaxHeight = !!opts.menuMaxHeight?opts.menuMaxHeight:( (opts.openDirection == "up" || overWindow) ? optionsOffset.top:DocHeight) * scaleRate,
            menuCss = {
                'minWidth': optionsOffset.width,
                'top': topLevel,
                'bottom': bottomLevel,
                'max-height': menuMaxHeight,
                'z-index': highestZindex + 1
            };
            
        if (opts.openDirection == 'up' || overWindow ) {
            $stOptions.addClass('active expandtop').css(menuCss);
        } else {
            $stOptions.addClass('active').css(menuCss);
        }
    }

    Module.prototype.init = function() {
        this.render();
        var self = this;
        var $this = this.$ele;
        var opts = this.option;
        var isClicked = this.isClicked;
        // var numberOfOptions = $this.children('option').length;
        var highestZindex = opts.highestZindex;
        var $thisIndex = $this.index();
        var $stWrap = $this.parent().find('.st-wrap').eq($thisIndex);
        var $stSelect = $stWrap.find('.st-select');
        var $stSelected = $stSelect.find('.st-selected');
        var $stOptions = $stWrap.find('.st-options');
        var $stInt = this.stele.$stInt;
        var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (!opts.highestZindex) {
            highestZindex = this.getZindex();
            Module.DEFAULT.highestZindex = highestZindex;
        }

        if (isMobile && opts.defaultSelector == 'on') {
            $this.addClass('m_hide');
        } else {
            $this.addClass('hide');
        }

        // set st-label
        this.setStlabel($this,$stSelect);  
        // set st-Icon
        this.setStIcon($this,$stSelect);  
        // set st-grp width
        var set_Stdata = this.setStgrp($this,$stWrap,$stSelect,$stSelected,$stOptions,opts);
        $stWrap = set_Stdata[0];
        $stSelect = set_Stdata[1];
        $stSelected = set_Stdata[2];
        $stOptions = set_Stdata[3];

        // mobile original select settings
        if ($this.hasClass('m_hide')) {
            $this.css({
                top: $stWrap.position().top,
                width: 100 + "%",
            });
        }

        opts.whenInited($this,$stSelected);

        // Events
        $stSelect.focusin(function() {
            if($stInt) return;
            if (!isClicked) {
                if ($(this).attr('disabled')) return;
                $stSelect.addClass('active');
                $stWrap.addClass('active');
            }
        }).blur(function() {
            if($stInt) return;
            console.log($stOptions.filter('hover').length)
            if($stOptions.filter(':hover').length === 0) {
                $stSelect.removeClass('active');
                $stWrap.removeClass('active');
                $stOptions.removeClass('active expandtop');
                $stOptions.removeAttr('style');
                (typeof(opts.whenClose) === 'function') && opts.whenClose($this);
                isClicked = false;
            }
        }).click(function(e) {
            e.stopPropagation();

            if($stInt){
                $stOptions.children('li').show().removeClass('matched');
                $stInt.trigger('focus');

                if($stOptions.hasClass('active')){
                    $stOptions.removeClass('active expandtop');
                    $stOptions.removeAttr('style');
                } else {
                    self.menuDirection(this, $stOptions, highestZindex);
                    (typeof(opts.whenOpen) === 'function') && opts.whenOpen($this);
                }
                return;
            }
      
            isClicked = !isClicked;
            if (!isClicked) {
                $stOptions.removeClass('active');
                $stOptions.removeAttr('style');
            } else {
                $stOptions.removeClass('active expandtop');
                $stOptions.removeAttr('style');
                if (!$(this).attr('disabled')) {
                    (typeof(opts.whenOpen) === 'function') && opts.whenOpen($this);
                    self.menuDirection(this, $stOptions, highestZindex);
                }
            }
        });

        $stOptions.on('mousedown', 'li', function(e) {
            e.preventDefault();
            var originVal = $this.val();
            if (!$(this).attr('disabled')) {
                $stOptions.removeClass('active');
                $this.val($(this).attr('rel'));
                if(originVal != $this.val()) $this.trigger('change');
                $(this).siblings('li.selected').removeClass('selected');
                $(this).addClass('selected');
                isClicked = false;

                if($stInt){
                    $stInt.val($(this).text());
                    self.intOldVal = $stInt.val();
                }
            }
            console.log("clicked")
        })
        $this.change(function(e) {
            var optValue = $this.val();
            var optTxt = $stOptions.find('[rel="' + optValue + '"]').text();
            var optColor = $stOptions.find('[rel="' + optValue + '"]').css('color');
            console.log($stOptions)
            console.log(optColor)
            console.log($this)
            console.log(optValue)
            opts.whenSelected && typeof(opts.whenSelected) === 'function' && opts.whenSelected($this);

            $stSelected.text(optTxt);
            if (!$this.hasClass('err') && !$this.hasClass('scs') &&!$this.hasClass('breakline')) {
                $stSelected.css('color', optColor);
            }
            if($this.hasClass('breakline')){
                $stSelected.css('color', '');
            }
        });

        $this.on('setWhenSelected', function(event, whenSelected) {
            if (whenSelected && typeof whenSelected === 'function') {
                opts.whenSelected = whenSelected;
            }
        });

        $this.on('setWhenOpen', function(event, whenOpen) {
            if (whenOpen && typeof whenOpen === 'function') {
                opts.whenOpen = whenOpen;
            }
        });

        $this.on('setWhenClose', function(event, whenClose) {
            if (whenClose && typeof whenClose === 'function') {
                opts.whenClose = whenClose;
            }
        });

        $this.on('reloadOpts', function(event, opts, optsSetting, excWhenSelected) {
            opts && ($.isArray(opts) || typeof opts == 'object') && self.reloadOptions(opts, optsSetting, excWhenSelected);
        });

        $this.on('setErr', function() {
            $this.addClass('err');
            $stWrap.addClass('err');
            $stSelected.css('color', '');
        });

        $this.on('setScs', function() {
            $this.addClass('scs');
            $stWrap.addClass('scs');
            $stSelected.css('color', '');
        });

        $this.on('removeErr', function() {
            $this.removeClass('err');
            $stWrap.removeClass('err');
            if (!$this.hasClass('err') && !$this.hasClass('scs')) {
                $stSelected.css('color', $stOptions.find('.st-option.selected').css('color'));
            }
        });

        $this.on('removeScs', function() {
            $this.removeClass('scs');
            $stWrap.removeClass('scs');
            if (!$this.hasClass('err') && !$this.hasClass('scs')) {
                $stSelected.css('color', $stOptions.find('.st-option.selected').css('color'));
            }
        });

        $this.on('setDisabled', function() {
            $this.attr('disabled', '');
            $stSelect.attr('disabled', '');
        });

        $this.on('removeDisabled', function() {
            $this.attr('disabled', false);
            $stSelect.attr('disabled', false);
        });

        if($stInt){
            $stInt.on('keyup',function(e){
                self.inputEvent(this, $stWrap, $stSelect, $stOptions, e.target.value);
            });
            $stInt.on('click',function(e){
                e.stopPropagation();
            });
        }

        $('html').on('click',function(){
            if($stInt){
                $stOptions.removeClass('active expandtop')
                          .removeAttr('style');
                if(self.intOldVal === $stInt.val()) return;
                self.autoCheck($stInt, $stInt.val(), opts.optionObj, $stOptions);
                self.intOldVal = $stInt.val();
            }
        });
    };

    Module.prototype.render = function() {
        var $this = this.$ele;
        var opts = this.option;
        this.getClassName();
        var ClassName = this.className;

        if ($this.children('option').length == 0) {
            if (!opts.optionObj) {
                throw new Error('找不到options資料');
            } else {
                var arr = Object.keys(opts.optionObj);
                var arrVal = $.map(opts.optionObj, function(val, index) {
                    return val;
                });
                for (var i = 0; i < arr.length; i++) {
                    $this.append('<option value="' + arr[i] + '">' + arrVal[i] + '</option>');
                }
                if (opts.haveDefaultDisabledVal) {
                    if (opts.defaultSelectedVal) {
                        $this.find('[value=' + opts.defaultSelectedVal + ']').attr('selected', 'selected');
                        $this.find('[value=' + opts.defaultSelectedVal + ']').attr('disabled', 'disabled');
                    }else $this.prepend('<option value selected disabled>請選擇</option>');
                }else if (opts.defaultSelectedVal) {
                    $this.find('[value=' + opts.defaultSelectedVal + ']').attr('selected', 'selected');
                }
            }
        }

        if (/(st-grp)\w*/g.test(ClassName) && opts.group == 'on') {
            this.group();
            var $stWrap = $('<div class="st-wrap"></div>');
            var $stSelect = $('<div class="st-select" tabindex="-1"></div>');
            var $stSelected = $('<span class="st-selected"></span>');
            var $stOptions = $('<ul class="st-options"></ul>');
            $this.wrap($stWrap);
            $this.after($stSelect);
            $stSelect.append($stSelected);
            $stSelect.after($stOptions);
            this.stele.$stWrap = $this.parent('.st-wrap');
            this.stele.$stSelect = $stSelect;
            this.stele.$stSelected = $stSelected;
            this.stele.$stOptions = $stOptions;
        } else {
            $this.wrap('<div class="' + ModuleName +' '+ this.option.addClass.OutClass + '"></div>');
            var $stWrap = $('<div class="st-wrap"></div>');
            var $stSelect = $('<div class="st-select" tabindex="-1"></div>');
            var $stSelected = $('<span class="st-selected"></span>');
            var $stOptions = $('<ul class="st-options"></ul>');
            $this.after($stWrap);
            $stWrap.append($stSelect);
            $stSelect.append($stSelected);
            $stSelect.after($stOptions);
            this.stele.$stWrap = $stWrap;
            this.stele.$stSelect = $stSelect;
            this.stele.$stSelected = $stSelected;
            this.stele.$stOptions = $stOptions;
        }

        if(opts.actInput){
            var customOpts = opts.customInput;
            var $stInt = $('<input class="st_int" type="text" />');
            
            $stInt.addClass(customOpts.class)
                  .attr('id', customOpts.id)
                  .attr('name', customOpts.name)
                  .css( customOpts.style )
                  .val($this.find('[value="'+ $this.val() +'"]').text());

            this.stele.$stWrap.prepend($stInt);
            this.stele.$stInt = $stInt;
            this.intOldVal = $stInt.val();
        }

        this.stele.$stWrap.addClass(ClassName);
        this.stele.$stWrap.removeClass(ModuleName)
    };

    Module.prototype.setStlabel = function($this,$stSelect){
        if ($this.attr('data-label')) {
            $stSelect.prepend('<span class="st-label">' + $this.attr('data-label') + '</span>');
        } else if ( this.option.addLabel ){
            $stSelect.prepend('<span class="st-label">' + this.option.addLabel + '</span>');
        }
    }
    Module.prototype.setStIcon = function($this,$stSelect){
        if ($this.attr('data-icon')) {
            $stSelect.prepend('<i class="icon ic-ln ' + $this.attr('data-icon') + '"></i>');
        } else if ( this.option.addLabel ){
            $stSelect.prepend('<span class="st-label">' + this.option.addLabel + '</span>');
        }
    }
    Module.prototype.setStgrp = function($this,$stWrap,$stSelect,$stSelected,$stOptions,opts){
        var setStgrpArr = [];        
        var numberOfOptions = $this.children('option').length;
        if ($this.parents().hasClass('st-grp')) {
            $stWrap = $this.closest('.st-wrap');
            $stSelect = $stWrap.find('.st-select');
            $stSelected = $stSelect.find('.st-selected');
            $stOptions = $stWrap.find('.st-options');
            if ($this.data('col')) {
                $stWrap.addClass($this.data('col'));
            } else {
                $stWrap.css({
                    'width': 100 / $stWrap.closest('.st-grp').children().length + '%'
                });
            }       
        }

        if (typeof opts.addClass === 'object') {
            $stWrap.addClass(opts.addClass.WrapClass);
            $stSelect.addClass(opts.addClass.SelectClass)
            $stOptions.addClass(opts.addClass.OptionsClass)
        }

        if ($this.attr('disabled')) {
            $stSelect.attr('disabled', '');
        }

        for (var i = 0; i < numberOfOptions; i++) {
            var $stOption = $('<li />', {
                text: $this.children('option').eq(i).text(),
                rel: $this.children('option').eq(i).val(),
                css: { 'color': $this.children('option').eq(i).attr('data-color') },
                'class': 'st-option'
            });
            $stOptions.append($stOption);

            if ($this.children('option').eq(i).attr('disabled')) {
                $stOption.attr('disabled', '');
            }
            if ($this.children('option').eq(i).attr('selected')) {
                $stSelected.text($this.children('option').eq(i).text());
                $stOption.addClass('selected');
                if (!$this.hasClass('err') && !$this.hasClass('scs') && !$this.attr('disabled')) {
                    $stSelected.css('color', $stOption.css('color'));
                }
            }
        }
        if ( $this.children('option[selected]').length == 0){
            $stSelected.text($this.children('option').eq(0).text()).css( 'color' , $stOption.css('color') );
            $stOptions.children('li:first-child').addClass('selected');
        }
        if ( $this.hasClass('breakline') ) {
            $stSelected.css( 'color', '' ); 
        }
        setStgrpArr.push($stWrap,$stSelect,$stSelected,$stOptions,opts)
        return setStgrpArr
    }
    // selectedOptKey disabledOptKeys
    Module.prototype.reloadOptions = function(opts, optsSetting, excWhenSelected) {
        var $this = this.$ele;
        var options = this.option;
        var $stWrap = this.stele.$stWrap;
        var $stSelect = this.stele.$stSelect;
        var $stSelected = this.stele.$stSelected;
        var $stOptions = this.stele.$stOptions;

        $this.empty();
        $stOptions.empty();

        if ($.isArray(opts)) {
            for (var i = 0; i < opts.length; i++) {
                // options
                $this.append($('<option />', {
                    text: opts[i].txt,
                    value: opts[i].val,
                }));
                // stOptions
                var $stOption = $('<li />', {
                    text: opts[i].txt,
                    rel: opts[i].val,
                    css: { 'color': $this.children('option').eq(i).attr('data-color') },
                    class: 'st-option'
                });
                $stOptions.append($stOption);

                if (opts[i].isDisabled) {
                    $stOption.attr('disabled', '');
                }
                if (opts[i].isSelected) {
                    $stOption.attr('selected', '');
                    $this.val(opts[i].val);
                    $stSelected.text(opts[i].txt);
                }
            }
        } else if (typeof opts == 'object') {
            for (var i in opts) {
                $this.append($('<option />', {
                    text: opts[i],
                    value: i,
                }));
                var $stOption = $('<li />', {
                    text: opts[i],
                    rel: i,
                    css: { 'color': $this.children('option').eq(i).attr('data-color') },
                    class: 'st-option'
                });
                $stOptions.append($stOption);

                var selectedOptKey = !!optsSetting?optsSetting.selectedOptKey:undefined;
                var disabledOptKeys = !!optsSetting?optsSetting.disabledOptKeys:undefined;
                if (!!disabledOptKeys && (typeof disabledOptKeys === 'string' || $.isArray(disabledOptKeys))) {
                    if (typeof disabledOptKeys === "string" && i === disabledOptKeys) {
                        $stOption.attr('disabled', '');
                    }else if ($.isArray(disabledOptKeys) && $.inArray(i, disabledOptKeys) > -1) {
                        console.log("is in array")
                    }
                }
                if (!!selectedOptKey && typeof selectedOptKey == 'string' && $stOption.attr("rel") == selectedOptKey) {
                    $stOption.attr('selected', '');
                    $this.val(i);
                    $stSelected.text(opts[i]);
                }
            }
        }
        if (!$this.hasClass('err') && !$this.hasClass('scs') && !$this.hasClass('breakline') && !$this.attr('disabled')) {
            $stSelected.css('color', $stOption.css('color'));
        }

        if(excWhenSelected) { 
            options.whenSelected && typeof(options.whenSelected) === 'function' && options.whenSelected($this);
        }
    }

    Module.prototype.getClassName = function() {
        return this.className = this.$ele.attr('class');
    };

    Module.prototype.getZindex = function() {
        var highest = 0;

        $("*").each(function() {
            var current = parseInt($(this).css("z-index"), 10);
            if (current && highest < current) highest = current;
        });

        return highest
    };

    Module.prototype.group = function() {
        var $this = this.$ele;
        var ClassName = this.className;
        var classArray = this.className.split(' ');
        var catchClass;
        classArray.forEach(function(value, index) {
            if (/(st-grp\w*)/g.test(value)) {
                catchClass = classArray[index];
            }
        });

        if (!$this.parent('.st-grp').length > 0) {
            $this.nextAll('.' + catchClass).andSelf().wrapAll('<div class="st-grp ' + ModuleName +' '+ this.option.addClass.OutClass + '"></div>');
        }
    };

    Module.prototype.inputEvent = function(stInt, $stWrap, $stSelect, $stOptions, inputVal){
        //把特殊字元轉譯成為一般字串
        inputVal = inputVal.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        var RegString = new RegExp(inputVal,"i");

        $stOptions.children('li').removeClass('matched').hide().filter(function(){
            return RegString.test($(this).text())
        }).show().addClass('matched');

        if($stOptions.children('li.matched').length != 0){
            this.menuDirection(stInt, $stOptions, Module.DEFAULT.highestZindex);
        } else {
            $stOptions.removeClass('active expandtop').removeAttr('style');
        }
    };

    Module.prototype.autoCheck = function($stInt, inputVal, allData, $stOptions){
        inputVal = inputVal.toUpperCase();
        var arr = $.map(allData,function(value, index){
            return value;
        });

        var hasMatchVal = arr.some(function(value, index, array){
            return inputVal === value;
        });
        
        if(hasMatchVal){
            inputVal = inputVal.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            var RegString = new RegExp(inputVal,'i');
            $stOptions.children('li').filter(function(){
                return RegString.test($(this).text())
            }).trigger('mousedown');

        } else {
            $stInt.val('');
        }
    };

    $.fn[ModuleName] = function(options) {
        return this.each(function() {
            var $this = $(this);
            var dataParameter = {};

            if ($this.data('opendirection')) { dataParameter.openDirection = $this.data('opendirection'); }
            if ($this.data('defaultselector')) { dataParameter.defaultSelector = $this.data('defaultselector'); }
            if ($this.data('addclass') && (typeof $this.data('addclass') === 'object')) {
                dataParameter.addClass = $this.data('addclass');
            }
            if ($this.data('optionobj') && (typeof $this.data('optionobj') === 'object')) {
                dataParameter.optionObj = $this.data('optionobj');
            }

            var opts = $.extend({}, Module.DEFAULT, (typeof options === 'object' && options), dataParameter);
            var module = new Module(this, opts);
            module.init();
            // $this.data(ModuleName,Module);
        });
    };

})(jQuery);
