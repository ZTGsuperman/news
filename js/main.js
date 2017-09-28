// JavaScript source code

var mv = {};
mv.app = {};
mv.tool = {};

window.onload = function () {

    mv.app.fRefresh()


    var myHandle=document.querySelector('.myhandle');
    var main=myHandle.querySelector('#main');
    var refresh = myHandle.querySelector('.refresh');
    var tip = refresh.getElementsByTagName('em')[0];

    var arr = ['A', 'B01', 'B02', 'B03', 'B04', 'B05', 'B06', 'B07', 'B08', 'B09', 'B010']
    var index = 0;
    var isRe = false;
    var downOff = false;
    var start = 10;
    mv.tool.myScroll({
        el: myHandle,
        dir: 'y',
        move: function (target) {
            if (target.y> 0) {
                tip.innerHTML = '松开刷新';
                isRe = true;
            }
            if (Math.abs(target.y) > Math.abs((myHandle.offsetHeight-main.offsetHeight))) {
                downOff = true;
            }
        },
        end: function (target) {
            if (isRe) {
                    tip.innerHTML = '正在刷新...';
                    index++;
                    index = index > refresh.length ? 0 : index;
                    mv.app.upRefresh(arr[index]);
                    isRe = false;
            }

            if (downOff) {
                start += 10;
                mv.app.downRefresh(start, downOff);
                downOff = false;
            }
        }
    })
}



//下拉刷新
mv.app.upRefresh = function (arr) {
    var oScrip = document.createElement('script');
    oScrip.src = 'http://3g.163.com/touch/jsonp/sy/recommend/0-9.html?hasad=1&loc=&miss=50&refresh='+arr+'&offset=0&size=10&callback=up';
    document.body.appendChild(oScrip);
}

function up(data) {
    var newList = document.querySelector('.news_list');
    var oLi = newList.getElementsByTagName('li');
    var main = document.getElementById('main');
    var refresh = main.querySelector('.refresh');
  

    var length = oLi.length > data.list.length ? data.list.length: oLi.length;
    if (data.code === 200) {
        for (var i = 0; i<length; i++) {
            if (data.list[i].addata === null) {
                var img = oLi[i].getElementsByTagName('img')[0];
                var title = oLi[i].getElementsByTagName('span')[0];
                var source = oLi[i].getElementsByTagName('em')[0];

                img.src = data.list[i].picInfo[0].url;
                title.innerHTML = data.list[i].title;
                source.innerHTML = data.list[i].source;
            }
        }
    }
}

//上拉加载
mv.app.downRefresh = function (start) {
   
    var oScrip = document.createElement('script');
    oScrip.src = 'http://3g.163.com/touch/jsonp/sy/recommend/'+start+'-10.html?hasad=1&miss=57&refresh=A&offset=0&size=10&callback=down';
    document.body.appendChild(oScrip);
}

function down(data) {
    mv.app.createLi(data)
}

//首次进入刷新新闻
mv.app.fRefresh = function () {
    var oScrip = document.createElement('script');
    oScrip.src = 'http://3g.163.com/touch/jsonp/sy/recommend/0-9.html?callback=getNews';
    document.body.appendChild(oScrip);
}

function getNews(data) {
    mv.app.getImg(data);
    mv.app.importent(data)
    mv.app.createLi(data)
}

mv.app.getImg = function (data) {
    var imgList = [
        {
                   title: '',
                   link: '',
                   url: ''
       },
    {
        title: '',
        link: '',
        url: ''
    },
    {
        title: '',
        link: '',
        url: ''
    },
    {
        title: '',
        link: '',
        url: ''
    },
    {
        title: '',
        link: '',
        url: ''
    },
    {
        title: '',
        link: '',
        url: ''
    },
    {
        title: '',
        link: '',
        url: ''
    },
    {
        title: '',
        link: '',
        url: ''
    },
    {
        title: '',
        link: '',
        url: ''
    },
    {
        title: '',
        link: '',
        url: ''
    },
    {
        title: '',
        link: '',
        url: ''
    },
    {
        title:'',
        link: '',
        url: ''
    },
    {
        title: '',
        link: '',
        url: ''
    },
    ];

        for (var i = 0; i < data.focus.length; i++) {
            if (data.focus[i].addata === null) {
                imgList[i].title = data.focus[i].title;
                imgList[i].link = data.focus[i].link;
                imgList[i].url = data.focus[i].picInfo[0].url;
            }
        }

        var oUl = document.querySelector('.img_news').getElementsByTagName('ul')[0];
        for (var i = 0; i < imgList.length; i++) {
            if (imgList[i].title != '') {
                var li = document.createElement('li');
                var a = document.createElement('a');
                var h5 = document.createElement('h5');

                a.href = imgList[i].link;
                h5.innerHTML = imgList[i].title;
                li.style.backgroundImage = 'url(' + imgList[i].url + ')';
                li.appendChild(a);
                li.appendChild(h5);
                oUl.appendChild(li);
            }
        }
        mv.app.changeImg();
}
mv.app.changeImg = function () {
    var imgNews = document.querySelector('.img_news')
    var oUl = imgNews.getElementsByTagName('ul')[0];
    var oLi = oUl.getElementsByTagName('li');

    var liW = oLi[0].offsetWidth;
    var iLength = oLi.length;

    css(oUl, 'width', liW * iLength)

    

    var lastPoint = 0;
    var dis = 0;
    var index = 0;
    var startL = 0;
    var startPoint = 0;
    oUl.addEventListener('touchstart', function (ev) {
        var touch = ev.changedTouches[0];
        lastPoint = touch.pageX;
        startPoint = touch.pageY;
        startL = css(oUl, 'translateX');
        oUl.style.transition = oUl.style.webkitTransition = 'none';
    })
    oUl.addEventListener('touchmove', function (ev) {
        var touch = ev.changedTouches[0];
        var nowPonit = touch.pageX;

        dis = nowPonit - lastPoint;
        var target = dis + css(oUl, 'translateX');
        if (target > 0) {
            target = 0;
        } else if (target < -(oUl.offsetWidth - liW)) {
            target = -(oUl.offsetWidth - liW);

        }
        css(oUl, 'translateX', target);
        lastPoint = nowPonit;
    })
    oUl.addEventListener('touchend', function (ev) {
        var touch = ev.changedTouches[0];
        var endPoint = touch.pageY;
        var endL = css(oUl, 'translateX');
        var moveX = Math.abs(endL - startL);
        if (dis < 0 && moveX > 20) {
            index++;
            index = Math.min(iLength - 1, index);
        } else if (dis > 0 && moveX > 20) {
            index--;
            index = Math.max(0, index);
        }
        oUl.style.transition = oUl.style.webkitTransition = '0.3s';
        css(oUl, 'translateX', -index * liW);
        if (endPoint - startPoint < 10) {
            ev.stopPropagation();
        }
    })

    for (var i = 0; i < iLength; i++) {
        mv.tool.tab(oLi[i], function () {
            mv.tool.openHref(this)
        })
    }
    setTimeout(function () {
        mv.tool.autoChange(oUl, 'x')
    }, 6000)
}
mv.app.importent = function (data) {
    var importent = document.querySelector('.importent');
    var total = importent.querySelector('.total')
    var oL = importent.getElementsByTagName('ol')[0];
    var num = 0;
    for (var i = 0; i < data.news.length; i++) {
        if (data.news[i].addata === null) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            num++;
            a.href = data.news[i].link;
            a.innerHTML = data.news[i].title;
            li.appendChild(a);
            oL.appendChild(li);
        }
    }
    total.innerHTML = num;

    setTimeout(function () {
        mv.tool.autoChange(oL,'y')

    }, 1000)

}

mv.app.createLi = function (data) {
    var newList = document.querySelector('.news_list');
    var oUl = newList.getElementsByTagName('ul')[0];
   
        for (var i = 0; i < data.list.length; i++) {
            if (data.list[i].addata === null) {
                var li = document.createElement('li');
                var img = document.createElement('img');
                var div = document.createElement('div');
                var span = document.createElement('span');
                var em = document.createElement('em');
                var a = document.createElement('a');

                a.href = data.list[i].link;
                li.appendChild(a)
                img.src = data.list[i].picInfo[0].url;
                li.appendChild(img);
                addClass(div, 'mews_text');
                span.innerHTML = data.list[i].title;
                em.innerHTML = data.list[i].source;
                div.appendChild(span);
                div.appendChild(em);
                li.appendChild(div)
                oUl.appendChild(li);
            }
        }

     /*   oUl.addEventListener('touchstart', function (ev) {
            var target = ev.srcElement || ev.target;
            console.log(target.parentNode.parentNode)
            mv.tool.tab(target.parentNode.parentNode, function () {
                mv.tool.openHref(target.parentNode.parentNode)
            })
        })
  */
        var oLi = oUl.getElementsByTagName('li');
        for (var i = 0; i < oLi.length; i++) {
            mv.tool.tab(oLi[i], function () {
                mv.tool.openHref(this)
            })
        }

}

mv.tool.tab = function (el, fn) {
    var startPoint = {};
    el.addEventListener('touchstart', function (e) {
        var touch = e.changedTouches[0];
        startPoint = {
            x: touch.pageX,
            y: touch.pageY
        }
    });
    el.addEventListener('touchend', function (e) {
        var touch = e.changedTouches[0];
        var nowPoint = {
            x: touch.pageX,
            y: touch.pageY
        };
        var dis = {
            x: Math.abs(nowPoint.x - startPoint.x),
            y: Math.abs(nowPoint.y - startPoint.y)
        }
        if (dis.x < 5 && dis.y < 5) {
            fn.call(el, e);
        }
    });
}

mv.tool.myScroll = function (init) {
    var swiper = init.el.children[0];
    var startPoint = {};
    var startEl = {};
    var lastPoint = {};
    var dir = init.dir;
    var max = {
        x: parseInt(css(init.el, "width") - css(swiper, "width")),
        y: parseInt(css(init.el, "height") - css(swiper, "height"))
    };

    var translate = {
        x: "translateX",
        y: "translateY"
    };
    var isMove = {
        x: false,
        y: false
    };

    var offset = {
        x: 'offsetWidth',
        y: 'offsetHeight',
    }
    var isFrist = true;//记录这是第一次滑动 
    
    css(swiper, translate[dir], 0);
    init.el.addEventListener('touchstart', function (e) {
        init.start && init.start();
        var touch = e.changedTouches[0]

        startPoint = {
            x: Math.round(touch.pageX),
            y: Math.round(touch.pageY)
        };
        lastPoint = {
            x: startPoint.x,
            y: startPoint.y
        };
        startEl = {
            x: css(swiper, "translateX"),
            y: css(swiper, "translateY")
        };

        max = {
            x: parseInt(css(init.el, "width") - css(swiper, "width")),
            y: parseInt(css(init.el, "height") - css(swiper, "height"))
        }
       
    });
    init.el.addEventListener('touchmove', function (e) {
        var touch = e.changedTouches[0];
        var nowPoint = {
            x: Math.round(touch.pageX),
            y: Math.round(touch.pageY)
        }
        var dis = {
            x: nowPoint.x - startPoint.x,
            y: nowPoint.y - startPoint.y
        }
        /* 这个判断只在我手指按下时，第一次move时才会执行 */
        if (Math.abs(dis.x) - Math.abs(dis.y) > 2 && isFrist) {
            isMove.x = true;
            isFrist = false;
        } else if (Math.abs(dis.y) - Math.abs(dis.x) > 2 && isFrist) {
            isMove.y = true;
            isFrist = false;
        }
        var target = {};
        target[dir] = dis[dir] + startEl[dir];
        isMove[dir] && css(swiper, translate[dir], target[dir]);
        lastPoint.x = nowPoint.x;
        lastPoint.y = nowPoint.y;
        init.move && init.move(target);
    });

    init.el.addEventListener('touchend', function (e) {
       
        if (lastPoint.x == startPoint.x && lastPoint.y == startPoint.y) {
            return;
        }
        var now = css(swiper, translate[dir]);
        if (now < max[dir]) {
            now = max[dir];
        } else if (now > 0) {
            now = 0;
        }
        var target = {};
        target[translate[dir]] = now;

        MTween({
            el: swiper,
            target: target,
            type: "easeOut",
            time: 300
        });
        isMove = {
            x: false,
            y: false
        }
        isFrist = true;
        init.end && init.end();
    });

}

mv.tool.openHref = function (obj) {
    var url = obj.getElementsByTagName('a')[0];
    window.location.href = url.href;
}
mv.tool.autoChange = function (obj,dir) {
    var el = obj.children;
    var length = el.length;
    var num = 0;
    var num2 = 0;
    var offset = {
        x: 'offsetWidth',
        y: 'offsetHeight',
    }
    var translate={
        x:'translateX',
        y:'translateY',
    }
    clearInterval(obj.timer)
    
    var moveDis = 0;
   
    moveDis = dir === 'x' ? el[0].offsetWidth : el[0].offsetHeight;

    obj.timer = setInterval(function () {
        if (num === length - 1) {
            el[0].style.position = 'relative';
            css(el[0], translate[dir], length * moveDis);
            num = 0;
        } else {
            num++;
        }
        num2++;
        obj.style.transition = '0.6s';
        css(obj, translate[dir], -num2 * moveDis);
        obj.addEventListener('webkitTransitionEnd', function () {
            if (num === 0) {
                obj.style.transition = '0s';
                el[0].style.position = 'static';
                css(el[0], translate[dir],0);
                css(obj, translate[dir], 0);
                num2=0
            }
        })
    }, 5000)
}



















