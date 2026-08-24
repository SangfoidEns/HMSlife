/**
 * UI Component Renderer & View Controller
 */
const ComponentRenderer = (() => {
    const MENU_SCHEDULE = {
        0: "🥞 Недільний релакс: Млинці + Каша з підливою / Доїдаємо залишки.",
        1: "🍲 Базовий суп + Тушкована капуста (база на 3 дні).",
        2: "🍳 Розігрів супу + Свіжа яєчня на сніданок.",
        3: "🍚 Смачний плов + Салат з огірків та помідорів.",
        4: "🐟 Смажена риба + Ніжне пюре.",
        5: "🥘 Ситне жаркое з м'ясом та картоплею.",
        6: "🦀 Розігрів жаркое + Швидкий крабовий салат."
    };

    function renderTasks(state, onAddChunk) {
        const container = document.getElementById('tasks-list');
        container.innerHTML = state.tasks.map(task => {
            const isCompleted = task.doneChunks >= task.totalChunks;
            let dotsHTML = '';
            for (let i = 0; i < task.totalChunks; i++) {
                const isDone = i < task.doneChunks;
                dotsHTML += `<div class="chunk-dot ${isDone ? 'done' : ''}"></div>`;
            }

            return `
                <div class="task-card" style="opacity: ${isCompleted ? 0.5 : 1}">
                    <div class="task-info">
                        <div class="task-name">${isCompleted ? '✅ ' : ''}${task.name}</div>
                        <div class="task-meta">${task.doneChunks * 15} / ${task.totalChunks * 15} хв накопичено</div>
                        <div class="chunks-container">${dotsHTML}</div>
                    </div>
                    <button class="btn-add-chunk" data-task-id="${task.id}">+15 хв</button>
                </div>
            `;
        }).join('');

        // Attach Event Listeners
        container.querySelectorAll('.btn-add-chunk').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-task-id');
                onAddChunk(id);
            });
        });
    }

    function renderBiometrics(state, biorhythms) {
        document.getElementById('input-dob').value = state.user.dob || '';
        document.getElementById('input-weight').value = state.user.weight || '';
        document.getElementById('input-sleep').value = state.user.sleep || '';

        updateBioDisplay('phys', biorhythms.phys);
        updateBioDisplay('intel', biorhythms.intel);
        updateBioDisplay('emo', biorhythms.emo);
    }

    function updateBioDisplay(id, val) {
        // Конвертуємо шкалу з [-100, +100] в UI відсотки [0%, 100%] для прогрес-бару
        const uiPercentage = Math.round(((val + 100) / 200) * 100);
        document.getElementById(`bio-${id}-val`).innerText = `${val > 0 ? '+' : ''}${val}%`;
        document.getElementById(`bio-${id}-bar`).style.width = `${uiPercentage}%`;
    }

    function renderMenu() {
        const day = new Date().getDay();
        document.getElementById('menu-today-description').innerText = MENU_SCHEDULE[day];
    }

    function renderNotes(state, onDeleteNote) {
        const container = document.getElementById('notes-list');
        if (state.notes.length === 0) {
            container.innerHTML = `<div style="color:var(--text-muted); font-size:0.85rem; text-align:center; padding: 20px;">Записів поки немає.</div>`;
            return;
        }

        container.innerHTML = state.notes.map(note => `
            <div class="card note-item">
                <div class="note-text">${note.text}</div>
                <div class="note-footer">
                    <span class="note-date">${note.date}</span>
                    <button class="btn-delete-note" data-note-id="${note.id}">Видалити</button>
                </div>
            </div>
        `).join('');

        container.querySelectorAll('.btn-delete-note').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = Number(e.target.getAttribute('data-note-id'));
                onDeleteNote(id);
            });
        });
    }

    return {
        renderTasks,
        renderBiometrics,
        renderMenu,
        renderNotes
    };
})();
