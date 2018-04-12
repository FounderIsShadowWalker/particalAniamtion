var can = document.querySelector('canvas'),
    ctx = can.getContext('2d'),
    w = can.width = window.innerWidth,
    h = can.height = window.innerHeight;


ctx.lineWidth = 10;

var elephantAlpa = 1;
var elephantAlpaPhase = 0;
var rand = function (max, min, _int) {
    var max = (max === 0 || max) ? max : 1,
        min = min || 0,
        gen = min + (max - min) * Math.random();

    return (_int) ? Math.round(gen) : gen;
};

function drawElephant() {
    ctx.save();


    if (elephantAlpa <= 0.2) {
        elephantAlpaPhase = 1;
    }
    if (elephantAlpa >= 1) {
        elephantAlpaPhase = 0;
    }

    if (elephantAlpaPhase == 0 && elephantAlpa > 0.2) {
        elephantAlpa -= 0.05;
    }

    if (elephantAlpaPhase == 1 && elephantAlpa < 1) {
        elephantAlpa += 0.05;
    }

    ctx.strokeStyle = 'rgba(255, 255, 255,' + elephantAlpa + ')';

    ctx.translate(-130, 190);

    ctx.beginPath();
    ctx.moveTo(w / 2, h / 2);
    ctx.lineTo(w / 2, h / 2 - 130);
    ctx.stroke();


    ctx.beginPath();
    ctx.arc(w / 2 + 60, h / 2 - 130, 60, Math.PI, 2 * Math.PI);
    ctx.stroke();


    ctx.beginPath();
    ctx.moveTo(w / 2 + 120, h / 2 - 160);
    ctx.lineTo(w / 2 + 120, h / 2);
    ctx.stroke();



    ctx.beginPath();
    ctx.arc(w / 2 + 180, h / 2 - 160, 60, Math.PI, 2 * Math.PI);
    ctx.lineTo(w / 2 + 240, h / 2 - 70);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(w / 2 + 265, h / 2 - 70, 25, -Math.PI / 12, Math.PI);
    ctx.stroke();


    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "rgba(255, 255, 255, 0.2)";

    ctx.beginPath();
    ctx.arc(w / 2 + 180, h / 2 - 180, 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.restore();
}


var N_PARTICLES = 256,
    particles = [],
    source = {},
    t = 0;

var Particle = function () {
    var r, fill, pos, v, a, delay = rand(N_PARTICLES, 0, 1);

    this.active = false;

    this.shoot = function () {
        var angle, angle_var, val, hue = rand(360, 0, 1);

        if (t - delay) {
            this.active = true;
            r = rand(3, 1, 1);
            pos = { 'x': source.x, 'y': source.y + r };
            a = { 'x': -.1 / r, 'y': .9 + .1 / r };
            angle = rand(Math.PI / 10, -Math.PI / 10) - Math.PI / 2;
            val = rand(h / 28, h / 55);
            v = {
                'x': val * Math.cos(angle),
                'y': val * Math.sin(angle)
            };
            fill = 'hsla(' + hue + ', 100%, 50%, 1)';
        }
    }

    this.motionUpdate = function () {

        v.x = v.x / Math.abs(v.x) * (Math.abs(v.x) + a.x);
        v.y += a.y;
        pos.x += Math.round(v.x);
        pos.y += Math.round(v.y);

        if (pos.y > h + r) {
            pos = { 'x': source.x, 'y': source.y + r };
            this.active = false;
        }
    }

    this.draw = function (ctx) {
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        this.motionUpdate();
    };
}


var initCanvas = function () {
    source = { 'x': Math.round(w / 2 + 290 - 130), y: h / 2 - 85 + 190 };

    for (var i = 0; i < N_PARTICLES; i++) {
        particles.push(new Particle(i));
    }

    drawOnCanvas();
}

var drawOnCanvas = function () {
    ctx.fillStyle = 'hsla(230, 25%, 5%, .2)';
    ctx.rect(0, 0, w, h);
    ctx.fill();
    drawElephant();

    for (var i = 0; i < N_PARTICLES; i++) {
        if (particles[i].active) {
            particles[i].draw(ctx);
        }
        else {
            particles[i].shoot(ctx);
        }
    }

    t++;

    requestAnimationFrame(drawOnCanvas);
};

initCanvas();





