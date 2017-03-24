var canvas = document.querySelector('#canvas'),
    ctx = canvas.getContext('2d'),

    winWidth = document.documentElement.clientWidth,
    winHeight = document.documentElement.clientHeight;

    canvas.width =  winWidth;
    canvas.height = winHeight;

    var halfWidth = canvas.width / 2,
        halfHeight;

    ctx.textBaseline = "top";
    ctx.fillStyle = "#fff";

    var rafId = null, finishCount = 0, isInput = false;

    var fontSize = 500,
        fontFamily = 'Helvetica Neue, Helvetica, Arial, sans-serif';

   setTimeout(function(){
        init();
   }, 0);

    document.querySelector('#btn').addEventListener('click', function(){
        isInput = true;
        init();
    });

    document.onkeydown = function(e){
        var event = e || window.event;
        var code = event.keyCode || event.which || event.charCode;
        if (code == 13) {
            init();
        }
    }

    var dotList = [];
    var historyDot = [];

    window.historyDot = historyDot;

    function init(){
        var s = 0;
        var input = document.querySelector('#txt');
        var l = input.value ? input.value : 'Hi';
        input.value = "";

        if(rafId) cancelAnimationFrame(rafId);

        setFontSize(fontSize);
        s = Math.min(fontSize,
            (canvas.width / ctx.measureText(l).width)  * fontSize,
            (canvas.height / fontSize) * (isNumber(l) ? 1 : 0.5) * fontSize);
        setFontSize(s);

        halfHeight = canvas.height / 2 - fontSize / 2;


        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillText(l, canvas.width / 2 - ctx.measureText(l).width / 2, halfHeight);


        historyDot = dotList;
        dotList = [];
        handleCanvas();
        draw2();
    }

    function setFontSize(s) {
        ctx.font = s + 'px ' + fontFamily;
    }
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function handleCanvas() {
        var imgW = canvas.width,
            imgH = canvas.height;

        var imgData = ctx.getImageData(0, 0, imgW, imgH);

        for(var x=0; x<imgData.width; x+=6) {
            for(var y=0; y<imgData.height; y+=6) {
                var i = (y*imgData.width + x) * 4;
                if(imgData.data[i+3] > 128 && imgData.data[i] > 250 && (imgData[i] == imgData[i+1] && imgData[i+1] == imgData[i+2])){
                    var dot = new Dot(x, y, 2);
                    dotList.push(dot);
                }
            }
        }
    }

    function Dot(centerX, centerY, radius) {
        this.x = centerX;
        this.y = centerY;
        this.radius = radius;
        this.frameNum = 0;
        this.frameCount =  Math.ceil(3000 / 16.66);
        this.sx = halfWidth;
        this.sy = winHeight / 2;
        this.delay = this.frameCount*Math.random();
        this.delayCount = 0;
        this.opacity = Math.random();
    }

    function easeInOutCubic(t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t + b;
        return c/2*((t-=2)*t*t + 2) + b;
    }

    function draw2(){
        ctx.clearRect(0, 0, winWidth, winHeight);

        var len = dotList.length,
            curDot = null,
            random = 0,
            curHistoryDot = null,
            frameNum = this.frameNum,
            frameCount = this.frameCount,
            curX, curY,
            finishCount = 0,
            curOpacity;

        for(var i=0; i<len; i++){
            curDot = dotList[i];
            //补充不足
            random = Math.floor(historyDot.length * Math.random());

            curHistoryDot = isInput ? historyDot[i] : null;

            frameNum = curDot.frameNum;
            frameCount = curDot.frameCount;

            if(curDot.delayCount < curDot.delay){
                curDot.delayCount ++;
                continue;
            }

            ctx.save();
            ctx.beginPath();

            if(frameNum < frameCount){
                var targetX = isInput && (curHistoryDot && curHistoryDot.x || historyDot[random].x) || curDot.sx,
                    targetY = isInput && (curHistoryDot && curHistoryDot.y || historyDot[random].y) || curDot.sy;

                curX = easeInOutCubic(frameNum,  targetX, curDot.x - targetX, curDot.frameCount);
                curY = easeInOutCubic(frameNum,  targetY, curDot.y - targetY, curDot.frameCount);

                ctx.arc(curX, curY, curDot.radius, 0, 2 * Math.PI);
                curDot.frameNum += 1;
            }else{
                ctx.arc(curDot.x, curDot.y, curDot.radius, 0, 2*Math.PI);
                finishCount ++;
            }

            ctx.fill();
            ctx.restore();

            if(finishCount > len){
                window.cancelAnimationFrame(rafId);
                return;
            }
        }

        rafId = window.requestAnimationFrame(draw2);
    }