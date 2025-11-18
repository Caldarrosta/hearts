// Enhanced main.js with fade transitions, indicators, slide-in animations, and video support

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

const TYPING_SPEED = 40;
const HEART_FALL_COUNT = 100;

window.addEventListener("DOMContentLoaded", () => { main(); });

let data;
let greetingEl;
let openGalleryBtn;
let welcomeScreen;
let galleryScreen;
let galleryIndex = 0;
let imageWrapper;
let captionEl;
let prevBtn;
let nextBtn;
let heartsLayer;
let indicatorsContainer;

function main() {
    return __awaiter(this, void 0, void 0, function* () {
        data = yield getData();

        greetingEl = document.getElementById('greeting');
        openGalleryBtn = document.getElementById('openGalleryBtn');
        welcomeScreen = document.getElementById('welcomeScreen');
        galleryScreen = document.getElementById('galleryScreen');
        imageWrapper = document.getElementById('imageWrapper');
        captionEl = document.getElementById('caption');
        prevBtn = document.getElementById('prevBtn');
        nextBtn = document.getElementById('nextBtn');
        heartsLayer = document.getElementById('heartsLayer');

        openGalleryBtn.addEventListener('click', showGallery);

        prevBtn.addEventListener('click', () => showImage(galleryIndex - 1));
        nextBtn.addEventListener('click', () => showImage(galleryIndex + 1));

        imageWrapper.addEventListener("dblclick", () => launchHearts(HEART_FALL_COUNT));

        addSwipeSupport();
        createIndicators();

        typeText(data.text, onTypingComplete);
    });
}

function getData() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("data.json");
        if (!response.ok) return;
        return yield response.json();
    });
}

function typeText(text, onComplete) {
    greetingEl.textContent = '';
    let index = 0;
    const timer = setInterval(() => {
        greetingEl.textContent = text.slice(0, ++index);
        if (index >= text.length) {
            clearInterval(timer);
            onComplete?.();
        }
    }, TYPING_SPEED);
}

function onTypingComplete() {
    openGalleryBtn.style.display = 'inline-flex';
    openGalleryBtn.animate([
        { transform: 'scale(0.6)', opacity: 0 },
        { transform: 'scale(1)', opacity: 1 }
    ], { duration: 320, easing: 'cubic-bezier(.2,.9,.2,1)' });
}

function showGallery() {
    welcomeScreen.setAttribute('aria-hidden', 'true');
    galleryScreen.setAttribute('aria-hidden', 'false');
    galleryScreen.classList.add('active');
    showImage(0);
}

function showImage(i) {
    if (!data.images.length) return;

    galleryIndex = ((i % data.images.length) + data.images.length) % data.images.length;
    const item = data.images[galleryIndex];

    updateIndicators();

    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.inset = 0;
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.animation = 'slideIn 0.45s ease forwards, fadeIn 0.45s ease forwards';

    imageWrapper.innerHTML = '';
    imageWrapper.appendChild(container);

    if (item.type === "video") {
        const video = document.createElement("video");
        video.src = item.file;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.controls = false;
        video.style.maxWidth = "100%";
        video.style.maxHeight = "100%";
        video.style.objectFit = "contain";
        container.appendChild(video);
    } else {
        const img = new Image();
        img.src = item.file;
        img.loading = "lazy";
        img.alt = item.caption || '';
        img.style.maxWidth = "100%";
        img.style.maxHeight = "100%";
        container.appendChild(img);
    }

    captionEl.textContent = item.caption || '';
}

function createIndicators() {
    indicatorsContainer = document.createElement('div');
    indicatorsContainer.style.display = 'flex';
    indicatorsContainer.style.gap = '8px';
    indicatorsContainer.style.position = 'absolute';
    indicatorsContainer.style.bottom = '20px';
    indicatorsContainer.style.left = '50%';
    indicatorsContainer.style.transform = 'translateX(-50%)';

    data.images.forEach(() => {
        const dot = document.createElement('div');
        dot.style.width = '10px';
        dot.style.height = '10px';
        dot.style.borderRadius = '50%';
        dot.style.background = 'rgba(255,255,255,0.3)';
        indicatorsContainer.appendChild(dot);
    });

    galleryScreen.appendChild(indicatorsContainer);
}

function updateIndicators() {
    const dots = indicatorsContainer.children;
    for (let i = 0; i < dots.length; i++) {
        dots[i].style.background = i === galleryIndex ? 'white' : 'rgba(255,255,255,0.3)';
    }
}

function addSwipeSupport() {
    let startX = null;
    let startTime = 0;
    const carousel = document.getElementById('carousel');

    carousel.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        startTime = Date.now();
    }, { passive: true });

    carousel.addEventListener('touchend', e => {
        if (startX === null) return;
        const dx = e.changedTouches[0].clientX - startX;
        const dt = Date.now() - startTime;
        startX = null;

        if (Math.abs(dx) > 40 && dt < 600) {
            dx < 0 ? showImage(galleryIndex + 1) : showImage(galleryIndex - 1);
        }
    }, { passive: true });
}

function launchHearts(n) {
    for (let k = 0; k < n; k++) createFallingHeart();
    setTimeout(() => { for (let k = 0; k < n; k++) createFallingHeart(); }, 1000);
    setTimeout(() => { heartsLayer.innerHTML = ''; }, 6500);
}

function createFallingHeart() {
    const el = document.createElement('div');
    el.className = 'falling-heart';
    el.innerText = '❤️';
    heartsLayer.appendChild(el);
}
