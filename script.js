// script.js — Romantic Masonry Gallery with Music 🎶

// ambil elemen penting
const masonry = document.querySelector('.masonry');
const audio = document.getElementById('bg-music');
const toggleBtn = document.getElementById('music-toggle');
const musicFile = document.getElementById('music-file');

// fungsi utama: memuat foto dari photos.json
async function loadPhotos() {
  masonry.innerHTML = '<p style="padding:20px;color:#7a6b78">Memuat foto...</p>';

  try {
    const res = await fetch('photos.json');
    if (!res.ok) throw new Error(res.statusText);
    const photos = await res.json();

    masonry.innerHTML = ''; // kosongkan kontainer

    photos.forEach(photo => {
      const article = document.createElement('article');
      article.className = 'masonry-item';
      article.innerHTML = `
        <img src="${photo.src}" alt="${photo.caption || ''}">
        <div class="caption">
          <p>${photo.caption || ''}</p>
          <span>${photo.date || ''}</span>
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

// autoplay: coba mainkan musik, kalau diblok browser biarkan mute
async function tryPlayAudio() {
  try {
    await audio.play();
    toggleBtn.setAttribute('aria-pressed', 'true');
  } catch (e) {
    // autoplay diblok, nanti bisa dimainkan manual
    toggleBtn.setAttribute('aria-pressed', 'false');
  }
}

// tombol toggle musik play/pause
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

// ganti musik manual (upload file lokal)
musicFile.addEventListener('change', (e) => {
  const f = e.target.files && e.target.files[0];
  if (!f) return;
  const url = URL.createObjectURL(f);
  audio.src = url;
  audio.play()
    .then(() => toggleBtn.setAttribute('aria-pressed', 'true'))
    .catch(() => toggleBtn.setAttribute('aria-pressed', 'false'));
});

// mulai semua saat halaman load
window.addEventListener('load', () => {
  loadPhotos(); // load galeri
  setTimeout(() => tryPlayAudio(), 200); // coba autoplay musik
});
