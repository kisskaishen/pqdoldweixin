import $ from 'webpack-zepto';

module.exports = function(options) {
    var lazyPic = {
        lazy_delay: null,
        wd: $(window),
        startLoad: function(el) {
            el.attr('src', el.attr('data-src'));
            el.attr('lazy', 'loaded');
        },
        initLoad: function() {
            var self_ = this;
            clearTimeout(self_.lazy_delay);
            self_.lazy_delay = setTimeout(function() {
                $("[lazy='true']").each(function() {
                    var this_pic = $(this);
                    self_.startLoad(this_pic);
                });
            }, 300)
        },
        scrollLoad: function() {
            var self_ = this;
            clearTimeout(self_.lazy_delay);
            self_.lazy_delay = setTimeout(function() {
                $("[lazy='true']").each(function() {
                    var this_pic = $(this);
                    self_.startLoad(this_pic);
                });
            }, 300);
        }
    };
    if ((typeof options) == "object") {
        var wrap = options.wrap;
        var group = options.group;
        var hintBar = options.hintBar;
        var scrollDelay = null;
        var loadDelay = null;

        function startLoad() {
            // hintBar.html('正在加载...');
            clearTimeout(loadDelay)
            if (typeof options.callback === 'function' && options.callback) {
                (options.callback)();
            };
            // hintBar.html('上拉加载更多');
        };
        function scrolling() {
            clearTimeout(scrollDelay);
            scrollDelay = setTimeout(function() {
                var scrollHeight = $(document).scrollTop() || $('body').scrollTop() || $(window).scrollTop();
                if (scrollHeight >= ($('body').height() - $(window).height() * 4) && scrollHeight > 0) {
                    console.log(1);
                    startLoad();
                } else {
                    return;
                };
            }, 100);
            lazyPic.scrollLoad();
        };
        lazyPic.initLoad();
        $(window).unbind('scroll').bind('scroll', scrolling);
    } else {
        return lazyPic;
    }
};
