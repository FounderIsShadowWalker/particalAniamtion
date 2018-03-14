'use strict';

var canvas = document.querySelector('canvas'),
    ctx = canvas.getContext('2d'),
    w = canvas.width = window.innerWidth,
    h = canvas.height = window.innerHeight,
    hue = 217;

function random(min, max) {
    if (arguments.length < 2) {
        max = min;
        min = 0;
    }

    if (min > max) {
        var hold = max;
        max = min;
        min = hold;
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
}


var Render = {
    startCount: 100,
    grassCount: 100,
    grassList: [],
    starList: [],
    radius: 50,
    LampList: [],
    MoonList: [],
    cacheCanvas: {
        star: (function () {
            var canvas2 = document.createElement('canvas'),
                ctx2 = canvas2.getContext('2d');
            canvas2.width = 100;
            canvas2.height = 100;
            var half = canvas2.width / 2,
                gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
            gradient2.addColorStop(0.025, '#fff');
            gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
            gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
            gradient2.addColorStop(1, 'transparent');

            ctx2.fillStyle = gradient2;
            ctx2.beginPath();
            ctx2.arc(half, half, half, 0, Math.PI * 2);
            ctx2.fill();
            return canvas2;
        }()),
        lamp: (function () {
            var canvas2 = document.createElement('canvas'),
                ctx2 = canvas2.getContext('2d');
            canvas2.width = 200;
            canvas2.height = 200;
            var half = canvas2.width / 2,
                gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
            gradient2.addColorStop(0.025, '#fff');
            gradient2.addColorStop(0.1, 'rgba(255, 255,0, 0.7)');
            gradient2.addColorStop(0.5, 'hsl(' + hue + ', 64%, 6%)');
            gradient2.addColorStop(1, 'transparent');

            ctx2.fillStyle = gradient2;
            ctx2.beginPath();
            ctx2.arc(half, half, half, 0, Math.PI * 2);
            ctx2.fill();
            return canvas2;
        }())
    },
    init: function () {
        for (var i = 0; i < this.startCount; i++) {
            this.starList.push(new Star(random(w), random(0, h), this.radius));
        }
        for (var i = 0; i < this.grassCount; i++) {
            this.grassList.push(new Grass(random(w), h));
        }

        this.LampList.push(new Lamp(w - 100, h));

        this.MoonList.push(new Moon(80, 80));

        this.drawFigure();
    },
    drawFigure: function () {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 1)';

        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'lighter';
        for (var i = 0; i < this.starList.length; i++) {
            if (this.starList[i].draw()) {
                this.starList.splice(i, 1);
                this.starList.push(new Star(random(w), random(h), this.radius, 1));
            }
        }

        for (var i = 0; i < this.grassList.length; i++) {
            this.grassList[i].draw();
        }

        for (var i = 0; i < this.LampList.length; i++) {
            this.LampList[i].draw();
        }

        for (var i = 0; i < this.MoonList.length; i++) {
            this.MoonList[i].draw();
        }

        requestAnimationFrame(this.drawFigure.bind(this));
    }
}

var Star = function (x, y, radius, alpha) {
    this.x = x;
    this.y = y;
    this.radius = random(60, w / 1.5) / 12;
    this.alpha = this.alpha || 1;
}

Star.prototype.draw = function () {
    this.x = this.x + 0.5 * Math.random() * Math.random();

    var twinkle = random(10);

    if (twinkle === 1 && this.alpha < 0) {
        this.alpha += 0.05;
    }
    if (twinkle === 2 && this.alpha > 1) {
        this.alpha -= 0.05;
    }
    ctx.globalAlpha = this.alpha;
    ctx.drawImage(Render.cacheCanvas.star, this.x - this.radius / 2, this.y - this.radius / 2, this.radius, this.radius);
    return this.x > w || this.y > h ? true : false
}


var Grass = function (x, y) {
    this.x = x;
    this.y = y;
    this.radius = 50;
    this.theta = random(-Math.PI / 60, Math.PI / 60);
    this.deltaTheta = Math.PI / 600 * Math.random() / 2;
    this.height = -70 - 30 * Math.random();
}

Grass.prototype = {
    color: 'green',
    draw: function () {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.theta);
        ctx.globalCompositeOperation = 'source-over';
        ctx.moveTo(1, 10);
        ctx.lineTo(10, 10);
        ctx.quadraticCurveTo(10, this.height, -25, this.height);
        ctx.quadraticCurveTo(7, this.height + 4, 1, 10);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(5, 10);
        ctx.lineTo(13, 10);
        ctx.quadraticCurveTo(13, this.height, 38, this.height);
        ctx.quadraticCurveTo(6, this.height + 4, 5, 10);
        ctx.fill();


        this.theta += this.deltaTheta;

        if (this.theta > Math.PI / 6 || this.theta < -Math.PI / 6) {
            this.deltaTheta = this.deltaTheta * -1;
        }

        ctx.restore();
    }
}

function Lamp(x, y) {
    this.x = x;
    this.y = y;
    this.alpha = 1;
}

Lamp.prototype = {
    draw: function () {
        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.lineWidth = '5';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.moveTo(this.x - 10, this.y);
        ctx.lineTo(this.x - 10, this.y - 250);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x - 20, this.y - 250, 10, -Math.PI / 3, 0);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.x - 20 + 10 * Math.cos(Math.PI / 6), this.y - 250 - 13 * Math.sin(Math.PI / 6));
        ctx.lineTo(this.x - 100, this.y - 300);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = '8';
        ctx.moveTo(this.x - 95, this.y - 292);
        ctx.lineTo(this.x - 60, this.y - 277);
        ctx.stroke();

        ctx.lineWidth = '2';
        ctx.fillStyle = 'yellow';
        ctx.moveTo(this.x - 95, this.y - 290);
        ctx.lineTo(this.x - 95, this.y - 277);
        ctx.lineTo(this.x - 75, this.y - 268);
        ctx.lineTo(this.x - 60, this.y - 275);
        ctx.lineTo(this.x - 95, this.y - 290)
        ctx.fill();

        if (this.alpha > 1) {
            this.alpha -= 0.05;
        }
        if (this.alpha < 0.5) {
            this.alpha += 0.05;
        }
        ctx.globalAlpha = this.alpha;
        ctx.globalCompositeOperation = 'lighter';
        ctx.drawImage(Render.cacheCanvas.lamp, this.x - 81 - 100, this.y - 278 - 100, 200, 200);
    }
}

function Moon(x, y) {
    this.x = x;
    this.y = y;
    this.alpha = 1;
}

Moon.prototype.draw = function () {
    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath();
    ctx.save();
    ctx.fillStyle = 'yellow';
    ctx.moveTo(this.x - 10, this.y + 40);
    ctx.quadraticCurveTo(this.x + 50, this.y, this.x, this.y - 40);
    ctx.quadraticCurveTo(this.x + 15, this.y, this.x - 10, this.y + 40);
    ctx.stroke();
    ctx.shadowColor = "white";
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 15;

    if (this.alpha > 1) {
        this.alpha -= 0.05;
    }
    if (this.alpha < 0.5) {
        this.alpha += 0.05;
    }
    ctx.globalAlpha = this.alpha;

    ctx.fill();
    ctx.restore();

}

Render.init();