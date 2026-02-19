// Ganti fungsi openModal lu dengan yang ini bro:
function openModal(name) {
    const modal = document.getElementById('animalModal');
    const modalBody = document.getElementById('modalBody');
    const data = animalDatabase[name] || { sp: "Misterius", atk: 50, def: 50, spd: 50, desc: "Data belum tercatat." };
    
    // HTML di bawah ini yang bikin bar warnanya muncul
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
