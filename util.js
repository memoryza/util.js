 /* 判断是否是ipd上的浏览器 */
    jQuery.extend(jQuery.browser, {
        Ipad : navigator.userAgent.toLowerCase().match(/iP(hone|ad)/i)
    });
    var __util = {
            /* 异步加载js */
            loadJs: function(url, callback) {
                var d = new Date(),
                    token = d.getFullYear() + '' + (d.getMonth()+ 1) + '' + d.getDate(),
                    url = url + '?' + token;
                $.ajax({
                    url: url,
                    dataType: "script",
                    cache: false,
                    success:function(xhr){
                      if (callback) {
                        try {
                            callback();
                        } catch(err) {
                            eval(xhr);
                            callback();
                        }
                      }
                    }
                });
            },
            messageTip: function(message, time, callback) {
                if(typeof time === 'function') {
                    callback = time;
                    time = 3000;
                }
                var setting = {
                        message: message,
                        time: time,
                        callback: callback
                };

                 if(typeof $.popTipLayer === 'function') {
                       return  initPopLayer();
                } else {
                      require('poptiplayer');
                      return  initPopLayer();
                }
                function initPopLayer() {
                     return $.popTipLayer(setting);
                }
            },
            /* 日期插件参数 */
            getChineseCalendar: function() {
                return {
                   closeText: '关闭',
                   prevText: '&#x3c;上月',
                   nextText: '下月&#x3e;',
                   currentText: '今天',
                   monthNames: ['1月','2月','3月','4月','5月','6月',
                        '7月','8月','9月','10月','11月','12月'],
                    monthNamesShort: ['一','二','三','四','五','六',
                    '七','八','九','十','十一','十二'],
                    dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
                    dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
                    dayNamesMin: ['日','一','二','三','四','五','六'],
                    weekHeader: '周',
                    dateFormat: 'yy-mm-dd',
                    firstDay: 1,
                    isRTL: false,
                    showMonthAfterYear: true,
                    yearSuffix: '年'
                };
            },
            /* 生成前端模版代码的函数 */
            getTemplateHtml: function(html, data, setting) {
                if(typeof _ == 'function') {
                    return _.template(html, data, setting);
                } else {
                    __util.loadJs('/js/sea-modules/underscore/underscore-min.js', function() {
                         return _.template(html, data, setting);
                    });
                }
                return '';
            },
            /* 格式化数值 */
            formatNumber: function(domList) {
                if(typeof $.fn.number == 'function') {
                    innerInit();
                } else {
                    __util.loadJs('/js/sea-modules/jquery/jquery.number.min.js', function() {
                         innerInit();
                    });
                }
                function innerInit() {
                    if(domList && domList.length) {
                        for(var i = 0, j = domList.length; i < j; i ++) {
                            var dom  = $(domList[i]);
                            if(dom && dom.length) {
                                dom.number(true, 2, '.', ',');
                            }
                        }
                    }
                }
            },
            /* 日历插件 */
            jsSelectDate: function() {
                if(typeof $.fn.jSelectDate == 'function') {
                        innerInit.call(this);
                } else {
                    __util.loadJs('/js/sea-modules/jquery/jquery.selectdate.js', function() {
                         innerInit.call(this);
                    });
                }
                function innerInit() {
                        $(this).each(function() {
                                var value = parseInt($(this).attr('age')) || 100;
                                $(this).jSelectDate({
                                css: "sel",
                                yearBegin: (new Date()).getFullYear() - value,
                                disabled : false,
                                showLabel : false
                            });
                      });
                  }
            },
            /* 初始化滚动条 */
            initNiceScroll: function() {
                var _this = this;
                if(typeof $.fn.niceScroll === 'function') {
                        innerInit.call(_this);
                } else {
                    __util.loadJs('/js/sea-modules/jquery/jquery.nicescroll.min.js', function() {
                         innerInit.call(_this);
                    });
                }
                function innerInit() {
                    var $this = $(this);
                    if($this.getNiceScroll().length) {
                        $this.getNiceScroll().resize();
                        /* fixed ie scrollTop miss bug */
                        if($.browser.msie && $this.data('scrollTop')) {
                            $this.scrollTop($this.data('scrollTop'));
                        }
                    } else {
                        var option = {
                           cursorcolor: "#7F7F7F",
                           hidecursordelay: 100
                        };
                        $this.niceScroll(option);
                    }
                }
            },
            /* 点击隐藏事件二 位数组   边界、layers to hide、是否移除(1:移除，0：隐藏，>1 自定义行为) */
            globalHiddenEvent: function(layers) {
                if(layers.length) {
                    var len = layers.length;
                    $(document).on('click', function(e) {
                        var $target = $(e.target);
                        for (var i = 0; i < len;  i++){
                            if($(layers[i][1]).is(':visible') && !($target.closest(layers[i][0]).length)) {
                                var $layer = $(layers[i][1]);
                                switch (layers[i][2]) {
                                    case 0:
                                        $layer.hide();
                                        break;
                                    case 1:
                                        $layer.remove();
                                        break;
                                    case 2:
                                        $layer.hide();
                                    default:
                                        break;
                                }
                            }
                        }
                    })
            }
        },
        initPlaceHolder: function() {
            //~ if(typeof $.fn.placeholder == 'function') {
                //~ $('input,textarea').placeholder();
            //~ } else {
                //~ __util.loadJs('/js/sea-modules/jquery/jquery.placeholder.js', function() {
                    //~ $('input,textarea').placeholder();
                //~ });
            //~ }
            /* 嗨没见过这么没见识的需求 */
            function initAction() {
                if(! $(this).val() && $.browser.msie && parseInt($.browser.version) <= 9) {
                    $(this).val($(this).data('placeholder'));
                }
            }
            $('input[placeholder], textarea[placeholder]').each(function() {
                    $(this).data({'placeholder': $(this).attr('placeholder')}).on('click', function() {
                        if(!$(this).val() || $(this).val() == $(this).data('placeholder')) {
                            if($.browser.msie && parseInt($.browser.version) <= 9) {
                                $(this).val('');
                            } else {
                                $(this).attr('placeholder', '');
                            }
                        }
                    }).on('blur', function() {
                        if(!$(this).val() || $(this).val() == $(this).data('placeholder')) {
                            if($.browser.msie && parseInt($.browser.version) <= 9) {
                                $(this).val($(this).data('placeholder'));
                            } else {
                                $(this).attr('placeholder', $(this).data('placeholder'));
                            }
                        }
                    });
                    initAction.call(this);
            });
        },
        isLockDom: function() {
            var $dom = $(this);
            if($dom.length && $dom.data() && $dom.data('locked')) {
                return true;
            }
            return false;
        },
        lockedDom: function(time) {
            var $dom = $(this);
            if($dom.length) {
                var timer = time || 3000;
                $dom.data('locked', 1);
                setTimeout(function() {
                    $dom.data('locked', 0);
                }, timer);
            }
        },
        getFormatDate: function(timeStr) {
            var dateTemp = new Date(timeStr),
                year = dateTemp.getFullYear(),
                month = dateTemp.getMonth() + 1,
                day = dateTemp.getDate();
            month = month > 9 ?month : '0' + month;
            day = day > 9 ? day : '0' + day;
            return month+'/' + day + '/' + year;
        },
        getDayInMonth: function(year, month) {
            var allDay = 0;
            switch (parseInt(month)) {
                case 2:
                    if(year%400 === 0 || (year%4 === 0 && year%100 !== 0)) {
                        allDay = 29;
                    } else {
                         allDay = 28;
                    }
                    break;
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:
                     allDay = 31;
                     break;
                case 4:
                case 6:
                case 9:
                case 11:
                    allDay = 30;
                    break;
                }
            return allDay;
        },
        isBankCard: function(str) {
            //~ if(!str) return false;
            //~ if(str.match(__const.visa)) return true;
            //~ if(str.match(__const.masterCard)) return true;
            //~ if(str.match(__const.dinersClub)) return true;
            //~ if(str.match(__const.amex)) return true;
            //~ if(str.match(__const.discover)) return true;
            if(str.match(/^\d{16}$/)) return true;
            return false;
        },
        isIpad: function() {
             return $.browser.Ipad ? true : false
        },
        loading: function(loadingType) {
            loadingType = loadingType || 'big';
            if(loadingType == 'big') {
                $(this).html("<div class='loading' style='text-align:center'><img src='/images/loadingB.gif'/></div>");
            } else {
                $(this).html("<div class='loading' style='text-align:center'><img src='/images/loading.gif'/></div>");
            }
            $(this).show().find('.loading').css({width: $(this).width(), height:$(this).height()});
        },
        complete: function() {
            $(this).find('.loading').remove();
        },
        getJsonData: function(data) {
            if(typeof JSON.parse === 'function') {
                  try{
                         return  JSON.parse(decodeURIComponent(data));
                     } catch(e) {
                        __util.messageTip('数据信息出错');
                    }
            } else {
                 __util.loadJs('/js/json2.js', function() {
                     try{
                         return  JSON.parse(decodeURIComponent(data));
                     } catch(e) {
                        __util.messageTip('数据信息出错');
                    }
                });
            }
        },
        getParams: function() {
            var param = {},
                urlparam = location.search;
            if(urlparam) {
                urlparam = urlparam.toString().substring(1);
                var parameters = urlparam.split('&');
                for(var i =0, len = parameters.length; i < len; i++) {
                    param[ parameters[i].split('=')[0]] =  parameters[i].split('=')[1]
                }
            }
            return param;
        },
        rememberScrollTop: function(that) {
            if($.browser.msie) {
                $(that).data('scrollTop', $(that).scrollTop());
            }
        },
        enterCommit:function(input, btn, container) {
            var $input = $(input),
                $btn = $(btn);
            if($input.length && $btn.length) {
                if(container && $(container).length) {
                    $(container).find(input).keydown(function(ev){
                        var code = typeof ev.charCode == 'number' ? ev.charCode : ev.keyCode;
                        if(code == 13) {
                            $btn.click();
                        }
                    })
                } else {
                    $(document).on('keydown input', input, function(ev) {
                        var code = typeof ev.charCode == 'number' ? ev.charCode : ev.keyCode;
                        if(code == 13) {
                            $btn.click();
                        }
                    })
                }
            }
        },
        //获取文本框中选择文本
        getSelectText: function(el) {
            return typeof el.selectionStart == 'number' ? el.value.substring(el.selectionStart, el.selectionEnd) : document.selection.createRange().text;
        }
    }
