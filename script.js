const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4v_ziMtwhRpQxS5ZnIbO9olIrUlzAAx8X5kS_Yr-Mv_GqDqSsg4Lc-1YNugRqElvUClbXnsf5gu12/pub?gid=0&single=true&output=csv';

const animalDatabase = {
    "Dandi": { sp: "Dandi sang Beruang Grizzly", atk: 95, def: 90, spd: 70, desc: "Kekuatan murni yang tak tertandingi." },
    "Erni": { sp: "Erni sang Kucing Angora", atk: 65, def: 55, spd: 92, desc: "Gerakan halus namun penuh perhitungan." },
    "Regi": { sp: "Regi sang Siberian Husky", atk: 80, def: 85, spd: 88, desc: "Loyalitas tanpa batas dan keberanian." },
    "Rizal": { sp: "Rizal sang Serigala Kutub", atk: 88, def: 75, spd: 95, desc: "Pemburu taktis yang sangat cerdas." },
    "Asep": { sp: "Asep sang Banteng Spanyol", atk: 92, def: 88, spd: 75, desc: "Simbol kekuatan tak terbendung." },
    "Aries": { sp: "Aries sang Singa Siberia", atk: 96, def: 82, spd: 85, desc: "Aumannya adalah peringatan musuh." },
    "Ikmal": { sp: "Ikmal sang Rusa Kutub", atk: 70, def: 75, spd: 94, desc: "Kelincahan yang sulit ditangkap." },
    "Yanti": { sp: "Yanti sang Kelinci Afrika", atk: 60, def: 50, spd: 98, desc: "Daya ledak kecepatan mengejutkan." },
    "Maya": { sp: "Maya sang Panda Tiongkok", atk: 85, def: 95, spd: 60, desc: "Rahang kuat di balik ketenangan." },
    "Dicky": { sp: "Dicky sang Raja Kingkong", atk: 98, def: 98, spd: 65, desc: "Benteng pertahanan terakhir." }
};

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

function renderTable(players) {
    const table = document.querySelector("#mainTable tbody");
    table.innerHTML = "";

    players.forEach((p, i) => {
        const tr = document.createElement("tr");
        const rankSekarang = i + 1;
        const selisih = p.rankLama - rankSekarang;

        // SPARKLINE LOGIC
        let yStart = 10, yEnd = 10, color = "#64748b";
        if (selisih > 0) { yEnd = 2; color = "#22c55e"; }
        else if (selisih < 0) { yEnd = 18; color = "#ef4444"; }

        const sparkline = `
            <svg width="40" height="20" style="display:block; margin:auto">
                <polyline fill="none" stroke="${color}" stroke-width="2" points="0,${yStart} 20,${yStart} 40,${yEnd}" />
                <circle cx="40" cy="${yEnd}" r="2" fill="${color}" />
            </svg>`;

        let trendText = `<span style="color:#64748b">-</span>`;
        if (selisih > 0) trendText = `<span style="color:#22c55e">▲ ${selisih}</span>`;
        else if (selisih < 0) trendText = `<span style="color:#ef4444">▼ ${Math.abs(selisih)}</span>`;

        if (i === 0) tr.classList.add("rank-1");
        else if (i === 1) tr.classList.add("rank-2");
        else if (i === 2) tr.classList.add("rank-3");

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
            <td>${sparkline}</td>
            <td style="font-weight:bold">${trendText}</td>
        `;
        table.appendChild(tr);
    });
}

function openModal(name) {
    const data = animalDatabase[name] || { sp: "Misterius", atk: 50, def: 50, spd: 50, desc: "-" };
    document.getElementById('modalBody').innerHTML = `
        <h2 style="font-size:16px; color:var(--accent)">${data.sp}</h2>
        <div class="stat-item"><span>ATK</span><div class="progress-bg"><div class="progress-fill atk" style="width:${data.atk}%"></div></div><span>${data.atk}</span></div>
        <div class="stat-item"><span>DEF</span><div class="progress-bg"><div class="progress-fill def" style="width:${data.def}%"></div></div><span>${data.def}</span></div>
        <div class="stat-item"><span>SPD</span><div class="progress-bg"><div class="progress-fill spd" style="width:${data.spd}%"></div></div><span>${data.spd}</span></div>
        <p style="font-size:11px; font-style:italic; color:#ccc">"${data.desc}"</p>
    `;
    document.getElementById('animalModal').style.display = 'block';
}

function closeModal() { document.getElementById('animalModal').style.display = 'none'; }
function closeModalOutside(e) { if(e.target.id === 'animalModal') closeModal(); }

fetchData();
setInterval(fetchData, 30000);
