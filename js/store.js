/**
 * Data Layer & State Management
 * Забезпечує збереження в LocalStorage, захист від XSS та міграції даних.
 */
const Store = (() => {
    const STORAGE_KEY = 'lifeos_planner_state_v5';

    const INITIAL_STATE = {
        version: 5,
        user: { dob: '2000-01-01', weight: 75, sleep: 8 },
        lastActiveDate: new Date().toLocaleDateString('sv-SE'),
        notes: [],
        tasks: [
            { id: 'code', name: '💻 Робота / Кодинг', totalChunks: 8, doneChunks: 0, defaultChunks: 8, category: 'work' },
            { id: 'clean', name: '🧹 Прибирання (швидке)', totalChunks: 2, doneChunks: 0, defaultChunks: 2, category: 'house' },
            { id: 'shop', name: '🛒 Похід в магазин', totalChunks: 2, doneChunks: 0, defaultChunks: 2, category: 'house' },
            { id: 'cook', name: '🍳 Готування їжі', totalChunks: 3, doneChunks: 0, defaultChunks: 3, category: 'house' },
            { id: 'read', name: '📚 Читання / Навчання', totalChunks: 2, doneChunks: 0, defaultChunks: 2, category: 'self' }
        ]
    };

    let state = {};

    function sanitizeString(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    function init() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                state = JSON.parse(raw);
            } else {
                state = { ...INITIAL_STATE };
            }
        } catch (e) {
            console.error('[Store] Помилка читання стану. Скидання до дефолтного.', e);
            state = { ...INITIAL_STATE };
        }

        checkMidnightReset();
        save();
    }

    function checkMidnightReset() {
        const today = new Date().toLocaleDateString('sv-SE');
        if (state.lastActiveDate !== today) {
            state.tasks.forEach(t => t.doneChunks = 0);
            state.lastActiveDate = today;
        }
    }

    function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function getState() {
        return state;
    }

    function updateTaskChunks(taskId, increment = 1) {
        const task = state.tasks.find(t => t.id === taskId);
        if (task) {
            task.doneChunks = Math.min(task.totalChunks, task.doneChunks + increment);
            save();
        }
    }

    function setTaskTotalChunks(taskId, total) {
        const task = state.tasks.find(t => t.id === taskId);
        if (task) {
            task.totalChunks = total;
            save();
        }
    }

    function setUserProfile(key, value) {
        state.user[key] = value;
        save();
    }

    function addNote(text) {
        if (!text.trim()) return;
        const newNote = {
            id: Date.now(),
            text: sanitizeString(text.trim()),
            date: new Date().toLocaleDateString('uk-UA', { hour: '2-digit', minute: '2-digit' })
        };
        state.notes.unshift(newNote);
        save();
    }

    function deleteNote(id) {
        state.notes = state.notes.filter(n => n.id !== id);
        save();
    }

    return {
        init,
        getState,
        updateTaskChunks,
        setTaskTotalChunks,
        setUserProfile,
        addNote,
        deleteNote
    };
})();
