const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4v_ziMtwhRpQxS5ZnIbO9olIrUlzAAx8X5kS_Yr-Mv_GqDqSsg4Lc-1YNugRqElvUClbXnsf5gu12/pub?gid=0&single=true&output=csv';

const animalDatabase = {
    "Dandi": { sp: "Dandi sang Beruang Grizzly", atk: 95, def: 90, spd: 70, desc: 'Kekuatan fisik mentah yang mampu merobek pertahanan apa pun.' },
    "Regi": { sp: "Regi sang Siberian Husky", atk: 80, def: 85, spd: 88, desc: 'Daya tahan jantung dan stamina yang hampir mustahil untuk dipatahkan.' },
    "Erni": { sp: "Erni sang Kucing Angora", atk: 65, def: 55, spd: 92, desc: 'Perwujudan dari kecepatan dan presisi yang mematikan.' },
    "Rizal": { sp: "Rizal sang Serigala Kutub", atk: 88, def: 75, spd: 95, desc: 'Kecerdasan taktis dipadukan dengan kecepatan kilat.' },
    "Asep": { sp: "Asep sang Banteng Spanyol", atk: 92, def: 88, spd: 75, desc: 'Simbol energi kinetik yang tak terbendung.' },
    "Aries": { sp: "Aries sang Singa Siberia", atk: 96, def: 82, spd: 85, desc: 'Mendominasi medan perang lewat aura intimidasi.' },
    "Ikmal": { sp: "Ikmal sang Rusa Kutub", atk: 70, def: 75, spd: 94, desc: 'Kelincahan navigasi di medan yang sulit.' },
    "Yanti": { sp: "Yanti sang Kelinci Afrika", atk: 60, def: 50, spd: 98, desc: 'Mampu berpindah posisi dalam sekejap mata.' },
    "Maya": { sp: "Maya sang Panda Tiongkok", atk: 85, def: 95, spd: 60, desc: 'Benteng pertahanan yang mustahil ditembus.' },
    "Dicky": { sp: "Dicky sang Raja Kingkong", atk: 98, def: 98, spd: 65, desc: 'Puncak hierarki kekuatan dengan pertahanan absolut.' }
};

// --- MUSIK ---
const audio = document.getElementById('uclMusic');
let isPlaying = false;
const musicBtn = document.createElement('div');
musicBtn.className = 'music-control';
musicBtn.innerHTML = '🔇';
document.body.appendChild(musicBtn);

musicBtn.addEventListener('click', () => {
    if (!isPlaying) {
        audio.play().then(() => { musicBtn.innerHTML = '🔊'; isPlaying = true; });
    } else {
        audio.pause(); musicBtn.innerHTML = '🔇'; isPlaying = false;
    }
});

// --- DATA FETCH ---
async function fetchData() {
    try {
        const res = await fetch(`${sheetUrl}&nocache=${new Date().getTime()}`);
        const csv = await res.text();
        const players = csv.split('\n').slice(1).map(line => {
            const [nama, pt, gd, logo] = line.split(',').map(c => c.trim().replace(/"/g, ''));
            return { nama, point: parseInt(pt) || 0, goals: parseInt(gd) || 0, logo };
        }).filter(p => p.nama);

        players.sort((a, b) => b.point - a.point || b.goals - a.goals);
        renderTable(players);
        document.getElementById('status').innerText = "LIVE • TERKONEKSI";
    } catch (e) { document.getElementById('status').innerText = "OFFLINE"; }
}

function renderTable(players) {
    const body = document.querySelector("#mainTable tbody");
    body.innerHTML = "";
    players.forEach((p, i) => {
        const tr = document.createElement("tr");
        const rank = i + 1;
        if(rank === 1) tr.className = "rank-1";
        else if(rank === 2) tr.className = "rank-2";
        else if(rank === 3) tr.className = "rank-3";
        else if(rank === players.length) tr.className = "degradasi";

        tr.innerHTML = `
            <td>${rank}</td>
            <td style="text-align:left">
                <div class="team-wrapper">
                    <img src="${p.logo}" class="team-logo" onclick="openModal('${p.nama}', '${p.logo}')">
                    <span class="team-name">${p.nama}</span>
                </div>
            </td>
            <td><strong>${p.point}</strong></td>
            <td>${p.goals}</td>
            <td><svg width="40" height="20"><line x1="0" y1="10" x2="40" y2="10" stroke="#444" stroke-width="2"/></svg></td>
            <td>-</td>
        `;
        body.appendChild(tr);
    });
}

function openModal(name, logo) {
    const d = animalDatabase[name] || { sp: name, atk: 50, def: 50, spd: 50, desc: "-" };
    document.getElementById('modalBody').innerHTML = `
        <img src="${logo}" class="modal-photo">
        <h2 class="team-name" style="color:var(--accent); margin-bottom:20px;">${d.sp}</h2>
        <div class="stat-item"><span>ATK</span><div class="progress-bg"><div class="progress-fill atk" style="width:${d.atk}%"></div></div><span>${d.atk}</span></div>
        <div class="stat-item"><span>DEF</span><div class="progress-bg"><div class="progress-fill def" style="width:${d.def}%"></div></div><span>${d.def}</span></div>
        <div class="stat-item"><span>SPD</span><div class="progress-bg"><div class="progress-fill spd" style="width:${d.spd}%"></div></div><span>${d.spd}</span></div>
        <p style="font-size:12px; color:#ccc; margin-top:15px; line-height:1.5; font-family:sans-serif;">"${d.desc}"</p>
    `;
    document.getElementById('animalModal').style.display = 'block';
}

function closeModal() { document.getElementById('animalModal').style.display = 'none'; }
fetchData();
setInterval(fetchData, 30000);
