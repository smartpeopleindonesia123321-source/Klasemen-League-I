const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4v_ziMtwhRpQxS5ZnIbO9olIrUlzAAx8X5kS_Yr-Mv_GqDqSsg4Lc-1YNugRqElvUClbXnsf5gu12/pub?gid=0&single=true&output=csv';

const animalDatabase = {
    "Dandi": { sp: "Dandi sang Beruang Grizzly", atk: 95, def: 90, spd: 70, desc: "Spesies beruang puncak yang dikenal sebagai penguasa daratan." },
    "Erni": { sp: "Erni sang Kucing Angora", atk: 65, def: 55, spd: 92, desc: "Di balik penampilannya yang anggun, tersimpan insting pemburu yang tajam." },
    "Regi": { sp: "Regi sang Siberian Husky", atk: 80, def: 85, spd: 88, desc: "Memiliki loyalitas tanpa batas dan keberanian yang melegenda." },
    "Rizal": { sp: "Rizal sang Serigala Kutub", atk: 88, def: 75, spd: 95, desc: "Pemburu taktis yang sangat cerdas dan setia pada kelompok." },
    "Asep": { sp: "Asep sang Banteng Spanyol", atk: 92, def: 88, spd: 75, desc: "Simbol kekuatan tak terbendung yang penuh amarah." },
    "Aries": { sp: "Aries sang Singa Siberia", atk: 96, def: 82, spd: 85, desc: "Predator penguasa wilayah dingin yang tangguh." },
    "Ikmal": { sp: "Ikmal sang Rusa Kutub", atk: 70, def: 75, spd: 94, desc: "Spesies pengembara yang memiliki ketahanan fisik luar biasa." },
    "Yanti": { sp: "Yanti sang Kelinci Afrika", atk: 60, def: 50, spd: 98, desc: "Kecil namun memiliki kecepatan dan daya ledak mengejutkan." },
    "Maya": { sp: "Maya sang Panda Tiongkok", atk: 85, def: 95, spd: 60, desc: "Terlihat tenang namun memiliki rahang yang sangat kuat." },
    "Dicky": { sp: "Dicky sang Raja Kingkong", atk: 98, def: 98, spd: 65, desc: "Kekuatan raksasa dari hutan rimba yang sangat dominan." }
};

// --- SISTEM MUSIK ---
const audio = document.getElementById('uclMusic');
const musicBtn = document.createElement('div');
musicBtn.className = 'music-control';
musicBtn.innerHTML = '🔇';
document.body.appendChild(musicBtn);

let playing = false;
musicBtn.onclick = () => {
    if (!playing) {
        audio.play().catch(e => console.log("Interaksi user diperlukan"));
        musicBtn.innerHTML = '🔊';
    } else {
        audio.pause();
        musicBtn.innerHTML = '🔇';
    }
    playing = !playing;
};

// --- MODAL ---
function openModal(name) {
    const modal = document.getElementById('animalModal');
    const modalBody = document.getElementById('modalBody');
    const data = animalDatabase[name] || { sp: "Misterius", atk: 50, def: 50, spd: 50, desc: "Data belum ada." };
    
    modalBody.innerHTML = `
        <div class="fifa-card">
            <h2 class="card-title">${data.sp}</h2>
            <div class="stats-container">
                <div class="stat-item">
                    <span>ATK</span>
                    <div class="progress-bg"><div class="progress-fill atk" style="width: ${data.atk}%"></div></div>
                    <span class="stat-val">${data.atk}</span>
                </div>
                <div class="stat-item">
                    <span>DEF</span>
                    <div class="progress-bg"><div class="progress-fill def" style="width: ${data.def}%"></div></div>
                    <span class="stat-val">${data.def}</span>
                </div>
                <div class="stat-item">
                    <span>SPD</span>
                    <div class="progress-bg"><div class="progress-fill spd" style="width: ${data.spd}%"></div></div>
                    <span class="stat-val">${data.spd}</span>
                </div>
            </div>
            <p class="card-desc">"${data.desc}"</p>
        </div>
    `;
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('animalModal').style.display = 'none';
}

// --- FETCH DATA ---
async function fetchData() {
    try {
        const response = await fetch(`${sheetUrl}&nocache=${new Date().getTime()}`);
        const csvText = await response.text();
        const lines = csvText.split(/\r?\n/);
        const players = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i]) continue;
            const cols = lines[i].split(',').map(c => c.replace(/^"|"$/g, '').trim());
            if (cols[0]) {
                players.push({
                    nama: cols[0],
                    point: parseInt(cols[1]) || 0,
                    goals: parseInt(cols[2]) || 0,
                    logo: cols[3] || ''
                });
            }
        }

        players.sort((a, b) => b.point - a.point || b.goals - a.goals);

        const lastPositions = JSON.parse(localStorage.getItem('league_ranks') || '{}');
        const currentPositions = {};
        players.forEach((p, index) => {
            const rankSekarang = index + 1;
            p.rankLama = lastPositions[p.nama] || rankSekarang;
            currentPositions[p.nama] = rankSekarang;
        });
        localStorage.setItem('league_ranks', JSON.stringify(currentPositions));

        renderTable(players);
        document.getElementById('status').innerText = "LIVE • TERKONEKSI";
    } catch (err) {
        console.error("Fetch error:", err);
        document.getElementById('status').innerText = "ERROR KONEKSI DATA";
    }
}

function renderTable(players) {
    const table = document.querySelector("#mainTable tbody");
    if (!table) return; // Pengaman jika table tidak ditemukan
    table.innerHTML = "";

    players.forEach((p, i) => {
        const tr = document.createElement("tr");
        const rankSekarang = i + 1;
        
        let trendHtml = `<span style="color:#64748b">-</span>`;
        if (rankSekarang < p.rankLama) {
            trendHtml = `<span style="color:#22c55e">▲ ${p.rankLama - rankSekarang}</span>`;
        } else if (rankSekarang > p.rankLama) {
            trendHtml = `<span style="color:#ef4444">▼ ${rankSekarang - p.rankLama}</span>`;
        }

        if (i === 0) tr.classList.add("rank-1");
        else if (i === 1) tr.classList.add("rank-2");
        else if (i === 2) tr.classList.add("rank-3");
        if (i === players.length - 1 && players.length > 1) tr.classList.add("degradasi");

        tr.innerHTML = `
            <td>${rankSekarang}</td>
            <td style="text-align:left">
                <div class="team-wrapper">
                    <img src="${p.logo}" class="team-logo" onclick="openModal('${p.nama}')" onerror="this.src='https://via.placeholder.com/40'">
                    <span class="team-name">${p.nama}</span>
                </div>
            </td>
            <td><strong>${p.point}</strong></td>
            <td>${p.goals}</td>
            <td style="font-weight:bold; font-size:13px;">${trendHtml}</td>
            <td style="color:#00f2ff; font-size:10px;">━━━━</td>
        `;
        table.appendChild(tr);
    });
}

// Jalankan fungsi
fetchData();
setInterval(fetchData, 30000);
