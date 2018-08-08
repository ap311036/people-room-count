(function($) {
    'use strict';
    var ModuleName = 'btg_gpct';

    var Module = function(element, options) {
        this.ele = element;
        this.$ele = $(element);
        this.option = options;
        this.max = options.max;
        this.min = options.min;
        this.addBtn = options.add;
        this.minusBtn = options.minus;
        this.nowValue = null;
    };

    Module.DEFAULTS = {
        minus:'<button class="ic-ln toolcancelb minus"></button>',
        add:'<button class="ic-ln tooladdb add"></button>',
        whenClick:function($dom){
            
        },
        beforeChangeFun:function($dom){

        }
    };

    Module.prototype.render = function(maxNum,minNum){
        var $this = this.$ele,
            newOptions = this.option,
            minus = newOptions.minus,
            add = newOptions.add,
            $amount_num = parseInt($this.children('.amount').val());
            this.nowValue = $amount_num;

        if($this.children().length < 3){
            $this.prepend(minus);
            $this.append(add);
        }
        $this.children().first().addClass('minus');
        $this.children().last().addClass('add');
        
        if( $amount_num == minNum){
            $this.children().first().addClass('disabled');
        }
    };

    Module.prototype.init = function(){

        this.render(this.maxNum,this.min);

        var _self = this,
            $this = this.$ele,
            newOptions = this.option,
            $amount = $this.children('.amount'),
            $minus = $this.children('.minus'),
            $add = $this.children('.add');

        var callbackFun = newOptions.whenClick;
    
        //clcik events

        $add.on('click',function(){

            var maxNum = _self.max;
            var minNum = _self.min;

            if($amount.prop('tagName') == 'INPUT'){

                var amount_num = _self.nowValue;

                if ( maxNum || maxNum == 0) {
                    if( amount_num < maxNum){
                        amount_num++;
                    }
                }else{
                    amount_num++;
                }

                $amount.attr('value',amount_num);
                $minus.removeClass('disabled'); 
                _self.nowValue = amount_num;

                (typeof callbackFun === 'function')? callbackFun($(this)) : null ;

                $amount.trigger('update');
                
            }else{
                var amount_num = parseInt($amount.text());
                if (maxNum) {
                    if (amount_num < maxNum){amount_num++;}
                }else{
                    amount_num++;
                }
                $amount.text(amount_num);  
            }
            
        });


        $minus.on('click',function(){

            var maxNum = _self.max;
            var minNum = _self.min;

            if($amount.prop('tagName') == 'INPUT'){

                var amount_num = _self.nowValue;

                if( minNum ){
                    if( amount_num > minNum ){amount_num --;}
                }else if( amount_num > 0){
                    amount_num --;
                }

                var res = newOptions.beforeChangeFun($(this));
                if(res === false){
                    return;
                }

                $amount.attr('value',amount_num);   
                $add.removeClass('disabled');
                _self.nowValue = amount_num;

                (typeof callbackFun === 'function')? callbackFun($(this)) : null ;
                $amount.trigger('update');
                   
            }else{
                var amount_num = parseInt($amount.text());
                if(minNum){
                    if( amount_num > minNum){amount_num--;}
                }else if( amount_num > 0){
                    amount_num--;
                }  
                $amount.text(amount_num);   
            }
            
        });

        $amount.on('update', function(e) {
            _self.onChange(_self.nowValue,_self.max,_self.min);
        });
    }

    Module.prototype.updateOption = function(newOptions){
        this.max = newOptions.max;
        this.min = newOptions.min;
        this.onChange(this.nowValue,this.max,this.min);
    }

    Module.prototype.onChange = function(nowValue,maxNum,minNum){

        var $this = this.$ele,  
            $minus = $this.children('.minus'),
            $add = $this.children('.add');

            if( nowValue == minNum){
                $minus.addClass('disabled');

                ( nowValue == maxNum ) ? $add.addClass('disabled') : $add.removeClass('disabled');
            }else if( nowValue == maxNum ){
                $add.addClass('disabled');
            }else{
                $minus.removeClass('disabled');
                $add.removeClass('disabled');
            }

            
    }

    
    $.fn[ModuleName] = function(options,updateOption) {
        return this.each(function() {
            var $this = $(this);
            var module = $this.data(ModuleName);
            var opts = null;
            if (!!module) {
                if (typeof options === 'string' && typeof updateOption === 'object' ) {
                    module[options](updateOption);
                } else {
                    throw 'unsupported options!';
                }
            } else {
                opts = $.extend({}, Module.DEFAULTS, (typeof options === 'object' && options));
                var module = new Module(this, opts);
                $this.data(ModuleName,module);
                module.init();
            }
        });
    };

})(jQuery);
