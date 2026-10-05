/* Shared Antigravity Script for Usha Birthday Pages */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initAudio();
  initStepDots();
  initPhotoLightboxes();
});

// Particle system (floating hearts & stars)
function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const heartShapes = ['❤️', '💖', '✨', '🌹', '💕'];

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 50;
      this.size = Math.random() * 16 + 12;
      this.speedY = Math.random() * 1.5 + 0.5;
      this.speedX = Math.sin(Math.random() * Math.PI) * 0.8;
      this.opacity = Math.random() * 0.6 + 0.4;
      this.char = heartShapes[Math.floor(Math.random() * heartShapes.length)];
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 1.5;
    }
    update() {
      this.y -= this.speedY;
      this.x += Math.sin(this.y * 0.01) * 0.5 + this.speedX;
      this.rotation += this.rotationSpeed;
      if (this.y < -30) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.font = `${this.size}px serif`;
      ctx.fillText(this.char, 0, 0);
      ctx.restore();
    }
  }

  for (let i = 0; i < 25; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// Background Romantic Audio Control with fallbacks and continuous playback
function initAudio() {
  const MUSIC_TRACK_KEY = 'usha-birthday-music-track';
  const MUSIC_PLAYING_KEY = 'usha-birthday-music-playing';

  const tracks = [
    'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-love-114251.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  ];

  const getStoredTrack = () => {
    try {
      return sessionStorage.getItem(MUSIC_TRACK_KEY) || null;
    } catch (error) {
      return null;
    }
  };

  const setStoredTrack = (src) => {
    try {
      sessionStorage.setItem(MUSIC_TRACK_KEY, src);
    } catch (error) {
      // Ignore storage issues in restricted environments.
    }
  };

  const setPlayingState = (playing) => {
    try {
      sessionStorage.setItem(MUSIC_PLAYING_KEY, String(playing));
    } catch (error) {
      // Ignore storage issues in restricted environments.
    }
  };

  let audio = document.getElementById('bg-music');
  if (!audio) {
    audio = document.createElement('audio');
    audio.id = 'bg-music';
    audio.loop = true;
    audio.crossOrigin = 'anonymous';
    audio.preload = 'auto';
    audio.volume = 0.65;
    const storedTrack = getStoredTrack();
    audio.src = storedTrack && tracks.includes(storedTrack) ? storedTrack : tracks[0];
    setStoredTrack(audio.src);
    document.body.appendChild(audio);
  } else {
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.65;
    const storedTrack = getStoredTrack();
    if (storedTrack && tracks.includes(storedTrack)) {
      audio.src = storedTrack;
    } else {
      setStoredTrack(tracks[0]);
      audio.src = tracks[0];
    }
  }

  const audioBtn = document.createElement('button');
  audioBtn.id = 'music-control-btn';
  audioBtn.className = 'fixed bottom-5 right-5 z-50 px-4 py-3 rounded-full bg-pink-600 hover:bg-pink-500 text-white shadow-2xl backdrop-blur-md transition-all transform hover:scale-105 flex items-center gap-2 border border-pink-300/40';
  audioBtn.style.position = 'fixed';
  audioBtn.style.bottom = '20px';
  audioBtn.style.right = '20px';
  audioBtn.style.zIndex = '9999';
  audioBtn.style.borderRadius = '50px';
  audioBtn.style.border = '2px solid rgba(255,255,255,0.4)';
  audioBtn.style.background = 'linear-gradient(135deg, #ff4b72, #ff85a2)';
  audioBtn.style.cursor = 'pointer';
  audioBtn.style.boxShadow = '0 0 20px rgba(255,75,114,0.8)';
  audioBtn.style.fontSize = '14px';
  audioBtn.style.fontWeight = 'bold';

  let isPlaying = false;
  try {
    isPlaying = sessionStorage.getItem(MUSIC_PLAYING_KEY) === 'true';
  } catch (error) {
    isPlaying = false;
  }

  function updateButtonState(playing) {
    audioBtn.innerHTML = playing
      ? '<span>🎶</span> <span class="animate-pulse">Music Playing ❤️</span>'
      : '<span>🔇</span> <span>Play Music</span>';
  }

  function startMusic() {
    const nextTrack = getStoredTrack() || tracks[0];
    if (!nextTrack) {
      return Promise.resolve();
    }

    if (audio.src !== nextTrack) {
      audio.src = nextTrack;
      setStoredTrack(nextTrack);
    }

    return audio.play().then(() => {
      isPlaying = true;
      setPlayingState(true);
      updateButtonState(true);
    }).catch((error) => {
      console.log('Audio play error, trying alternative source:', error);
      const fallbackTrack = tracks.find(track => track !== audio.src) || tracks[0];
      audio.src = fallbackTrack;
      setStoredTrack(fallbackTrack);
      return audio.play().then(() => {
        isPlaying = true;
        setPlayingState(true);
        updateButtonState(true);
      }).catch(() => {
        isPlaying = false;
        setPlayingState(false);
        updateButtonState(false);
      });
    });
  }

  function stopMusic() {
    audio.pause();
    isPlaying = false;
    setPlayingState(false);
    updateButtonState(false);
  }

  function toggleMusic() {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  }

  audioBtn.addEventListener('click', toggleMusic);

  const userInteractionHandler = () => {
    if (!isPlaying) {
      startMusic().catch(() => {});
    }
    document.removeEventListener('click', userInteractionHandler);
    document.removeEventListener('touchstart', userInteractionHandler);
    document.removeEventListener('keydown', userInteractionHandler);
  };

  document.addEventListener('click', userInteractionHandler);
  document.addEventListener('touchstart', userInteractionHandler);
  document.addEventListener('keydown', userInteractionHandler);

  audio.addEventListener('error', () => {
    if (audio.src !== tracks[1]) {
      audio.src = tracks[1];
      setStoredTrack(tracks[1]);
      if (isPlaying) {
        startMusic().catch(() => {});
      }
    }
  });

  updateButtonState(isPlaying);
  document.body.appendChild(audioBtn);
}

// Step Indicator dots setup
function initStepDots() {
  const currentPath = window.location.pathname.split('/').pop() || '1_secret.html';
  const steps = [
    { file: '1_secret.html', title: 'Secret Entry' },
    { file: '2_welcome.html', title: 'Welcome Wifiy' },
    { file: '3_countdown.html', title: 'Countdown' },
    { file: '4_letter.html', title: 'Love Letter' },
    { file: '5_memories.html', title: 'Memories' },
    { file: '6_cake.html', title: 'Birthday Cake' },
    { file: '7_moment.html', title: 'Our Moment' },
    { file: '8_surprise.html', title: 'Surprise' },
    { file: '9_grandfinal.html', title: 'Grand Final' },
    { file: '10_lastpage.html', title: 'Happy Birthday' }
  ];

  const stepContainer = document.createElement('div');
  stepContainer.className = 'step-bar fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full glass-card';
  stepContainer.style.position = 'fixed';
  stepContainer.style.top = '15px';
  stepContainer.style.left = '50%';
  stepContainer.style.transform = 'translateX(-50%)';
  stepContainer.style.zIndex = '999';

  steps.forEach((step, index) => {
    const dot = document.createElement('a');
    dot.href = step.file;
    dot.className = 'step-dot';
    dot.title = `${index + 1}. ${step.title}`;
    if (currentPath === step.file || (currentPath === 'index.html' && step.file === '1_secret.html') || (currentPath === '' && step.file === '1_secret.html')) {
      dot.classList.add('active');
    }
    stepContainer.appendChild(dot);
  });

  document.body.appendChild(stepContainer);
}

// Photo Lightbox modal view
function initPhotoLightboxes() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'photo-modal';
  modal.innerHTML = `
    <div class="relative max-w-4xl max-h-[90vh] p-4 text-center">
      <button id="close-modal" style="position:absolute; top:-40px; right:10px; color:white; font-size:32px; background:none; border:none; cursor:pointer;">&times;</button>
      <img id="modal-img" src="" class="max-h-[75vh] max-w-full rounded-2xl shadow-2xl border-2 border-pink-400/50 object-contain mx-auto" />
      <p id="modal-caption" class="mt-4 text-pink-200 font-serif text-xl glow-text"></p>
    </div>
  `;
  document.body.appendChild(modal);

  const closeModal = () => modal.classList.remove('active');
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.id === 'close-modal') closeModal();
  });

  document.querySelectorAll('[data-lightbox]').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const image = item.matches('img') ? item : item.querySelector('img');
      if (!image) return;

      const caption = item.getAttribute('data-caption') || 'Usha Special Moment ❤️';
      document.getElementById('modal-img').src = image.currentSrc || image.src;
      document.getElementById('modal-caption').textContent = caption;
      modal.classList.add('active');
    });
  });
}