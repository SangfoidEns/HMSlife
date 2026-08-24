/**
 * Application Entry Point & Controller
 */
document.addEventListener('DOMContentLoaded', () => {
    Store.init();

    let activeSprintTask = null;
    let timerInterval = null;
    let timeLeftSeconds = 15 * 60;

    function refreshUI() {
        const state = Store.getState();
        const biorhythms = BiorhythmEngine.getBiorhythms(state.user.dob);

        // Інтелектуальний адаптивний алгоритм підлаштування під Біоритми
        applyBiorhythmAdaptation(biorhythms);

        ComponentRenderer.renderTasks(state, (taskId) => {
            Store.updateTaskChunks(taskId, 1);
            refreshUI();
        });

        ComponentRenderer.renderBiometrics(state, biorhythms);
        ComponentRenderer.renderMenu();
        ComponentRenderer.renderNotes(state, (noteId) => {
            Store.deleteNote(noteId);
            refreshUI();
        });
    }

    function applyBiorhythmAdaptation(bio) {
        const banner = document.getElementById('ai-recommendation-banner');
        
        if (bio.intel < -30) {
            Store.setTaskTotalChunks('code', 4); // Скорочуємо складну задачу
            banner.innerHTML = "⚠️ <strong>Інтелектуальна фаза відновлення (< -30%).</strong> Навантаження зменшено до 4 блоків.";
        } else if (bio.intel > 50) {
            Store.setTaskTotalChunks('code', 12); // Збільшуємо при піку
            banner.innerHTML = "⚡ <strong>Інтелектуальний пік (> +50%)!</strong> Чудовий час для глибокої роботи (ціль: 12 блоків).";
        } else {
            Store.setTaskTotalChunks('code', 8);
            banner.innerHTML = "🌱 <strong>Стабільний стан.</strong> Стандартна продуктивність.";
        }
    }

    // --- Navigation Routing ---
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetViewId = e.target.getAttribute('data-target');
            
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

            document.getElementById(targetViewId).classList.add('active');
            e.target.classList.add('active');
        });
    });

    // --- Event Handlers ---
    document.getElementById('input-dob').addEventListener('change', (e) => {
        Store.setUserProfile('dob', e.target.value);
        refreshUI();
    });

    document.getElementById('input-weight').addEventListener('change', (e) => {
        Store.setUserProfile('weight', Number(e.target.value));
    });

    document.getElementById('input-sleep').addEventListener('change', (e) => {
        Store.setUserProfile('sleep', Number(e.target.value));
    });

    document.getElementById('btn-save-note').addEventListener('click', () => {
        const input = document.getElementById('note-input');
        Store.addNote(input.value);
        input.value = '';
        refreshUI();
    });

    // --- Timer System ---
    document.getElementById('btn-start-auto-sprint').addEventListener('click', () => {
        const state = Store.getState();
        const pendingTask = state.tasks.find(t => t.doneChunks < t.totalChunks);
        
        if (!pendingTask) {
            alert('🎉 Усі плани на сьогодні виконано!');
            return;
        }

        activeSprintTask = pendingTask;
        document.getElementById('timer-task-name').innerText = pendingTask.name;
        document.getElementById('timer-modal').classList.add('active');

        timeLeftSeconds = 15 * 60;
        updateTimerDisplay();

        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeftSeconds--;
            updateTimerDisplay();
            if (timeLeftSeconds <= 0) {
                completeSprint();
            }
        }, 1000);
    });

    function updateTimerDisplay() {
        const min = Math.floor(timeLeftSeconds / 60).toString().padStart(2, '0');
        const sec = (timeLeftSeconds % 60).toString().padStart(2, '0');
        document.getElementById('timer-countdown').innerText = `${min}:${sec}`;
    }

    function completeSprint() {
        clearInterval(timerInterval);
        if (activeSprintTask) {
            Store.updateTaskChunks(activeSprintTask.id, 1);
            activeSprintTask = null;
        }
        document.getElementById('timer-modal').classList.remove('active');
        refreshUI();
    }

    document.getElementById('btn-complete-sprint').addEventListener('click', completeSprint);
    document.getElementById('btn-cancel-sprint').addEventListener('click', () => {
        clearInterval(timerInterval);
        activeSprintTask = null;
        document.getElementById('timer-modal').classList.remove('active');
    });

    // Initial Render
    refreshUI();
});
