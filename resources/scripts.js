const wrapper = document.querySelector('.wrapper');
const road = document.querySelector('.road');
const speedometer = document.querySelector('.speedometer .speed');
const bg = document.querySelector('.bg');

let previousScrollY = 0;
let speed = 0;
let roadPosition = 0;
let bgPosition = 0;

function updateBackgroundPosition() {
  bgPosition += speed * 0.001;
  bg.style.backgroundPositionX = `${bgPosition}%`;
}

function updateRoadPosition() {
  roadPosition -= speed * 0.01;
  road.style.transform = `translateX(${roadPosition}%)`;

  // Add or remove road segments as needed
  const maxSegments = Math.ceil(wrapper.clientHeight / 100);
  while (road.children.length < maxSegments + 1) {
    const segment = document.createElement('div');
    segment.className = 'segment';
    road.appendChild(segment);
  }
  while (road.children.length > maxSegments + 1) {
    road.removeChild(road.children[0]);
  }

  // Reset road position to ensure it moves infinitely
  if (roadPosition <= -10) {
    roadPosition += 10;
    road.appendChild(road.firstElementChild);
  } else if (roadPosition > 0) {
    roadPosition -= 10;
    road.insertBefore(road.lastElementChild, road.firstElementChild);
  }
}

function updateSpeedometer(speed) {
  speedometer.textContent = speed.toFixed(0);
}

function handleScroll() {
  const deltaY = wrapper.scrollTop - previousScrollY;
  const scrollSpeed = deltaY * 0.01;

  speed = Math.max(0, Math.min(88, speed + scrollSpeed));
  updateSpeedometer(speed);

  previousScrollY = wrapper.scrollTop;
}


wrapper.addEventListener('scroll', handleScroll);

const fireCanvas = document.getElementById("fire-canvas");
const fireCtx = fireCanvas.getContext("2d");
const fireParticles = [];

for (let i = 0; i < 500; i++) {
  fireParticles.push({
    x: Math.random() * 500 + 500,
    y: Math.random() * -100 + 500,
    size: Math.random() * 3 + 2,
    color: [Math.floor(Math.random() * 255) + 50, Math.floor(Math.random() * 100), 0],
    alpha: 0.1,
  });
}

function drawFire() {
  fireCtx.clearRect(0, 0, fireCanvas.width, fireCanvas.height);

  for (let i = 0; i < fireParticles.length; i++) {
    const particle = fireParticles[i];
    fireCtx.beginPath();
    fireCtx.fillStyle = `rgba(${particle.color}, ${particle.alpha})`;
    fireCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    fireCtx.fill();

    particle.x -= Math.random() * 5; // move to the left
    particle.y -= Math.random() * 5; // move up
    particle.size -= 0.1;
    particle.alpha = Math.min(particle.alpha + 0.05, 1);

    if (particle.size <= 0) {
      particle.y = 500;
      particle.x = Math.random() * 500;
      particle.size = Math.random() * 3 + 2;
      particle.alpha = 0.0;
    }
  }
}

setInterval(drawFire, 50);

const delorean = document.getElementById("delorean");

function checkSpeed() {
  if (speed >= 88) {
    drawFire();
  } else {
    let allParticlesFaded = true;
    for (let i = 0; i < fireParticles.length; i++) {
      const particle = fireParticles[i];
      if (particle.alpha > 0) {
        particle.alpha = Math.max(0, particle.alpha - 0.05);
        allParticlesFaded = false;
      }
    }
    if (allParticlesFaded) {
      clearingCanvas = setTimeout(() => fireCtx.clearRect(0, 0, fireCanvas.width, fireCanvas.height), 100); // clear canvas after fade out
    }
  }
  
  updateRoadPosition();
  updateBackgroundPosition();
}

setInterval(checkSpeed, 50);
