// script.js — DREWN Romantic Gallery 💞

// Get DOM elements
const masonry = document.querySelector('.masonry');
const audio = document.getElementById('bgAudio');
const toggleBtn = document.getElementById('toggleMusic');
const musicFile = document.getElementById('musicFile');
const skipPrevBtn = document.getElementById('skipPrev');
const skipNextBtn = document.getElementById('skipNext');

// Music playlist variables
let playlist = [];
let currentSongIndex = 0;


// Load photos from photos.json and sort by date descending
async function loadPhotos() {
  masonry.innerHTML = '<p style="padding:20px;color:#7a6b78">Memuat foto...</p>';

  try {
    const res = await fetch('photos.json');
    if (!res.ok) throw new Error(res.statusText);
    const photos = await res.json();

    // Sort photos by date descending (newest first)
    photos.sort((a, b) => new Date(b.date) - new Date(a.date));

    masonry.innerHTML = ''; // Clear container

    photos.forEach(photo => {
      const article = document.createElement('article');
      article.className = 'photo-card';
      article.innerHTML = `
        <img class="photo-img" src="${photo.src}" alt="${photo.caption || ''}" onerror="this.style.display='none'; this.nextElementSibling.innerHTML='<p style=\\'color:#7a6b78\\'>Gambar tidak ditemukan</p>'">
        <div class="meta">
          <p class="caption">${photo.caption || ''}</p>
          <time class="date">${photo.date || ''}</time>
        </div>
      `;
      masonry.appendChild(article);
    });

  } catch (err) {
    console.error('Failed to load photos.json', err);
    masonry.innerHTML =
      '<p style="padding:20px;color:#7a6b78">Gagal memuat galeri. Pastikan file <code>photos.json</code> ada dan formatnya benar.</p>';
  }
}

// Load music playlist from music.json
async function loadPlaylist() {
  try {
    const res = await fetch('music.json');
    if (!res.ok) throw new Error(res.statusText);
    playlist = await res.json();
    if (playlist.length > 0) {
      audio.src = playlist[currentSongIndex].src;
    }
  } catch (err) {
    console.error('Failed to load music.json', err);
  }
}

// Play next song
function playNext() {
  currentSongIndex = (currentSongIndex + 1) % playlist.length;
  audio.src = playlist[currentSongIndex].src;
  
  audio.play()
    .then(() => {
      toggleBtn.setAttribute('aria-pressed', 'true');
      console.log(`Memutar lagu berikutnya: ${playlist[currentSongIndex].title}`); // Tambahkan log sukses
    })
    .catch((error) => {
      toggleBtn.setAttribute('aria-pressed', 'false');
      console.error(`Gagal memutar lagu ${playlist[currentSongIndex].title}:`, error); // Tambahkan log error rinci
      
      // Coba lompat ke lagu berikutnya (jika playlist lebih dari 1 lagu)
      if (playlist.length > 1) {
        console.warn("Mencoba melompati lagu yang gagal...");
        // Mencegah loop tak terbatas jika semua lagu gagal, tapi coba lompat sekali
        if (currentSongIndex === 0 && error.name === 'NotSupportedError') return;
        playNext(); 
      }
    });
}

// Play previous song
function playPrev() {
  currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
  audio.src = playlist[currentSongIndex].src;
  
  audio.play()
    .then(() => {
      toggleBtn.setAttribute('aria-pressed', 'true');
      console.log(`Memutar lagu sebelumnya: ${playlist[currentSongIndex].title}`);
    })
    .catch((error) => {
      toggleBtn.setAttribute('aria-pressed', 'false');
      console.error(`Gagal memutar lagu ${playlist[currentSongIndex].title}:`, error);
    });
}

// Handle music autoplay
async function tryPlayAudio() {
  try {
    await audio.play();
    toggleBtn.setAttribute('aria-pressed', 'true');
  } catch (e) {
    toggleBtn.setAttribute('aria-pressed', 'false');
  }
}

// Toggle play/pause music
toggleBtn.addEventListener('click', async () => {
  if (audio.paused) {
    try {
      await audio.play();
      toggleBtn.setAttribute('aria-pressed', 'true');
    } catch (e) {
      console.warn('play failed', e);
    }
  } else {
    audio.pause();
    toggleBtn.setAttribute('aria-pressed', 'false');
  }
});

// Change music file manually
musicFile.addEventListener('change', (e) => {
  const f = e.target.files && e.target.files[0];
  if (!f) return;
  const url = URL.createObjectURL(f);
  audio.src = url;
  audio.play()
    .then(() => toggleBtn.setAttribute('aria-pressed', 'true'))
    .catch(() => toggleBtn.setAttribute('aria-pressed', 'false'));
});

// Initialize on page load
window.addEventListener('load', async () => {
  await loadPlaylist();
  loadPhotos();
  setTimeout(() => tryPlayAudio(), 200);
});

// Auto-play next song when current ends
audio.addEventListener('ended', () => {
  playNext();
});

// Skip buttons event listeners
skipPrevBtn.addEventListener('click', playPrev);
skipNextBtn.addEventListener('click', playNext);
