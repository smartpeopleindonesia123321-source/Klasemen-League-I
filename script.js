const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4v_ziMtwhRpQxS5ZnIbO9olIrUlzAAx8X5kS_Yr-Mv_GqDqSsg4Lc-1YNugRqElvUClbXnsf5gu12/pub?gid=0&single=true&output=csv';

const animalDatabase = {
    "Dandi": { sp: "Dandi sang Beruang Grizzly", desc: "Spesies beruang puncak yang dikenal sebagai penguasa daratan. Kekuatan murninya tak tertandingi, sanggup melumpuhkan lawan dengan satu hantaman dan melahap mangsanya secara brutal tanpa sisa" },
    "Erni": { sp: "Erni sang Kucing Angora", desc: "Di balik penampilannya yang anggun, tersimpan insting pemburu yang sangat tajam. Gerakannya sangat halus namun penuh perhitungan, mampu melakukan serangan kejutan yang tidak terduga." },
    "Regi": { sp: "Regi sang Siberian Husky", desc: "Memiliki loyalitas tanpa batas dan keberanian yang melegenda. Ia adalah pelindung sejati yang tak akan mundur dalam situasi genting, selalu siap mempertaruhkan segalanya demi kemenangan tim." },
    "Rizal": { sp: "Rizal sang Serigala Kutub", desc: "Pemburu taktis yang sangat cerdas dan setia pada kelompok. Ia mengintai dalam senyap, bergerak secepat kilat di tengah badai, dan menyerang titik lemah lawan dengan akurasi yang mematikan." },
    "Asep": { sp: "Asep sang Banteng Spanyol", desc: "Simbol kekuatan tak terbendung yang penuh amarah. Dengan tanduk yang kokoh dan insting menyerang yang tajam, ia akan menyeruduk siapa pun yang berani menghalangi jalurnya di arena." },
    "Aries": { sp: "Aries sang Singa Siberia", desc: "Predator penguasa wilayah dingin yang tangguh. Aumannya adalah peringatan bagi musuh, dan keberaniannya dalam memimpin perburuan menjadikannya raja yang paling disegani di medan laga." },
    "Ikmal": { sp: "Ikmal sang Rusa Kutub", desc: "Spesies pengembara yang memiliki ketahanan fisik luar biasa. Kelincahannya saat melintasi medan sulit membuatnya sangat sulit ditangkap, selalu selangkah lebih maju dari kejaran lawan." },
    "Yanti": { sp: "Yanti sang Kelinci Afrika", desc: "Kecil namun memiliki kecepatan dan daya ledak yang mengejutkan. Ia adalah ahli dalam hal meloloskan diri dan menyelinap, memanfaatkan kelincahannya untuk mengecoh musuh yang lebih besar." },
    "Maya": { sp: "Maya sang Panda Tiongkok", desc: "Terlihat tenang dan bersahabat, namun memiliki rahang yang sangat kuat dan tenaga yang tersembunyi. Ia adalah sosok yang sabar namun mematikan saat dipaksa untuk bertarung demi wilayahnya." },
    "Dicky": { sp: "Dicky sang Raja Kingkong", desc: "Kekuatan raksasa dari hutan rimba yang sangat dominan. Memiliki determinasi tinggi dan dominasi fisik yang luar biasa, ia adalah benteng pertahanan terakhir yang sulit untuk ditembus." }
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
        audio.play().catch(e => console.log("Klik interaksi diperlukan"));
        musicBtn.innerHTML = '🔊';
    } else {
        audio.pause();
        musicBtn.innerHTML = '🔇';
    }
    playing = !playing;
};

// --- SISTEM MODAL ---
function openModal(name) {
    const modal = document.getElementById('animalModal');
    const modalBody = document.getElementById('modalBody');
    const data = animalDatabase[name] || { sp: "Spesies Misterius", desc: "Data belum tercatat di database liga." };
    modalBody.innerHTML = `<h2 style="color:#00f2ff; margin-top:0;">${data.sp}</h2><p style="color:#cbd5e1; line-height:1.5;">"${data.desc}"</p>`;
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('animalModal').style.display = 'none';
}

function closeModalOutside(event) {
    if (event.target.id === 'animalModal') closeModal();
}

// --- DATA FETCHING ---
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
        renderTable(players);
        document.getElementById('status').innerText = "LIVE • TERKONEKSI";
    } catch (err) {
        document.getElementById('status').innerText = "KONEKSI TERPUTUS";
    }
}

function renderTable(players) {
    const tbody = document.querySelector("#mainTable tbody");
    tbody.innerHTML = "";

    players.forEach((p, i) => {
        const tr = document.createElement("tr");
        
        // CSS Rankings
        if (i === 0) tr.classList.add("rank-1");
        else if (i === 1) tr.classList.add("rank-2");
        else if (i === 2) tr.classList.add("rank-3");
        
        // Baris Terakhir = Degradasi
        if (i === players.length - 1 && players.length > 1) {
            tr.classList.add("degradasi");
        }

        tr.innerHTML = `
            <td>${i + 1}</td>
            <td style="text-align:left">
                <div class="team-wrapper">
                    <img src="${p.logo}" class="team-logo" onclick="openModal('${p.nama}')" onerror="this.src='https://via.placeholder.com/40'">
                    <span class="team-name">${p.nama}</span>
                </div>
            </td>
            <td><strong>${p.point}</strong></td>
            <td>${p.goals}</td>
            <td style="color:#00f2ff; font-size:10px;">━━━━</td>
            <td>-</td>
        `;
        tbody.appendChild(tr);
    });
}

fetchData();
setInterval(fetchData, 30000);



