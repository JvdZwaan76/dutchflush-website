// Animated space effects with moving particles and light bursts
const canvas = document.getElementById('spaceCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
const particleCount = 50;

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
initCanvas();
window.addEventListener('resize', initCanvas);

// Create particles for space animation
for (let i = 0; i < particleCount; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2
    });
}

// Light burst effect
function createLightBurst() {
    let burst = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 0,
        maxRadius: Math.random() * 100 + 50,
        opacity: 0.8
    };
    return burst;
}

let lightBursts = [];

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Animate particles
    particles.forEach((particle, index) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();

        // Occasionally adjust opacity for twinkling effect
        if (Math.random() < 0.01) {
            particle.opacity = Math.random() * 0.5 + 0.2;
        }
    });

    // Animate light bursts
    lightBursts = lightBursts.filter(burst => burst.opacity > 0);
    lightBursts.forEach((burst, index) => {
        ctx.beginPath();
        ctx.arc(burst.x, burst.y, burst.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${burst.opacity})`; // Gold light
        ctx.fill();

        burst.radius += 1;
        burst.opacity -= 0.005;

        if (burst.radius > burst.maxRadius) {
            lightBursts.splice(index, 1);
        }
    });

    // Randomly spawn new light bursts
    if (Math.random() < 0.02) {
        lightBursts.push(createLightBurst());
    }

    requestAnimationFrame(animate);
}

animate();

// Flip countdown timer (using existing logic)
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

var deadline = new Date('2026-08-21T00:00:00-07:00'); // Launch date
var c = new Clock(deadline, function() { console.log('Countdown complete'); });
