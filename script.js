const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4v_ziMtwhRpQxS5ZnIbO9olIrUlzAAx8X5kS_Yr-Mv_GqDqSsg4Lc-1YNugRqElvUClbXnsf5gu12/pub?gid=0&single=true&output=csv';

const animalDatabase = {
    "Dandi": { sp: "Dandi sang Beruang Grizzly", atk: 95, def: 90, spd: 70, desc: 'Kekuatan murni yang tak tertandingi : Sebagai predator puncak dari pegunungan utara, Dandi mewakili kekuatan fisik mentah yang mampu merobek pertahanan apa pun dengan sekali ayunan cakar. Tubuhnya yang masif dilapisi lemak tebal dan otot padat, menjadikannya tank alami yang sangat sulit ditumbangkan.' },
    "Erni": { sp: "Erni sang Kucing Angora", atk: 65, def: 55, spd: 92, desc: 'Gerakan halus namun penuh perhitungan : Jangan tertipu oleh bulu putihnya yang elegan dan lembut, karena Erni adalah perwujudan dari kecepatan dan presisi yang mematikan di medan tempur. Ia bergerak layaknya bayangan yang meluncur di atas lantai marmer.' },
    "Regi": { sp: "Regi sang Siberian Husky", atk: 80, def: 85, spd: 88, desc: 'Loyalitas tanpa batas dan keberanian : Dibentuk oleh kerasnya badai salju abadi, Regi memiliki daya tahan jantung dan stamina yang hampir mustahil untuk dipatahkan. Ia adalah petarung yang mengandalkan disiplin dan kerja keras.' },
    "Rizal": { sp: "Rizal sang Serigala Kutub", atk: 88, def: 75, spd: 95, desc: 'Pemburu taktis yang sangat cerdas : Rizal adalah manifestasi dari kecerdasan taktis yang dipadukan dengan kecepatan kilat di atas hamparan es. Ia mampu memanfaatkan celah terkecil dalam pertahanan lawan.' },
    "Asep": { sp: "Asep sang Banteng Spanyol", atk: 92, def: 88, spd: 75, desc: 'Simbol kekuatan tak terbendung : Begitu Asep mulai memacu langkahnya, tidak ada dinding atau barisan pertahanan yang mampu menghentikan momentum destruktifnya. Ia adalah simbol energi kinetik yang tak terbendung.' },
    "Aries": { sp: "Aries sang Singa Siberia", atk: 96, def: 82, spd: 85, desc: 'Aumannya adalah peringatan musuh : Menggabungkan keanggunan seorang raja dengan keganasan predator es, Aries mendominasi medan perang lewat aura intimidasi dan kekuatan serangan yang luar biasa.' },
    "Ikmal": { sp: "Ikmal sang Rusa Kutub", atk: 70, def: 75, spd: 94, desc: 'Kelincahan yang sulit ditangkap : Ikmal adalah master dalam seni navigasi di medan yang sulit, menggunakan kaki-kakinya yang ramping untuk melakukan akselerasi instan yang membingungkan mata.' },
    "Yanti": { sp: "Yanti sang Kelinci Afrika", atk: 60, def: 50, spd: 98, desc: 'Daya ledak kecepatan mengejutkan : Sebagai individu tercepat dalam daftar ini, Yanti adalah keajaiban biomekanik yang mampu berpindah posisi dalam sekejap mata sebelum saraf lawan sempat bereaksi.' },
    "Maya": { sp: "Maya sang Panda Tiongkok", atk: 85, def: 95, spd: 60, desc: 'Rahang kuat di balik ketenangan : Di balik perawakannya yang tenang dan menggemaskan, Maya adalah benteng berjalan dengan pertahanan yang hampir mustahil ditembus oleh serangan konvensional.' },
    "Dicky": { sp: "Dicky sang Raja Kingkong", atk: 98, def: 98, spd: 65, desc: 'Benteng pertahanan terakhir : Berdiri sebagai puncak hierarki kekuatan, Dicky adalah raksasa yang memiliki keseimbangan sempurna antara serangan penghancur dan pertahanan yang absolut.' }
};

// --- MUSIK DENGAN FITUR FADE IN & FADE OUT ---
const audio = document.getElementById('uclMusic');
let isPlaying = false;
let fadeInterval;

const musicBtn = document.createElement('div');
musicBtn.className = 'music-control';
musicBtn.innerHTML = '🔇';
document.body.appendChild(musicBtn);

musicBtn.addEventListener('click', () => {
    if (!isPlaying) { playWithFadeIn(); } 
    else { stopWithFadeOut(); }
});

function playWithFadeIn() {
    clearInterval(fadeInterval);
    audio.volume = 0;
    audio.play().then(() => {
        musicBtn.innerHTML = '🔊';
        isPlaying = true;
        fadeInterval = setInterval(() => {
            if (audio.volume < 0.95) { audio.volume += 0.05; } 
            else { audio.volume = 1; clearInterval(fadeInterval); }
        }, 150);
    });
}

function stopWithFadeOut() {
    clearInterval(fadeInterval);
    fadeInterval = setInterval(() => {
        if (audio.volume > 0.05) { audio.volume -= 0.05; } 
        else {
            audio.volume = 0;
            audio.pause();
            isPlaying = false;
            clearInterval(fadeInterval);
            musicBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
        }
    }, 100);
}

// --- DATA FETCH ---
async function fetchData() {
    try {
        const res = await fetch(`${sheetUrl}&nocache=${new Date().getTime()}`);
        const csv = await res.text();
        
        const players = csv.split('\n').slice(1).map(line => {
            const row = line.split(',').map(c => c.trim().replace(/"/g, ''));
            return { 
                nama: row[0], 
                point: parseInt(row[1]) || 0, 
                goals: parseInt(row[2]) || 0, 
                logo: row[3],
                potw: row[4] || "" 
            };
        }).filter(p => p.nama);

        // Urutkan Klasemen Utama (Point)
        players.sort((a, b) => b.point - a.point || b.goals - a.goals);
        renderTable(players);

        // --- NEW: LOGIKA TOP SCORER (BERDASARKAN AGG/GOALS) ---
        const topScorers = [...players].sort((a, b) => b.goals - a.goals).slice(0, 3);
        renderTopScorer(topScorers);

        document.getElementById('status').innerText = "LIVE • TERKONEKSI";
    } catch (e) { 
        console.error(e);
        document.getElementById('status').innerText = "OFFLINE"; 
    }
}

function renderTable(players) {
    const body = document.querySelector("#mainTable tbody");
    body.innerHTML = "";
    players.forEach((p, i) => {
        const tr = document.createElement("tr");
        const rank = i + 1;
        let potwContent = p.potw.toLowerCase() === "best player" ? `<span class="potw-highlight">Best Player Of The Week</span>` : `<span style="opacity:0.3">-</span>`;
        if(rank === 1) tr.className = "rank-1";
        else if(rank === 2) tr.className = "rank-2";
        else if(rank === 3) tr.className = "rank-3";
        else if(rank === players.length) tr.className = "degradasi";

        tr.innerHTML = `<td>${rank}</td><td style="text-align:left"><div class="team-wrapper"><img src="${p.logo}" class="team-logo" onclick="openModal('${p.nama}', '${p.logo}')"><span class="team-name">${p.nama}</span></div></td><td><strong>${p.point}</strong></td><td>${p.goals}</td><td>-</td><td>-</td><td>${potwContent}</td>`;
        body.appendChild(tr);
    });
}

// --- NEW: FUNGSI RENDER PODIUM TOP SCORER ---
function renderTopScorer(topPlayers) {
    const podium = document.getElementById("topScorerPodium");
    if(!podium) return;
    podium.innerHTML = "";
    
    topPlayers.forEach((p, i) => {
        const card = document.createElement("div");
        card.className = `scorer-card pos-${i + 1}`;
        
        // Menentukan label peringkat (1, 2, 3)
        const rankLabel = i + 1;

        card.innerHTML = `
            <div style="font-size:12px; font-weight:900; color:var(--accent); margin-bottom:5px;">#${rankLabel}</div>
            <img src="${p.logo}" class="scorer-photo">
            <span class="scorer-name">${p.nama}</span>
            <div style="line-height: 1.2; margin-top:5px;">
                <span class="scorer-agg" style="font-size:14px; font-weight:900; color:#fff;">${p.goals} Goals</span>
            </div>
        `;
        podium.appendChild(card);
    });
}

function openModal(name, logo) {
    const d = animalDatabase[name] || { sp: name, atk: 50, def: 50, spd: 50, desc: "-" };
    document.getElementById('modalBody').innerHTML = `<img src="${logo}" class="modal-photo"><h2 class="team-name" style="color:var(--accent); margin-bottom:20px;">${d.sp}</h2><div class="stat-item"><span>ATK</span><div class="progress-bg"><div class="progress-fill atk" style="width:0%"></div></div><span>${d.atk}</span></div><div class="stat-item"><span>DEF</span><div class="progress-bg"><div class="progress-fill def" style="width:0%"></div></div><span>${d.def}</span></div><div class="stat-item"><span>SPD</span><div class="progress-bg"><div class="progress-fill spd" style="width:0%"></div></div><span>${d.spd}</span></div><p style="font-size:12px; color:#ccc; margin-top:15px; line-height:1.5; font-family:sans-serif;">"${d.desc}"</p>`;
    document.getElementById('animalModal').style.display = 'block';
    setTimeout(() => {
        const fills = document.querySelectorAll('.progress-fill');
        if(fills.length) { fills[0].style.width = d.atk + '%'; fills[1].style.width = d.def + '%'; fills[2].style.width = d.spd + '%'; }
    }, 100); 
}

function closeModal() { document.getElementById('animalModal').style.display = 'none'; }
fetchData();
setInterval(fetchData, 30000);

function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById('themeBtn');
    body.classList.toggle('light-mode');
    if (body.classList.contains('light-mode')) { btn.innerHTML = '☀️'; localStorage.setItem('theme', 'light'); } 
    else { btn.innerHTML = '🌙'; localStorage.setItem('theme', 'dark'); }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') { document.body.classList.add('light-mode'); const btn = document.getElementById('themeBtn'); if(btn) btn.innerHTML = '☀️'; }
});

function shareToWA() {
    const rows = document.querySelectorAll("#mainTable tbody tr");
    let text = "🏆 *FOOTBALL LEAGUE-I - KLASEMEN TERBARU* 🏆\n\nPOS | CONTENDER | PTS | AGG\n------------------------------\n";
    rows.forEach((row, index) => {
        if (index < 10) {
            const cells = row.querySelectorAll("td");
            const pos = cells[0].innerText;
            const name = row.querySelector(".team-name").innerText;
            const pts = cells[2].innerText;
            const agg = cells[3].innerText;
            text += `${pos}. *${name}* - ${pts} Pts (${agg})\n`;
        }
    });
    text += "\n📍 Cek klasemen lengkap di sini:\n" + window.location.href;
    window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent(text), '_blank');
}

