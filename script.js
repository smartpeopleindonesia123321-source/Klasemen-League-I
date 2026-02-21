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

// --- DATA FETCH (VERSI FIX TREND & MULTI POTW) ---
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
                potw: row[4] || "" 
            };
        }).filter(p => p.nama);

        // 1. Sorting Berdasarkan Poin & Goal
        players.sort((a, b) => b.point - a.point || b.goals - a.goals);

        // 2. LOGIKA TREND (Ambil data LAMA sebelum diupdate)
        const lastPositions = JSON.parse(localStorage.getItem('lastPos')) || {};
        
        players = players.map((player, index) => {
            const currentRank = index + 1;
            // Cari posisi dia sebelumnya di localStorage
            const previousRank = lastPositions[player.nama]; 
            
            return { 
                ...player, 
                // Kalau ga ada data lama (pemain baru), anggap tetap di posisi skrg
                prevPos: previousRank ? previousRank : currentRank 
            };
        });

        // Simpan posisi SEKARANG ke localStorage buat perbandingan fetch berikutnya
        const newPositions = {};
        players.forEach((p, i) => { newPositions[p.nama] = i + 1; });
        localStorage.setItem('lastPos', JSON.stringify(newPositions));

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

            tickerEl.innerText = `📢 NEWS UPDATE: ${leader.toUpperCase()} MEMIMPIN KLASEMEN! --- 💰 TOP MARKET VALUE: ${topMarketValues} --- ⭐ BEST PLAYER OF THE WEEK: ${bestPlayerText} --- 🔥 TOP SCORER: ${topScorerData.nama.toUpperCase()} (${topScorerData.goals} GOALS) ---`;
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
    players.forEach((p, i) => {
        const tr = document.createElement("tr");
        const currentRank = i + 1;
        
        // HITUNG SELISIH (PENTING: previous - current)
        // Jika prev: 4 dan current: 3, maka diff = +1 (Naik)
        const diff = p.prevPos - currentRank;

        let trendIcon = `<svg width="40" height="20"><line x1="5" y1="10" x2="35" y2="10" stroke="#444" stroke-width="2"/></svg>`;
        let diffText = "-";
        let diffClass = "";

        if (diff > 0) {
            trendIcon = `<svg width="40" height="20"><path d="M10 15L20 5L30 15" fill="none" stroke="#00ff88" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            diffText = `+${diff}`;
            diffClass = "pos-up";
        } else if (diff < 0) {
            trendIcon = `<svg width="40" height="20"><path d="M10 5L20 15L30 5" fill="none" stroke="#ff4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            diffText = diff; // Sudah ada tanda minus dari hasil hitung
            diffClass = "pos-down";
        }

        // Fix: Menggunakan includes agar flexible jika input "Best Player Pekan 1"
        let potwContent = p.potw.toLowerCase().includes("best player") 
            ? `<span class="potw-highlight">Best Player Of The Week</span>` 
            : `<span style="opacity:0.3">-</span>`;
        
        if(currentRank === 1) tr.className = "rank-1";
        else if(currentRank === 2) tr.className = "rank-2";
        else if(currentRank === 3) tr.className = "rank-3";
        else if(currentRank === players.length) tr.className = "degradasi";

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
            <td>${trendIcon}</td>
            <td class="${diffClass}"><strong>${diffText}</strong></td>
            <td>${potwContent}</td>
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
    // 1. Ambil semua baris di tabel
    const tableRows = Array.from(document.querySelectorAll("#mainTable tbody tr"));
    
    // 2. Cari baris pemain dengan mencocokkan nama (pake trim() biar akurat)
    const playerRow = tableRows.find(row => {
        const rowName = row.querySelector(".team-name").innerText.trim().toUpperCase();
        return rowName === name.trim().toUpperCase();
    });
    
    let points = 0;
    let goals = 0;

    // 3. Kalau ketemu, ambil angkanya. Kalau nggak, muncul log di console buat cek
    if (playerRow) {
        const cells = playerRow.querySelectorAll("td");
        points = parseInt(cells[2].innerText) || 0; // Kolom PTS
        goals = parseInt(cells[3].innerText) || 0;  // Kolom AGG
    } else {
        console.warn("Pemain tidak ditemukan di tabel untuk kalkulasi harga:", name);
    }
    
    // 4. HITUNGAN RUPIAH (Sesuai request lo: 1 Pts = 100jt, 1 Goal = 10jt)
    const baseValue = 5000000000; 
    const pointValue = points * 100000000;
    const goalValue = goals * 10000000;
    const totalValue = baseValue + pointValue + goalValue;

    // 5. Format Rupiah
    const marketValue = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(totalValue);

    // Sisanya sama, tinggal render modalnya
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
        <p style="font-size:11px; color:#ccc; margin-top:15px; line-height:1.5; font-family:sans-serif; font-style: normal;">"${d.desc}"</p>
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

    // 1. SCAN SEMUA PEMAIN UNTUK MENCARI BEST PLAYER (BISA BANYAK NAMA)
    const allPlayers = Array.from(rows).map(row => {
        const cells = row.querySelectorAll("td");
        return {
            name: row.querySelector(".team-name").innerText.toUpperCase(),
            potw: cells[6] ? cells[6].innerText.trim() : ""
        };
    });

    const potwPlayers = allPlayers
        .filter(p => p.potw.toLowerCase().includes("best player"))
        .map(p => p.name);

    // Format tampilan daftar nama POTW
    let potwListText = "BELUM DITENTUKAN";
    if (potwPlayers.length > 0) {
        if (potwPlayers.length > 5) {
            // Jika lebih dari 5 orang, buat daftar ke bawah pakai strip
            potwListText = "\n- " + potwPlayers.join("\n- ");
        } else {
            // Jika sedikit, gabungin pakai koma saja
            potwListText = potwPlayers.join(", ");
        }
    }

    // 2. BERSIHKAN & UPDATE TICKER TEXT UNTUK WA
    let updatedTicker = tickerText.replace(/---/g, "\n");
    
    // Ganti Label "BEST PLAYER" lama menjadi "BEST PLAYER OF THE WEEK" + Daftar Nama
    if (updatedTicker.includes("BEST PLAYER:")) {
        updatedTicker = updatedTicker.replace(/BEST PLAYER:.*?(?=\n|$)/, `BEST PLAYER OF THE WEEK: ${potwListText}`);
    } else if (updatedTicker.includes("BEST PLAYER OF THE WEEK:")) {
        updatedTicker = updatedTicker.replace(/BEST PLAYER OF THE WEEK:.*?(?=\n|$)/, `BEST PLAYER OF THE WEEK: ${potwListText}`);
    }

    // 3. RAKIT PESAN WHATSAPP
    let text = "🗞️ *FOOTBALL LEAGUE-I NEWS UPDATE* 🗞️\n";
    text += "_" + updatedTicker + "_\n";
    
    text += "--------------------------------------\n";
    text += "📑 *INFO MARKET VALUE CALCULATION:*\n";
    text += "Base (Rp 5M) + (1 Pts = 100jt) + (1 Goal = 10jt) in Rupiah\n";
    text += "--------------------------------------\n\n";
    
    text += "🏆 *KLASEMEN TERBARU* 🏆\n";
    text += "POS | CONTENDER | PTS | AGG\n";
    text += "--------------------------------------\n";

    // 4. LOOPING DATA TABEL UNTUK DAFTAR KLASEMEN
    rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length > 0) {
            const pos = cells[0].innerText;
            const name = row.querySelector(".team-name").innerText.toUpperCase();
            const pts = cells[2].innerText;
            const agg = cells[3].innerText;
            
            const potwStatus = cells[6] ? cells[6].innerText.trim() : "";
            let potwIcon = "";
            
            if (potwStatus.toLowerCase().includes("best player")) {
                potwIcon = " ⭐ *[BEST PLAYER OF THE WEEK]*"; 
            }
            
            text += `${pos}. *${name}* - ${pts} Pts (${agg})${potwIcon}\n`;
        }
    });

    text += "\n📍 *Cek Detail ID Card & Market Value:* \n" + window.location.href;
    
    // 5. EKSEKUSI KIRIM
    const waUrl = "https://api.whatsapp.com/send?text=" + encodeURIComponent(text);
    window.open(waUrl, '_blank');
}











