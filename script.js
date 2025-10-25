// script.js — load photos.json, build masonry, audio controls
}


masonry.appendChild(article);
})
}catch(err){
console.error('Failed to load photos.json', err);
masonry.innerHTML = '<p style="padding:20px;color:#7a6b78">Gagal memuat galeri. Pastikan file <code>photos.json</code> ada.</p>'
}
}


// autoplay: try to play, if blocked we keep muted state and wait for user gesture
async function tryPlayAudio(){
try{
await audio.play();
toggleBtn.setAttribute('aria-pressed','true');
}catch(e){
// autoplay blocked — set aria to false so user can toggle
toggleBtn.setAttribute('aria-pressed','false');
}
}


// toggle play/pause
toggleBtn.addEventListener('click', async ()=>{
if (audio.paused) {
try{ await audio.play(); toggleBtn.setAttribute('aria-pressed','true'); }
catch(e){ console.warn('play failed', e); }
} else {
audio.pause(); toggleBtn.setAttribute('aria-pressed','false');
}
});


// allow user to pick a custom audio file (local) — this replaces src with blob URL
musicFile.addEventListener('change', (e)=>{
const f = e.target.files && e.target.files[0];
if(!f) return;
const url = URL.createObjectURL(f);
audio.src = url;
audio.play().then(()=>toggleBtn.setAttribute('aria-pressed','true')).catch(()=>toggleBtn.setAttribute('aria-pressed','false'));
});


// kick off
loadPhotos();
// attempt autoplay on load
window.addEventListener('load', ()=>{
// small delay to allow UI to settle
setTimeout(()=>tryPlayAudio(), 120);
});