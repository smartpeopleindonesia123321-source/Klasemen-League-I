const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4v_ziMtwhRpQxS5ZnIbO9olIrUlzAAx8X5kS_Yr-Mv_GqDqSsg4Lc-1YNugRqElvUClbXnsf5gu12/pub?gid=0&single=true&output=csv';

const animalDatabase = {
    "Dandi": { sp: "Dandi sang Beruang Grizzly", atk: 95, def: 90, spd: 70, desc: 'Kekuatan murni yang tak terbendung : Sebagai predator puncak dari pegunungan utara, Dandi mewakili kekuatan fisik mentah yang mampu merobek pertahanan apa pun dengan sekali ayunan cakar. Tubuhnya yang masif dilapisi lemak tebal dan otot padat, menjadikannya tank alami yang sangat sulit ditumbangkan.' },
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

// --- DATA FETCH (REVISED FOR POTY %) ---
async function fetchData() {
    try {
        const res = await fetch(`${sheetUrl}&nocache=${new Date().getTime()}`);
        const csv = await res.text();
        
        let players = csv.split('\n').slice(1).map(line => {
            const row = line.split(',').map(c => c.trim().replace(/"/g, ''));
            return { 
                nama: row[0], 
                point: parseInt(row[1]) || 0, 
                goals: parseInt(row[2]) || 0, 
                logo: row[3],
                potw: row[4] || "",
                potw_winner: parseInt(row[5]) || 0, // Ambil angka manual dari Kolom F
                rate: row[6] || "0" // Ambil data RATE dari Kolom G (Index 6)
            };
        }).filter(p => p.nama);

        // 1. Sorting Berdasarkan Poin & Goal
        players.sort((a, b) => b.point - a.point || b.goals - a.goals);

        // 2. LOGIKA SPARKLINE TREND
        let history = JSON.parse(localStorage.getItem('rankHistory')) || {};
        players = players.map((player, index) => {
            const currentRank = index + 1;
            if (!history[player.nama]) history[player.nama] = [];
            history[player.nama].push(currentRank);
            if (history[player.nama].length > 5) history[player.nama].shift();
            return { ...player, rankHistory: history[player.nama] };
        });
        localStorage.setItem('rankHistory', JSON.stringify(history));

        // 3. UPDATE TICKER NEWS
        const tickerEl = document.getElementById('newsTicker');
        if (tickerEl && players.length > 0) {
            const leader = players[0].nama;
            const topScorerData = [...players].sort((a, b) => b.goals - a.goals)[0];
            const topMarketValues = [...players]
                .map(p => ({
                    nama: p.nama,
                    total: 5000000000 + (p.point * 100000000) + (p.goals * 10000000)
                }))
                .sort((a, b) => b.total - a.total)
                .slice(0, 3)
                .map((p, i) => `#${i+1} ${p.nama.toUpperCase()} (Rp ${(p.total/1000000000).toFixed(1)}M)`)
                .join(" | ");

            const allPotw = players
                .filter(p => p.potw.toLowerCase().includes("best player"))
                .map(p => p.nama.toUpperCase());
            const bestPlayerText = allPotw.length > 0 ? allPotw.join(", ") : "BELUM DITENTUKAN";

            tickerEl.innerText = `📢 NEWS UPDATE: ${leader.toUpperCase()} MEMIMPIN KLASEMEN! --- 💰 TOP 3 MARKET VALUE: ${topMarketValues} --- ⭐ BEST PLAYER OF THE WEEK: ${bestPlayerText} --- 🔥 TOP SCORER: ${topScorerData.nama.toUpperCase()} (${topScorerData.goals} GOALS) ---`;
        }

        // 4. Render
        renderTable(players); 
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

    // 1. HITUNG TOTAL POIN KOLEKTIF DARI KOLOM F (potw_winner)
    const totalPoinKolektif = players.reduce((acc, p) => acc + (p.potw_winner || 0), 0);

    players.forEach((p, i) => {
        const tr = document.createElement("tr");
        const currentRank = i + 1;
        
        // 2. LOGIKA PERSENTASE POTY (Individu / Total * 100)
        const persentase = totalPoinKolektif > 0 
            ? ((p.potw_winner / totalPoinKolektif) * 100).toFixed(1) 
            : 0;

        // 3. LOGIKA SPARKLINE TREND (SVG)
        const history = p.rankHistory || [currentRank];
        const maxRanks = players.length || 10;
        
        const points = history.map((rank, idx) => {
            const x = idx * 10;
            const y = (rank / maxRanks) * 20; 
            return `${x},${y}`;
        }).join(" ");

        const isImproving = history[0] > history[history.length - 1];
        const isDropping = history[0] < history[history.length - 1];
        const trendColor = isImproving ? "#00ff88" : (isDropping ? "#ff4444" : "#888");

        const sparkline = `
            <svg width="45" height="20" style="overflow:visible; display:block; margin:auto;">
                <polyline points="${points}" fill="none" stroke="${trendColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <circle cx="${(history.length - 1) * 10}" cy="${(history[history.length - 1] / maxRanks) * 20}" r="2.5" fill="${trendColor}" />
            </svg>`;

        // 4. HITUNG SELISIH POSISI (+/-)
        const diff = history.length > 1 ? history[history.length - 2] - currentRank : 0;
        let diffText = diff > 0 ? `+${diff}` : (diff < 0 ? diff : "-");
        let diffClass = diff > 0 ? "pos-up" : (diff < 0 ? "pos-down" : "");

        // 5. STATUS POTW (SEJAJAR & PROPORSIONAL)
        let potwContent = "";
        const currentRate = p.rate || "0"; 
        
        if (p.potw.toLowerCase().includes("best player")) {
            // Pakai flex agar sejajar, gap dikecilkan ke 5px biar hemat tempat
            potwContent = `
                <div style="display: flex; align-items: center; justify-content: center; gap: 5px;">
                    <strong style="font-size: 0.9rem;">${currentRate}</strong>
                    <span class="potw-highlight">BEST PLAYER OF THE WEEK</span>
                </div>`;
        } else {
            // Untuk yang biasa, samakan ukuran font-nya (0.9rem)
            potwContent = `<strong style="font-size: 0.9rem; opacity: 0.8;">${currentRate}</strong>`;
        }
        
        // 6. HIGHLIGHT BARIS (Rank 1-3 & Degradasi)
        if(currentRank === 1) tr.className = "rank-1";
        else if(currentRank === 2) tr.className = "rank-2";
        else if(currentRank === 3) tr.className = "rank-3";
        else if(currentRank === players.length) tr.className = "degradasi";

        // 7. INJECT HTML KE BARIS TABEL
        tr.innerHTML = `
            <td>${currentRank}</td>
            <td style="text-align:left">
                <div class="team-wrapper">
                    <img src="${p.logo}" class="team-logo" onclick="openModal('${p.nama}', '${p.logo}')">
                    <span class="team-name">${p.nama}</span>
                </div>
            </td>
            <td><strong>${p.point}</strong></td>
            <td>${p.goals}</td>
            <td>${sparkline}</td>
            <td class="${diffClass}"><strong>${diffText}</strong></td>
            <td>${potwContent}</td>
            <td style="color:#facc15; font-weight:900;">${persentase}%</td>
        `;
        
        body.appendChild(tr);
    });
}

function renderTopScorer(topPlayers) {
    const podium = document.getElementById("topScorerPodium");
    if(!podium) return;
    podium.innerHTML = "";
    
    topPlayers.forEach((p, i) => {
        const card = document.createElement("div");
        card.className = `scorer-card pos-${i + 1}`;
        
        card.innerHTML = `
            <div style="font-size:12px; font-weight:900; color:var(--accent); margin-bottom:5px;">#${i + 1}</div>
            <img src="${p.logo}" class="scorer-photo">
            <span class="scorer-name">${p.nama}</span>
            <div style="margin-top:5px;">
                <span class="scorer-agg" style="font-size:14px; font-weight:900; color:var(--text);">${p.goals} Goals</span>
            </div>
        `;
        podium.appendChild(card);
    });
}

function openModal(name, logo) {
    const tableRows = Array.from(document.querySelectorAll("#mainTable tbody tr"));
    const playerRow = tableRows.find(row => {
        const rowName = row.querySelector(".team-name").innerText.trim().toUpperCase();
        return rowName === name.trim().toUpperCase();
    });
    
    let points = 0;
    let goals = 0;

    if (playerRow) {
        const cells = playerRow.querySelectorAll("td");
        points = parseInt(cells[2].innerText) || 0; 
        goals = parseInt(cells[3].innerText) || 0;  
    }
    
    const baseValue = 5000000000; 
    const totalValue = baseValue + (points * 100000000) + (goals * 10000000);
    const marketValue = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalValue);

    const d = animalDatabase[name] || { sp: name, atk: 50, def: 50, spd: 50, desc: "-" };
    
    document.getElementById('modalBody').innerHTML = `
        <img src="${logo}" class="modal-photo">
        <h2 class="team-name" style="color:var(--accent); margin-bottom:5px;">${d.sp}</h2>
        <div class="market-value">
            <span style="font-size:10px; color:#aaa; font-weight:bold;">ESTIMATED MARKET VALUE</span>
            <span class="value-amount" style="font-size: 18px;">${marketValue}</span>
        </div>
        <div class="stat-item"><span>ATK</span><div class="progress-bg"><div class="progress-fill atk" style="width:0%"></div></div><span>${d.atk}</span></div>
        <div class="stat-item"><span>DEF</span><div class="progress-bg"><div class="progress-fill def" style="width:0%"></div></div><span>${d.def}</span></div>
        <div class="stat-item"><span>SPD</span><div class="progress-bg"><div class="progress-fill spd" style="width:0%"></div></div><span>${d.spd}</span></div>
        <p style="font-size:11px; color:#ccc; margin-top:15px; line-height:1.5; font-family:sans-serif;">"${d.desc}"</p>
    `;
    
    document.getElementById('animalModal').style.display = 'block';
    setTimeout(() => {
        const fills = document.querySelectorAll('.progress-fill');
        if(fills.length) { 
            fills[0].style.width = d.atk + '%'; 
            fills[1].style.width = d.def + '%'; 
            fills[2].style.width = d.spd + '%'; 
        }
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
    const tickerEl = document.getElementById('newsTicker');
    let tickerText = tickerEl ? tickerEl.innerText : "";

    // Ambil Waktu Update
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const allPlayers = Array.from(rows).map(row => {
        const cells = row.querySelectorAll("td");
        return {
            name: row.querySelector(".team-name").innerText.toUpperCase(),
            pts: cells[2] ? cells[2].innerText : "0",
            agg: cells[3] ? cells[3].innerText : "0",
            potwStatus: cells[6] ? cells[6].innerText.trim() : "",
            percent: cells[7] ? cells[7].innerText.trim() : "0%"
        };
    });

    // Cari Puncak Ballon d'Or
    const maxPercentValue = Math.max(...allPlayers.map(p => parseFloat(p.percent) || 0));
    const topPOTYGroup = allPlayers.filter(p => (parseFloat(p.percent) || 0) === maxPercentValue);
    const leaderNames = topPOTYGroup.map(p => p.name).join(", ").replace(/, ([^,]*)$/, " & $1");

    // --- RAKIT TEKS PROFESIONAL ---
    let text = "🗞️ *FOOTBALL LEAGUE-I OFFICIAL REPORT* 🗞️\n";
    text += `📅 _Update: ${dateStr} | ${timeStr} WIB_\n`;
    text += "----------------------------------------------\n\n";

    // Bagian Klasemen & Persentase
    text += "🏆 *LEAGUE STANDINGS & BALLON D'OR PERCENTAGE*\n";
    allPlayers.forEach((p, index) => {
        const potwIcon = p.potwStatus.toLowerCase().includes("best player") ? "⭐" : "";
        // Format: 01. NAMA - 45 Pts (15.5%)
        const pos = (index + 1).toString().padStart(2, '0');
        text += `\`${pos}.\` *${p.name}* • ${p.pts} Pts (${p.percent}) ${potwIcon}\n`;
    });

    text += `\n👑 *BALLON D'OR LEADER:* ${leaderNames}\n`;
    text += "----------------------------------------------\n\n";

    // Bagian Penghargaan Musim (Compact Mode)
    text += "🔥 *OFFICIAL AWARDS CATEGORIES* 🔥\n";
    text += "🏆 Champion | 🥈 Runner Up | 🥉 3rd Place\n";
    text += "🎯 Golden Boot | 👑 Ballon d’Or\n";
    text += "----------------------------------------------\n\n";

    // Footer & Link
    text += "📑 *Digital Card, Market Value, & Certificates:* \n";
    text += "https://smartpeopleindonesia123321-source.github.io/Klasemen-League-I/\n\n";
    text += "_Stay Sporty & Keep the Solidarity!_";

    window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent(text), '_blank');
}

// --- PLUGIN DYNAMIC JERSEY COLORS (SAFE ADD-ON) ---
const jerseyColors = {
    "Dandi": { primary: "#4b2c20", secondary: "#d4af37" }, // Cokelat Beruang & Emas
    "Erni": { primary: "#f3f4f6", secondary: "#60a5fa" },  // Putih Angora & Biru Muda
    "Regi": { primary: "#2d3436", secondary: "#00f2ff" },  // Abu Husky & Neon
    "Rizal": { primary: "#636e72", secondary: "#ffffff" }, // Serigala Abu & Putih
    "Asep": { primary: "#8b0000", secondary: "#facc15" },  // Merah Banteng & Kuning
    "Aries": { primary: "#1a1a1a", secondary: "#fbbf24" }, // Hitam Singa & Amber
    "Ikmal": { primary: "#3f6212", secondary: "#a3e635" }, // Hijau Rusa & Lime
    "Yanti": { primary: "#be185d", secondary: "#f472b6" }, // Pink Kelinci
    "Maya": { primary: "#000000", secondary: "#ffffff" }, // Hitam Putih Panda
    "Dicky": { primary: "#1e1b4b", secondary: "#d4af37" }  // Biru Gelap & Emas Kingkong
};

// Fungsi ini akan berjalan otomatis tanpa merusak openModal asli
const originalOpenModal = openModal;
openModal = function(name, logo) {
    originalOpenModal(name, logo); // Jalankan fungsi asli lo dulu
    
    const colorData = jerseyColors[name];
    const modalContent = document.querySelector('.modal-content');
    
    if (colorData && modalContent) {
        // Beri transisi halus
        modalContent.style.transition = "all 0.5s ease";
        // Ubah background modal sesuai warna karakter
        modalContent.style.background = `linear-gradient(135deg, ${colorData.primary} 0%, #111 100%)`;
        // Ubah warna border agar matching
        modalContent.style.borderColor = colorData.secondary;
        // Beri efek glow pada border
        modalContent.style.boxShadow = `0 0 30px ${colorData.secondary}44`;
    } else if (modalContent) {
        // Balikin ke warna default kalau nama gak terdaftar
        modalContent.style.background = "var(--modal-bg)";
        modalContent.style.borderColor = "var(--accent)";
    }
};

// ==========================================
// PLUGIN: SIGNATURE THEME & SLOGAN (FINAL VERSION)
// ==========================================

const predatorDatabase = {
    "Dandi": { slogan: "THE MOUNTAIN CRUSHER", music: "assets/dandi.mp3" },
    "Erni": { slogan: "THE WHITE SHADOW", music: "assets/erni.mp3" },
    "Regi": { slogan: "THE ARCTIC GUARDIAN", music: "assets/regi.mp3" },
    "Rizal": { slogan: "THE MIDNIGHT HUNTER", music: "assets/rizal.mp3" },
    "Asep": { slogan: "THE IRON HORN", music: "assets/asep.mp3" },
    "Aries": { slogan: "THE GOLDEN EMPEROR", music: "assets/aries.mp3" },
    "Ikmal": { slogan: "THE FOREST GHOST", music: "assets/ikmal.mp3" },
    "Yanti": { slogan: "THE SPEED DEMON", music: "assets/yanti.mp3" },
    "Maya": { slogan: "THE MYSTIC PHANTOM", music: "assets/maya.mp3" },
    "Dicky": { slogan: "THE KING OF THE JUNGLE", music: "assets/dicky.mp3" }
};

const sigPlayer = new Audio();
let isMainMusicActive = false;

// Override fungsi openModal
const backupOpenModal = openModal;
openModal = function(name, logo) {
    // Jalankan modal stats asli
    if (typeof backupOpenModal === 'function') backupOpenModal(name, logo);

    // Tampilkan Slogan Emas
    const sloganArea = document.getElementById('playerSlogan');
    if (sloganArea && predatorDatabase[name]) {
        sloganArea.innerText = predatorDatabase[name].slogan;
    }

    // Kontrol Musik Utama (UCL)
    const mainTrack = document.getElementById('uclMusic');
    if (mainTrack && !mainTrack.paused) {
        isMainMusicActive = true;
        mainTrack.pause();
    }

    // Putar Musik Signature
    if (predatorDatabase[name]) {
        sigPlayer.src = predatorDatabase[name].music;
        sigPlayer.volume = 0.6;
        sigPlayer.play().catch(e => console.log("Interaksi dibutuhkan untuk audio"));
    }
};

// Override fungsi closeModal
const backupCloseModal = closeModal;
closeModal = function() {
    if (typeof backupCloseModal === 'function') backupCloseModal();
    
    // Reset Tampilan Slogan
    const sloganArea = document.getElementById('playerSlogan');
    if (sloganArea) sloganArea.innerText = "";

    // Stop Musik Signature & Resume Musik Utama
    sigPlayer.pause();
    sigPlayer.currentTime = 0;
    const mainTrack = document.getElementById('uclMusic');
    if (isMainMusicActive && mainTrack) {
        mainTrack.play();
    }
};






















