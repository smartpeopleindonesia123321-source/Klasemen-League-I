const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4v_ziMtwhRpQxS5ZnIbO9olIrUlzAAx8X5kS_Yr-Mv_GqDqSsg4Lc-1YNugRqElvUClbXnsf5gu12/pub?gid=0&single=true&output=csv';

// ==========================================
// 1. SETUP MUSIC UCL (FADE-IN & FADE-OUT)
// ==========================================
const audio = document.createElement('audio');
audio.id = 'uclMusic';
audio.loop = true;
audio.src = 'ucl-theme.mp3'; // <--- PASTIKAN FILE MP3 ADA DI FOLDER PROJECT
audio.volume = 0; 
document.body.appendChild(audio);

const musicBtn = document.createElement('div');
musicBtn.id = 'music-control';
musicBtn.innerHTML = '🔇'; 
musicBtn.style.cssText = `
    position: fixed; bottom: 20px; right: 20px; 
    background: rgba(0,0,0,0.8); color: #edb211; 
    width: 50px; height: 50px; border-radius: 50%; 
    display: flex; align-items: center; justify-content: center; 
    cursor: pointer; z-index: 9999; border: 2px solid #edb211;
    font-size: 24px; transition: 0.3s; box-shadow: 0 0 15px rgba(237, 178, 17, 0.3);
`;
document.body.appendChild(musicBtn);

let isMusicPlaying = false;
const maxVolume = 0.7; // Volume maksimal

function fadeIn(audioElement, duration) {
    let vol = 0;
    const interval = 50;
    const step = maxVolume / (duration / interval);
    const fadeContainer = setInterval(() => {
        if (vol < maxVolume) {
            vol += step;
            audioElement.volume = Math.min(vol, maxVolume);
        } else {
            clearInterval(fadeContainer);
        }
    }, interval);
}

function fadeOut(audioElement, duration) {
    let vol = audioElement.volume;
    const interval = 50;
    const step = vol / (duration / interval);
    const fadeContainer = setInterval(() => {
        if (vol > 0) {
            vol -= step;
            audioElement.volume = Math.max(vol, 0);
        } else {
            audioElement.pause();
            clearInterval(fadeContainer);
        }
    }, interval);
}

function toggleMusic() {
    if (isMusicPlaying) {
        fadeOut(audio, 1000);
        musicBtn.innerHTML = '🔇';
    } else {
        audio.play();
        fadeIn(audio, 1500);
        musicBtn.innerHTML = '🔊';
    }
    isMusicPlaying = !isMusicPlaying;
}

musicBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Biar gak trigger event click body
    toggleMusic();
});

// Autoplay pertama kali saat user berinteraksi dengan web
document.addEventListener('click', () => {
    if (!isMusicPlaying) {
        audio.play();
        fadeIn(audio, 3000); // Fade in 3 detik biar dramatis
        isMusicPlaying = true;
        musicBtn.innerHTML = '🔊';
    }
}, { once: true });


// ==========================================
// 2. SETUP TOAST NOTIFICATION
// ==========================================
const toastContainer = document.createElement('div');
toastContainer.className = 'toast-container';
document.body.appendChild(toastContainer);

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 4500);
}


// ==========================================
// 3. FUNGSI UTAMA FETCH DATA
// ==========================================
async function fetchData() {
    try {
        const statusEl = document.getElementById('status');
        if(statusEl) statusEl.innerText = "MEMPERBARUI DATA...";
        
        // Catat posisi sebelum update untuk animasi
        const rowsBefore = Array.from(document.querySelectorAll("#mainTable tbody tr"));
        const firstPositions = {};
        rowsBefore.forEach(row => {
            const teamName = row.querySelector('.team-name')?.innerText;
            if (teamName) firstPositions[teamName] = row.getBoundingClientRect().top;
        });

        const response = await fetch(`${sheetUrl}&cache=${new Date().getTime()}`);
        const rawData = await response.text();
        
        const rows = rawData.split('\n').slice(1);
        let players = rows.map(row => {
            const cols = row.split(',');
            return {
                nama: cols[0]?.replace(/"/g, '').trim(),
                point: parseInt(cols[1]) || 0,
                goals: parseInt(cols[2]) || 0,
                logo: cols[3]?.replace(/"/g, '').trim() || ''
            };
        }).filter(p => p.nama);

        // Sortir: Poin -> Selisih Gol
        players.sort((a, b) => b.point - a.point || b.goals - a.goals);
        
        updateHistoryAndRender(players);

        // Animasi perpindahan baris & Notifikasi
        const rowsAfter = Array.from(document.querySelectorAll("#mainTable tbody tr"));
        rowsAfter.forEach(row => {
            const teamName = row.querySelector('.team-name').innerText;
            const lastPos = row.getBoundingClientRect().top;
            const firstPos = firstPositions[teamName];

            if (firstPos && firstPos !== lastPos) {
                const deltaY = firstPos - lastPos;
                
                if (deltaY > 0) {
                    const rankNow = row.querySelector('td:first-child').innerText;
                    if (rankNow === "1") {
                        showToast(`🔥 BOOM! ${teamName} SEKARANG DI PUNCAK!`);
                    } else {
                        showToast(`🚀 ${teamName} berhasil naik peringkat!`);
                    }
                }

                row.animate([
                    { transform: `translateY(${deltaY}px)` },
                    { transform: 'translateY(0)' }
                ], {
                    duration: 1000,
                    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                });
            }
        });

        if(statusEl) statusEl.innerText = "LIVE • TERUPDATE";
    } catch (err) {
        if(document.getElementById('status')) document.getElementById('status').innerText = "KONEKSI BERMASALAH";
        console.error(err);
    }
}


// ==========================================
// 4. LOGIKA RENDER TABEL & HISTORY
// ==========================================
function updateHistoryAndRender(players) {
    const lastRankMap = JSON.parse(localStorage.getItem('savedRank')) || {};
    const history = JSON.parse(localStorage.getItem('rankHistory')) || {};
    const currentRankMap = {};
    const tbody = document.querySelector("#mainTable tbody");
    
    players.forEach((p, i) => {
        const rankNow = i + 1;
        currentRankMap[p.nama] = rankNow;
        if (!history[p.nama]) history[p.nama] = [];
        history[p.nama].push(rankNow);
        if (history[p.nama].length > 8) history[p.nama].shift();
    });

    tbody.innerHTML = "";

    players.forEach((p, i) => {
        const rankNow = i + 1;
        const isLast = (rankNow === players.length);
        let changeHtml = '<span class="stay">−</span>';
        let diff = 0;

        if (lastRankMap[p.nama]) {
            diff = lastRankMap[p.nama] - rankNow;
            if (diff > 0) changeHtml = `<span class="up">▲${diff}</span>`;
            else if (diff < 0) changeHtml = `<span class="down">▼${Math.abs(diff)}</span>`;
        }

        const tr = document.createElement("tr");
        if (rankNow === 1) tr.className = "rank-1";
        else if (rankNow === 2) tr.className = "rank-2";
        else if (rankNow === 3) tr.className = "rank-3";
        if (isLast) tr.classList.add("degradasi");

        tr.innerHTML = `
            <td>${rankNow}</td>
            <td style="text-align: left;">
                <div class="team-wrapper">
                    <img src="${p.logo || 'https://cdn-icons-png.flaticon.com/512/33/33736.png'}" class="team-logo">
                    <span class="team-name">${p.nama}</span>
                </div>
            </td>
            <td><strong>${p.point}</strong></td>
            <td>${p.goals}</td>
            <td><canvas id="spark-${i}" class="sparkline-canvas" width="80" height="30"></canvas></td>
            <td>${changeHtml}</td>
        `;
        tbody.appendChild(tr);

        renderSparkline(`spark-${i}`, history[p.nama], diff);
    });

    localStorage.setItem('savedRank', JSON.stringify(currentRankMap));
    localStorage.setItem('rankHistory', JSON.stringify(history));
}


// ==========================================
// 5. RENDER GRAFIK SPARKLINE
// ==========================================
function renderSparkline(canvasId, dataPoints, diff) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let lineColor = '#00f2ff'; 
    if (diff > 0) lineColor = '#00ff88'; 
    else if (diff < 0) lineColor = '#ff4d4d'; 

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dataPoints.map((_, i) => i),
            datasets: [{
                data: dataPoints,
                borderColor: lineColor,
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: false,
            animation: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: { 
                x: { display: false }, 
                y: { display: false, reverse: true } 
            }
        }
    });
}

// Eksekusi
fetchData();
setInterval(fetchData, 30000);
