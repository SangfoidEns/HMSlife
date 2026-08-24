/**
 * Biorhythm Engine (Pure Math & CS Level)
 * 
 * Теорія біоритмів базується на періодичних синусоїдальних циклах від дати народження:
 * - Фізичний цикл: 23 дні
 * - Емоційний цикл: 28 днів
 * - Інтелектуальний цикл: 33 дні
 * 
 * Значення варіюються від -100% до +100%.
 */
const BiorhythmEngine = (() => {
    const CYCLES = {
        PHYSICAL: 23,
        EMOTIONAL: 28,
        INTELLECTUAL: 33
    };

    /**
     * Розраховує відсоток циклу за формулою: sin(2 * PI * days / cycle) * 100
     * Повертає діапазон від -100% до +100%
     */
    function calculateSingleCycle(birthDate, targetDate, cyclePeriod) {
        if (!birthDate) return 0;
        
        const birth = new Date(birthDate);
        const target = new Date(targetDate);
        
        // Різниця в часі в мілісекундах -> дні
        const diffTime = target.getTime() - birth.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (isNaN(diffDays)) return 0;

        const radians = (2 * Math.PI * diffDays) / cyclePeriod;
        return Math.round(Math.sin(radians) * 100);
    }

    function getBiorhythms(birthDate, targetDate = new Date()) {
        return {
            phys: calculateSingleCycle(birthDate, targetDate, CYCLES.PHYSICAL),
            emo: calculateSingleCycle(birthDate, targetDate, CYCLES.EMOTIONAL),
            intel: calculateSingleCycle(birthDate, targetDate, CYCLES.INTELLECTUAL)
        };
    }

    return { getBiorhythms };
})();
