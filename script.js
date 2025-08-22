// Subtle light effects for mysterious ambiance
const canvas = document.getElementById('lightCanvas');
const ctx = canvas.getContext('2d');

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
initCanvas();
window.addEventListener('resize', initCanvas);

function drawLightBeams() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < 5; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let radius = Math.random() * 100 + 50;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
    }
    requestAnimationFrame(drawLightBeams);
}

drawLightBeams();

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
