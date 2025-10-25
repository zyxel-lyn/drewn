// script.js — DREWN Romantic Gallery 💞

// ambil elemen sesuai ID di HTML
const masonry = document.querySelector('.masonry');
const audio = document.getElementById('bgAudio');
const toggleBtn = document.getElementById('toggleMusic');
const musicFile = document.getElementById('musicFile');

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
      article.className = 'photo-card';
      article.innerHTML = `
        <img class="photo-img" src="${photo.src}" alt="${photo.caption || ''}">
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

// autoplay: coba mainkan musik, kalau diblok browser biarkan mute
async function tryPlayAudio() {
  try {
    await audio.play();
    toggleBtn.setAttribute('aria-pressed', 'true');
  } catch (e) {
    toggleBtn.setAttribute('aria-pressed', 'false');
  }
}

// toggle play/pause
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
  loadPhotos();
  setTimeout(() => tryPlayAudio(), 200);
});
