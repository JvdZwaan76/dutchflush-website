// Enhanced animated space effects with moving stars, nebulae, light bursts, and cosmic dust
const canvas = document.getElementById('spaceCanvas');
const ctx = canvas.getContext('2d');
let stars = [];
const starCount = 250; // Increased for more density
let nebulae = [];
const nebulaCount = 8; // Increased for richer effect
let lightBursts = [];
let cosmicDust = [];
const dustCount = 150; // Increased cosmic dust

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
initCanvas();
window.addEventListener('resize', initCanvas);

// Create stars
for (let i = 0; i < starCount; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.4 + 0.1,
        opacity: Math.random() * 0.7 + 0.2
    });
}

// Create nebulae
for (let i = 0; i < nebulaCount; i++) {
    nebulae.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 300 + 200,
        hue: Math.floor(Math.random() * 30) + 200,
        opacity: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 0.05 - 0.025
    });
}

// Create cosmic dust
for (let i = 0; i < dustCount; i++) {
    cosmicDust.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 0.8 + 0.2,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1
    });
}

// Light burst effect
function createLightBurst() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 0,
        maxRadius: Math.random() * 150 + 80,
        opacity: 0.6
    };
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Animate stars
    stars.forEach((star) => {
        star.x += star.speed;
        if (star.x > canvas.width) star.x = 0;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        if (Math.random() < 0.01) {
            star.opacity = Math.random() * 0.7 + 0.2; // Twinkling effect
        }
    });

    // Animate nebulae with slight movement
    nebulae.forEach((nebula) => {
        nebula.x += nebula.speed;
        if (nebula.x < 0 || nebula.x > canvas.width) nebula.speed *= -1;
        const gradient = ctx.createRadialGradient(nebula.x, nebula.y, 0, nebula.x, nebula.y, nebula.radius);
        gradient.addColorStop(0, `hsla(${nebula.hue}, 70%, 30%, ${nebula.opacity})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    // Animate cosmic dust
    cosmicDust.forEach((dust) => {
        dust.x += dust.speedX;
        dust.y += dust.speedY;
        if (dust.x < 0 || dust.x > canvas.width) dust.speedX *= -1;
        if (dust.y < 0 || dust.y > canvas.height) dust.speedY *= -1;
        ctx.beginPath();
        ctx.arc(dust.x, dust.y, dust.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(209, 196, 233, ${dust.opacity})`; // Lavender dust
        ctx.fill();
    });

    // Animate light bursts
    lightBursts = lightBursts.filter(burst => burst.opacity > 0);
    lightBursts.forEach((burst, index) => {
        ctx.beginPath();
        ctx.arc(burst.x, burst.y, burst.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${burst.opacity})`; // Subtle gold
        ctx.fill();

        burst.radius += 1.5;
        burst.opacity -= 0.008;

        if (burst.radius > burst.maxRadius) {
            lightBursts.splice(index, 1);
        }
    });

    // Randomly spawn new light bursts
    if (Math.random() < 0.006) {
        lightBursts.push(createLightBurst());
    }

    requestAnimationFrame(animate);
}

animate();

// Flip countdown timer with downward flipping
function CountdownTracker(label, value) {
    var el = document.createElement('span');
    el.className = 'flip-clock__piece';
    el.innerHTML = '<span class="flip-clock__card card"><span class="card__top"></span><span class="card__bottom"></span><span class="card__back"><span class="card__bottom"></span></span></span>' +
        (label === 'Days' ? '<span class="flip-clock__slot">' + label + '</span>' : ''); // Only show Days label
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
        'Seconds': Math.floor((t / 1000) % 60) // Kept for countdown accuracy
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
        if (key === 'Total' || key === 'Hours' || key === 'Minutes' || key === 'Seconds') continue; // Exclude all but Days
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

// Set deadline to one year from today (August 21, 2025, 09:34 PM PDT)
var today = new Date('2025-08-21T21:34:00-07:00');
var deadline = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000); // One year from now
var c = new Clock(deadline, function() { console.log('Countdown complete'); });
