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

// --- LOGIKA MUSIK ---
const audio = document.getElementById('uclMusic');
let isPlaying = false;
const musicBtn = document.createElement('div');
musicBtn.className = 'music-control';
musicBtn.style.display = 'flex';
musicBtn.style.alignItems = 'center';
musicBtn.style.justifyContent = 'center';
musicBtn.style.cursor = 'pointer';
musicBtn.innerHTML = '🔇';
document.body.appendChild(musicBtn);

musicBtn.addEventListener('click', () => {
    if (!isPlaying) {
        audio.play().then(() => {
            musicBtn.innerHTML = '🔊'; // Icon suara nyala
            isPlaying = true;
        }).catch(() => alert("Klik layar mana saja dulu bro!"));
    } else {
        audio.pause();
        musicBtn.innerHTML = '󱝏'; // Gunakan simbol mute (atau '✕' kecil)
        // Alternatif paling aman jika icon di atas gak muncul:
        // musicBtn.innerHTML = '<span style="font-size:14px">OFF</span>'; 
        isPlaying = false;
    }
});

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
        document.getElementById('status').innerText = "KONEKSI TERPUTUS";
    }
}

// --- RENDER TABEL ---
function renderTable(players) {
    const table = document.querySelector("#mainTable tbody");
    if (!table) return;
    table.innerHTML = "";

    players.forEach((p, i) => {
        const tr = document.createElement("tr");
        const rankSekarang = i + 1;
        const selisih = p.rankLama - rankSekarang;

        let yEnd = 10, color = "#64748b";
        if (selisih > 0) { yEnd = 2; color = "#22c55e"; }
        else if (selisih < 0) { yEnd = 18; color = "#ef4444"; }

        const sparkline = `<svg width="40" height="20" style="display:block;margin:auto"><polyline fill="none" stroke="${color}" stroke-width="2" points="0,10 20,10 40,${yEnd}"/><circle cx="40" cy="${yEnd}" r="2" fill="${color}"/></svg>`;

        let trendText = `<span style="color:#64748b">-</span>`;
        if (selisih > 0) trendText = `<span style="color:#22c55e">▲ ${selisih}</span>`;
        else if (selisih < 0) trendText = `<span style="color:#ef4444">▼ ${Math.abs(selisih)}</span>`;

        if (rankSekarang === 1) tr.classList.add("rank-1");
        else if (rankSekarang === 2) tr.classList.add("rank-2");
        else if (rankSekarang === 3) tr.classList.add("rank-3");
        
        if (rankSekarang === players.length && players.length > 1) {
            tr.classList.add("degradasi");
        }

        tr.innerHTML = `
            <td>${rankSekarang}</td>
            <td style="text-align:left">
                <div class="team-wrapper">
                    <img src="${p.logo}" class="team-logo" onclick="openModal('${p.nama}')">
                    <span class="team-name">${p.nama}</span>
                </div>
            </td>
            <td><strong>${p.point}</strong></td>
            <td>${p.goals}</td>
            <td>${sparkline}</td>
            <td style="font-weight:bold">${trendText}</td>
        `;
        table.appendChild(tr);
    });
}

// --- MODAL STATUS ---
function openModal(name) {
    const data = animalDatabase[name] || { sp: "Misterius", atk: 50, def: 50, spd: 50, desc: "-" };
    document.getElementById('modalBody').innerHTML = `
        <h2 class="team-name" style="font-size:18px; color:var(--accent); margin-bottom:15px; text-transform:uppercase;">
            ${data.sp}
        </h2>
        <div class="stat-item">
            <span>ATK</span>
            <div class="progress-bg"><div class="progress-fill atk" style="width:${data.atk}%"></div></div>
            <span>${data.atk}</span>
        </div>
        <div class="stat-item">
            <span>DEF</span>
            <div class="progress-bg"><div class="progress-fill def" style="width:${data.def}%"></div></div>
            <span>${data.def}</span>
        </div>
        <div class="stat-item">
            <span>SPD</span>
            <div class="progress-bg"><div class="progress-fill spd" style="width:${data.spd}%"></div></div>
            <span>${data.spd}</span>
        </div>
        <p style="font-family: 'Segoe UI', sans-serif; font-size:12px; font-style: normal; color:#ccc; margin-top:15px; background:rgba(255,255,255,0.05); padding:10px; border-radius:8px; line-height: 1.6;">
            "${data.desc}"
        </p>
    `;
    document.getElementById('animalModal').style.display = 'block';
}

function closeModal() { document.getElementById('animalModal').style.display = 'none'; }
window.onclick = function(e) { if(e.target.className === 'modal-overlay') closeModal(); }

// Jalankan Fetch Pertama
fetchData();
// Auto refresh setiap 30 detik
setInterval(fetchData, 30000);

