// Fireworks background animation (mysterious with blue/purple/gold tones)
const max_fireworks = 5, max_sparks = 50;
let canvas = document.getElementById('myCanvas');
let context = canvas.getContext('2d');
let fireworks = [];

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
initCanvas();
window.addEventListener('resize', initCanvas);

for (let i = 0; i < max_fireworks; i++) {
    let firework = { sparks: [] };
    for (let n = 0; n < max_sparks; n++) {
        let spark = {
            vx: Math.random() * 5 + 0.5,
            vy: Math.random() * 5 + 0.5,
            weight: Math.random() * 0.3 + 0.03,
            hue: Math.floor(Math.random() * 60) + 200 // Blues and purples (hue 200-260)
        };
        if (Math.random() > 0.5) spark.vx = -spark.vx;
        if (Math.random() > 0.5) spark.vy = -spark.vy;
        firework.sparks.push(spark);
    }
    fireworks.push(firework);
    resetFirework(firework);
}
window.requestAnimationFrame(explode);

function resetFirework(firework) {
    firework.x = Math.floor(Math.random() * canvas.width);
    firework.y = canvas.height;
    firework.age = 0;
    firework.phase = 'fly';
}

function explode() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    fireworks.forEach((firework) => {
        if (firework.phase === 'explode') {
            firework.sparks.forEach((spark) => {
                for (let i = 0; i < 10; i++) {
                    let trailAge = firework.age + i;
                    let x = firework.x + spark.vx * trailAge;
                    let y = firework.y + spark.vy * trailAge + spark.weight * trailAge * spark.weight * trailAge;
                    let fade = i * 20 - firework.age * 2;
                    let alpha = fade / 200;
                    context.beginPath();
                    context.fillStyle = `hsla(${spark.hue}, 80%, 50%, ${alpha})`; // Mysterious hues
                    context.rect(x, y, 4, 4);
                    context.fill();
                }
            });
            firework.age++;
            if (firework.age > 100 && Math.random() < 0.05) {
                resetFirework(firework);
            }
        } else {
            firework.y -= 10;
            for (let spark = 0; spark < 15; spark++) {
                context.beginPath();
                context.fillStyle = `hsla(${Math.random() * 60 + 200}, 80%, 50%, 1)`;
                context.rect(firework.x + Math.random() * spark - spark / 2, firework.y + spark * 4, 4, 4);
                context.fill();
            }
            if (Math.random() < 0.001 || firework.y < 200) firework.phase = 'explode';
        }
    });
    window.requestAnimationFrame(explode);
}

// Flip countdown timer
function CountdownTracker(label, value) {
    var el = document.createElement('span');
    el.className = 'flip-clock__piece';
    el.innerHTML = '<span class="flip-clock__card card"><span class="card__top"></span><span class="card__bottom"></span><span class="card__back"><span class="card__bottom"></span></span></span>' +
        '<span class="flip-clock__slot">' + label + '</span>';
    this.el = el;
    var top = el.querySelector('.card__top'),
        bottom = el.querySelector('.card__bottom'),
        back = el.querySelector('.card__back'),
        backBottom = el.querySelector('.card__back .card__bottom');
    this.update = function(val) {
        val = ('0' + val).slice(-2);
        if (val !== this.currentValue) {
            if (this.currentValue >= 0) {
                back.setAttribute('data-value', this.currentValue);
                bottom.setAttribute('data-value', this.currentValue);
            }
            this.currentValue = val;
            top.innerText = this.currentValue;
            backBottom.setAttribute('data-value', this.currentValue);
            this.el.classList.remove('flip');
            void this.el.offsetWidth;
            this.el.classList.add('flip');
        }
    }
    this.update(value);
}

function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    return {
        'Total': t,
        'Days': Math.floor(t / (1000 * 60 * 60 * 24)),
        'Hours': Math.floor((t / (1000 * 60 * 60)) % 24),
        'Minutes': Math.floor((t / 1000 / 60) % 60),
        'Seconds': Math.floor((t / 1000) % 60)
    };
}

function Clock(countdown, callback) {
    callback = callback || function() {};
    this.el = document.querySelector('.flip-clock');
    var trackers = {},
        t = getTimeRemaining(countdown),
        key,
        timeinterval;
    for (key in t) {
        if (key === 'Total') continue;
        trackers[key] = new CountdownTracker(key, t[key]);
        this.el.appendChild(trackers[key].el);
    }
    var i = 0;
    function updateClock() {
        timeinterval = requestAnimationFrame(updateClock);
        if (i++ % 10) return;
        var t = getTimeRemaining(countdown);
        if (t.Total < 0) {
            cancelAnimationFrame(timeinterval);
            for (key in trackers) trackers[key].update(0);
            callback();
            return;
        }
        for (key in trackers) trackers[key].update(t[key]);
    }
    setTimeout(updateClock, 500);
}

var deadline = new Date(Date.parse(new Date()) + 365 * 24 * 60 * 60 * 1000);
var c = new Clock(deadline, function() { console.log('Countdown complete'); });
