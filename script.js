const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4v_ziMtwhRpQxS5ZnIbO9olIrUlzAAx8X5kS_Yr-Mv_GqDqSsg4Lc-1YNugRqElvUClbXnsf5gu12/pub?gid=0&single=true&output=csv';

const animalDatabase = {
    "Dandi": { sp: "Dandi The Grizzly Bear", atk: 95, def: 90, spd: 70, desc: 'Kekuatan beruang grizzly pekat : Sebagai beruang besar dari pegunungan utara, Dandi mewakili kekuatan fisik mentah yang mampu merobek pertahanan apa pun dengan sekali ayunan cakar beruangnya. Tubuh masif berbulu tebal dan berotot padat menjadikannya tank alami yang sangat sulit ditumbangkan.' },
    "Aldi": { sp: "Aldi The Megalodon Shark", atk: 94, def: 80, spd: 90, desc: 'Predator hiu purba yang mematikan : Mengintai dari kegelapan lautan dalam, Aldi adalah hiu megalodon dengan sirip tajam dan indra penciuman darah yang presisi. Berenang meluncur cepat di bawah air, ia mendaratkan gigitan bertaring ganda berdaya hancur tinggi sebelum musuh sempat melarikan diri.' },
    "Regi": { sp: "Regi The Black Panther", atk: 90, def: 78, spd: 96, desc: 'Bayangan macan kumbang yang lincah : Regi adalah macan tutul hitam yang berburu dalam senyap di kegelapan hutan. Mengandalkan cakar tajam, mata yang menyala di malam hari, dan refleks kucing besar, ia mampu mendekati target tanpa suara sebelum mendaratkan serangan sergap yang fatal.' },
    "Rizal": { sp: "Rizal The Siberian Tiger", atk: 96, def: 84, spd: 91, desc: 'Raja harimau salju yang dominan : Rizal adalah harimau Siberia dengan garis loreng ikonik dan taring yang tajam. Sebagai predator puncak di tengah badai es, kombinasi tarikan cakar depan yang kuat dan auman kerasnya sanggup mengintimidasi serta meruntuhkan mental barisan lawan.' },
    "Asep": { sp: "Asep The Spanish Bull", atk: 92, def: 88, spd: 75, desc: 'Tandukan banteng matador tak terbendung : Asep adalah banteng petarung Spanyol dengan tanduk kokoh dan gumpalan otot di bahunya. Begitu ia menurunkan kepala dan memacu sergapannya, momentum tandukan destruktifnya sanggup menerobos dinding pertahanan paling tebal sekalipun.' },
    "Aries": { sp: "Aries The Siberian Lion", atk: 96, def: 82, spd: 85, desc: 'Raja singa es pemuncak rantai makanan : Aries adalah singa jantan berwibawa dengan surai lebat di tengah padang salju. Menggabungkan ketenangan seorang raja rimba dan kekuatan cengkraman rahang singa, aumannya menggelegar sebagai tanda dominasi mutlak di medan tempur.' },
    "Ikmal": { sp: "Ikmal The Golden Eagle", atk: 82, def: 65, spd: 99, desc: 'Cengkraman elang emas dari angkasa : Ikmal adalah burung elang berbulu emas dengan bentangan sayap lebar dan penglihatan teleskopik. Memantau seluruh arena dari langit tinggi, ia menukik tajam dengan kecepatan kilat untuk mencengkeram target menggunakan kuku kakinya yang tajam.' },
    "Muiz": { sp: "Muiz The Mustang Stallion", atk: 78, def: 70, spd: 98, desc: 'Lari kencang kuda liar padang rumput : Muiz adalah kuda jantan mustang yang memiliki stamina tanpa batas dan derap langkah yang bertenaga. Mengandalkan otot kaki yang kuat serta kecepatan lari yang konstan, ia sanggup melakukan sprint jarak jauh tanpa mengenal lelah.' },
    "Abdul": { sp: "Abdul The Arctic Wolf", atk: 88, def: 82, spd: 92, desc: 'Insting memburu serigala salju : Abdul adalah serigala kutub berbulu putih tebal dengan tatapan mata dingin yang tajam. Memanfaatkan insting kawanan dan penciuman serigala yang peka, ia bergerak lincah menembus medan es untuk mengunci pergerakan musuh secara presisi.' },
    "Dicky": { sp: "Dicky The Red Dragon", atk: 99, def: 99, spd: 75, desc: 'Semburan naga merah raksasa : Dicky adalah naga mitologi bersisik keras sekuat baja dengan bentangan sayap berapi. Berada di puncak tertinggi hierarki makhluk mistis, kebasan ekor raksasa dan semburan nafas apinya memberikan ancaman absolut tanpa celah.' }
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
        
        let players = csv.split('\n').slice(1).map(line => {
            const row = line.split(',').map(c => c.trim().replace(/"/g, ''));
            return { 
                nama: row[0], 
                point: parseInt(row[1]) || 0, 
                goals: parseInt(row[2]) || 0, 
                logo: row[3],
                potw: row[4] || "",
                potw_winner: parseInt(row[5]) || 0, 
                rate: row[6] || "0",
                yellowCards: parseInt(row[7]) || 0
            };
        }).filter(p => p.nama);

        players.sort((a, b) => b.point - a.point || b.goals - a.goals);

        let history = JSON.parse(localStorage.getItem('rankHistory')) || {};
        players = players.map((player, index) => {
            const currentRank = index + 1;
            if (!history[player.nama]) history[player.nama] = [];
            history[player.nama].push(currentRank);
            if (history[player.nama].length > 5) history[player.nama].shift();
            return { ...player, rankHistory: history[player.nama] };
        });
        localStorage.setItem('rankHistory', JSON.stringify(history));

        const tickerEl = document.getElementById('newsTicker');
        if (tickerEl && players.length > 0) {
            const leader = players[0].nama;
            const topScorerData = [...players].sort((a, b) => b.goals - a.goals)[0];
            
            const maxPotwValue = Math.max(...players.map(p => p.potw_winner));
            const potyLeaders = players
                .filter(p => p.potw_winner === maxPotwValue && maxPotwValue > 0)
                .map(p => p.nama.toUpperCase());
            
            let potyText = "";
            if (potyLeaders.length > 0) {
                const namesJoined = potyLeaders.join(" & ");
                potyText = `👑 POTY LEADER: ${namesJoined} (${maxPotwValue} WINS) --- `;
            }

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

            tickerEl.innerText = `📢 NEWS UPDATE: ${leader.toUpperCase()} MEMIMPIN KLASEMEN! --- ${potyText}💰 TOP 3 MARKET VALUE: ${topMarketValues} --- ⭐ BEST PLAYER OF THE WEEK: ${bestPlayerText} --- 🔥 TOP SCORER: ${topScorerData.nama.toUpperCase()} (${topScorerData.goals} GOALS) ---`;
        }

        renderTable(players); 
        
        const topScorers = [...players].sort((a, b) => b.goals - a.goals).slice(0, 3);
        renderTopScorer(topScorers);
        renderPotyPodium(players);

        document.getElementById('status').innerText = "LIVE • TERKONEKSI";
    } catch (e) { 
        console.error(e);
        document.getElementById('status').innerText = "OFFLINE"; 
    }
}

function renderPotyPodium(players) {
    const container = document.getElementById("potyPodium");
    if(!container) return;
    container.innerHTML = "";

    const uniqueWins = [...new Set(players.map(p => p.potw_winner))]
        .filter(win => win > 0)
        .sort((a, b) => b - a);
    
    const topLevels = uniqueWins.slice(0, 3);
    const totalWinsKolektif = players.reduce((acc, p) => acc + (p.potw_winner || 0), 0);

    topLevels.forEach((winValue, index) => {
        const levelPlayers = players.filter(p => p.potw_winner === winValue);
        const percentage = ((winValue / totalWinsKolektif) * 100).toFixed(1);

        const row = document.createElement("div");
        row.className = `poty-level-row level-${index + 1}`;
        
        let content = `
            <div style="width:100%; font-size:11px; font-weight:900; color:#facc15; margin-bottom:10px; text-shadow: 0 0 5px rgba(0,0,0,0.5); letter-spacing: 2px;">
                RANK ${index + 1} • ${percentage}% PROBABILITY
            </div>
        `;
        
        levelPlayers.forEach(p => {
            content += `
                <div class="poty-card-small">
                    <img src="${p.logo}" class="poty-photo-small" style="border-color: ${index === 0 ? '#facc15' : (index === 1 ? '#bdc3c7' : '#d97706')}">
                    <div style="font-size:10px; font-weight:800; color:white; margin-top:5px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                        ${p.nama.toUpperCase()}
                    </div>
                </div>
            `;
        });

        row.innerHTML = content;
        container.appendChild(row);
    });
}

function renderTable(players) {
    const body = document.querySelector("#mainTable tbody");
    if(!body) return;
    body.innerHTML = "";

    const totalPoinKolektif = players.reduce((acc, p) => acc + (p.potw_winner || 0), 0);

    players.forEach((p, i) => {
        const tr = document.createElement("tr");
        const currentRank = i + 1;
        
        const persentase = totalPoinKolektif > 0 
            ? ((p.potw_winner / totalPoinKolektif) * 100).toFixed(1) 
            : 0;

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

        const diff = history.length > 1 ? history[history.length - 2] - currentRank : 0;
        let diffText = diff > 0 ? `+${diff}` : (diff < 0 ? diff : "-");
        let diffClass = diff > 0 ? "pos-up" : (diff < 0 ? "pos-down" : "");

        // --- LOGIKA KARTU KUNING (DIBENAHI) ---
        let yellowCardsHTML = "";
        for (let j = 0; j < Math.min(p.yellowCards, 3); j++) {
            yellowCardsHTML += `<span style="display:inline-block; width:10px; height:14px; background:#facc15; border-radius:2px; margin-left:5px; border:1px solid rgba(0,0,0,0.2); vertical-align: middle;" title="Pelanggaran"></span>`;
        }

        let potwContent = "";
        const currentRate = p.rate || "0"; 
        
        if (p.potw.toLowerCase().includes("best player")) {
            potwContent = `
                <div style="display: flex; align-items: center; justify-content: center; gap: 5px;">
                    <strong style="font-size: 0.9rem;">${currentRate}</strong>
                    <span class="potw-highlight">BEST PLAYER OF THE WEEK</span>
                </div>`;
        } else {
            potwContent = `<strong style="font-size: 0.9rem; opacity: 0.8;">${currentRate}</strong>`;
        }
        
        if(currentRank === 1) {
            tr.className = "rank-1";
        } else if(currentRank === 2) {
            tr.className = "rank-2";
        } else if(currentRank === 3) {
            tr.className = "rank-3";
        } else if(currentRank === 9 || currentRank === 10) {
            tr.className = "degradasi";
        }

        tr.innerHTML = `
            <td>${currentRank}</td>
            <td style="text-align:left">
                <div class="team-wrapper">
                    <img src="${p.logo}" class="team-logo" onclick="openModal('${p.nama}', '${p.logo}')">
                    <span class="team-name">${p.nama}${yellowCardsHTML}</span>
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

    const maxPercentValue = Math.max(...allPlayers.map(p => parseFloat(p.percent) || 0));
    const topPOTYGroup = allPlayers.filter(p => (parseFloat(p.percent) || 0) === maxPercentValue);
    const leaderNames = topPOTYGroup.map(p => p.name).join(", ").replace(/, ([^,]*)$/, " & $1");

    let text = "🗞️ *FOOTBALL LEAGUE-I OFFICIAL REPORT* 🗞️\n";
    text += `📅 _Update: ${dateStr} | ${timeStr} WIB_\n`;
    text += "----------------------------------------------\n\n";
    text += "🏆 *LEAGUE STANDINGS & BALLON D'OR %*\n";
    allPlayers.forEach((p, index) => {
        const potwIcon = p.potwStatus.toLowerCase().includes("best player") ? "⭐" : "";
        const pos = (index + 1).toString().padStart(2, '0');
        text += `\`${pos}.\` *${p.name}* • ${p.pts} Pts (${p.percent}) ${potwIcon}\n`;
    });

    text += `\n👑 *BALLON D'OR LEADER:* ${leaderNames}\n`;
    text += "----------------------------------------------\n\n";
    text += "📑 *Digital Card, Market Value, & Certificates:* \n";
    text += "https://smartpeopleindonesia123321-source.github.io/Klasemen-League-I/\n\n";

    window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent(text), '_blank');
}

const jerseyColors = {
    "Dandi": { primary: "#4b2c20", secondary: "#d4af37" },
    "Aldi": { primary: "#f3f4f6", secondary: "#60a5fa" },
    "Regi": { primary: "#2d3436", secondary: "#00f2ff" },
    "Rizal": { primary: "#636e72", secondary: "#ffffff" },
    "Asep": { primary: "#8b0000", secondary: "#facc15" },
    "Aries": { primary: "#1a1a1a", secondary: "#fbbf24" },
    "Ikmal": { primary: "#3f6212", secondary: "#a3e635" },
    "Muiz": { primary: "#be185d", secondary: "#f472b6" },
    "Abdul": { primary: "#000000", secondary: "#ffffff" },
    "Dicky": { primary: "#1e1b4b", secondary: "#d4af37" }
};

const originalOpenModal = openModal;
openModal = function(name, logo) {
    originalOpenModal(name, logo);
    const colorData = jerseyColors[name];
    const modalContent = document.querySelector('.modal-content');
    if (colorData && modalContent) {
        modalContent.style.transition = "all 0.5s ease";
        modalContent.style.background = `linear-gradient(135deg, ${colorData.primary} 0%, #111 100%)`;
        modalContent.style.borderColor = colorData.secondary;
        modalContent.style.boxShadow = `0 0 30px ${colorData.secondary}44`;
    } else if (modalContent) {
        modalContent.style.background = "var(--modal-bg)";
        modalContent.style.borderColor = "var(--accent)";
    }
};

const predatorDatabase = {
    "Dandi": { slogan: "THE MOUNTAIN CRUSHER", music: "assets/dandi.mp3" },
    "Aldi": { slogan: "THE WHITE SHADOW", music: "assets/Aldi.mp3" },
    "Regi": { slogan: "THE ARCTIC GUARDIAN", music: "assets/regi.mp3" },
    "Rizal": { slogan: "THE MIDNIGHT HUNTER", music: "assets/rizal.mp3" },
    "Asep": { slogan: "THE IRON HORN", music: "assets/asep.mp3" },
    "Aries": { slogan: "THE GOLDEN EMPEROR", music: "assets/aries.mp3" },
    "Ikmal": { slogan: "THE FOREST GHOST", music: "assets/ikmal.mp3" },
    "Muiz": { slogan: "THE SPEED DEMON", music: "assets/Muiz.mp3" },
    "Abdul": { slogan: "THE MYSTIC PHANTOM", music: "assets/Abdul.mp3" },
    "Dicky": { slogan: "THE KING OF THE JUNGLE", music: "assets/dicky.mp3" }
};

const sigPlayer = new Audio();
let isMainMusicActive = false;

const backupOpenModal = openModal;
openModal = function(name, logo) {
    if (typeof backupOpenModal === 'function') backupOpenModal(name, logo);
    const sloganArea = document.getElementById('playerSlogan');
    if (sloganArea && predatorDatabase[name]) { sloganArea.innerText = predatorDatabase[name].slogan; }
    const mainTrack = document.getElementById('uclMusic');
    if (mainTrack && !mainTrack.paused) { isMainMusicActive = true; mainTrack.pause(); }
    if (predatorDatabase[name]) {
        sigPlayer.src = predatorDatabase[name].music;
        sigPlayer.volume = 0.6;
        sigPlayer.play().catch(e => console.log("Interaksi dibutuhkan untuk audio"));
    }
};

const backupCloseModal = closeModal;
closeModal = function() {
    if (typeof backupCloseModal === 'function') backupCloseModal();
    const sloganArea = document.getElementById('playerSlogan');
    if (sloganArea) sloganArea.innerText = "";
    sigPlayer.pause();
    sigPlayer.currentTime = 0;
    const mainTrack = document.getElementById('uclMusic');
    if (isMainMusicActive && mainTrack) { mainTrack.play(); }
};

const CHAT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyf6o6U3vAceeTdKM1Rb8WGWKcTScj4wHFiUytK4yLbp7FYs16dHMQVVWZVdPfzaYv3Dw/exec";

async function loadComments() {
    try {
        const response = await fetch(`${CHAT_SCRIPT_URL}?t=${new Date().getTime()}`);
        const comments = await response.json();
        const display = document.getElementById('commentDisplay');
        if (!display) return;
        if (!comments || comments.length === 0) {
            display.innerHTML = '<p style="text-align:center; color:#666; font-size:12px; margin-top:20px;">Belum ada obrolan...</p>';
            return;
        }
        const formatWaktu = (isoString) => {
            const d = new Date(isoString);
            if (isNaN(d.getTime())) return isoString;
            return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
        };
        display.innerHTML = comments.map(c => `
            <div class="chat-msg-item" style="margin-bottom:10px; border-left:3px solid var(--accent); background:rgba(255,255,255,0.03); padding:8px; border-radius:4px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                    <b style="color:#facc15; font-size:12px;">${c.nama}</b>
                    <span style="font-size:9px; color:rgba(255,255,255,0.4); font-family:monospace;">${formatWaktu(c.waktu)}</span>
                </div>
                <p style="margin:0; font-size:13px; color:#ddd; line-height:1.4;">${c.pesan}</p>
            </div>
        `).join('');
        display.scrollTop = display.scrollHeight;
    } catch (error) { console.log("Chat sync pending..."); }
}

async function sendComment() {
    const nameInput = document.getElementById('userName');
    const commentInput = document.getElementById('userComment');
    const sendBtn = document.getElementById('btnSendComment');
    const nama = nameInput.value.trim();
    const pesan = commentInput.value.trim();
    if (!nama || !pesan) { alert("Nama & Pesan jangan kosong ya!"); return; }
    sendBtn.disabled = true;
    sendBtn.innerText = "MENGIRIM...";
    try {
        const bodyData = new URLSearchParams();
        bodyData.append('nama', nama);
        bodyData.append('pesan', pesan);
        await fetch(CHAT_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: bodyData });
        commentInput.value = "";
        setTimeout(loadComments, 1500);
    } catch (error) { alert("Gagal kirim, coba lagi bro!"); } 
    finally { sendBtn.disabled = false; sendBtn.innerText = "KIRIM"; }
}

document.addEventListener('DOMContentLoaded', () => {
    loadComments();
    setInterval(loadComments, 7000);
});
