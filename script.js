// --- JavaScript from script.js ---
document.addEventListener('DOMContentLoaded', function() {
    
    // --- Mensajes de felicitación personalizados ---
    const semesterMessages = [
        "¡Mi vida hermosa, superaste este semestre! Estoy tan orgulloso de ti, amor mío.",
        "¡Felicidades, mi preciosa! Conquistaste este semestre.",
        "¡Lo lograste, mi niña hermosa! Cada ramo aprobado es un paso más para el futuro que sueñas.",
        "¡Adelante, belleza! Este semestre quedó atrás y tú sigues conquistando el mundo.",
        "¡Bien hecho, preciosa! Estás cada día más cerca de cumplir tus sueños.",
        "¡Misión cumplida, mi amor! Has demostrado tu fuerza y tu luz una vez más.",
        "¡Un semestre menos, mi vida! Sigue brillando con esa pasión que me enamora.",
        "¡Victoria, mi niña hermosa! Tu dedicación es tu mejor superpoder.",
        "¡Excelente, amor mío! Tu esfuerzo hoy es la semilla del éxito de mañana."
    ];

    const yearMessages = [
        "¡Mi vida, un año menos! Tu perseverancia me inspira cada día. ¡Vamos por el siguiente, amor mío!",
        "¡Increíble, mi preciosa! Completaste un año entero con esa fuerza que amo en ti.",
        "¡Felicidades, mi niña hermosa! Este año fue de crecimiento, amor y sueños cumplidos.",
        "¡Dominaste el año, belleza mía! Tu dedicación te hace única. ¡Celebremos este logro!",
        "¡Año completado, amor mío! Estás construyendo el futuro con esa belleza tuya.",
        "¡Gran avance, preciosa! Has superado un año de desafíos y brillas aún más.",
        "¡Felicidades, mi vida! Un año más de aprendizajes que te acercan a tus sueños.",
        "¡Un brindis por ti, amor mío! Cerraste este capítulo espectacularmente",
        "¡Lo hiciste otra vez, mi niña hermosa! Un año completo de logros y esfuerzo.",
        "¡Amor mío, Julianito está un año más cerca!"
    ];

    const ramos = document.querySelectorAll('.ramo');
    
    loadCompletedRamos();
    
    ramos.forEach(ramo => {
        ramo.addEventListener('click', function() {
            toggleRamoCompletion(this);
        });
    });
    
    function toggleRamoCompletion(ramoElement) {
        const wasCompleted = ramoElement.classList.contains('completado');
        
        if (wasCompleted) {
            ramoElement.classList.remove('completado');
            removeCompletedRamo(ramoElement.dataset.ramo);
            // Marcar el semestre como no celebrado si se desmarca un ramo
            ramoElement.closest('.column').dataset.celebrated = 'false';
        } else {
            ramoElement.classList.add('completado');
            saveCompletedRamo(ramoElement.dataset.ramo);
            checkCompletionStatus(ramoElement);
        }
    }

    function checkCompletionStatus(ramoElement) {
        const semesterColumn = ramoElement.closest('.column');
        // Salir si la columna ya fue celebrada en esta sesión
        if (!semesterColumn || semesterColumn.dataset.celebrated === 'true') {
            return;
        }

        const allRamosInSemester = semesterColumn.querySelectorAll('.ramo');
        const completedRamosInSemester = semesterColumn.querySelectorAll('.ramo.completado');

        // Si no se han completado todos los ramos del semestre, no hacer nada
        if (allRamosInSemester.length === 0 || allRamosInSemester.length !== completedRamosInSemester.length) {
            return;
        }

        // Marcar como celebrado para no repetir la animación en la misma sesión
        semesterColumn.dataset.celebrated = 'true';
        const semesterIndex = parseInt(semesterColumn.dataset.semesterIndex, 10);

        // Lógica corregida para mostrar el mensaje correcto
        // Si el índice es IMPAR, es el segundo semestre de un año.
        if (semesterIndex % 2 !== 0) {
            const partnerSemesterColumn = document.querySelector(`.column[data-semester-index="${semesterIndex - 1}"]`);
            const partnerRamos = partnerSemesterColumn.querySelectorAll('.ramo');
            const partnerCompletedRamos = partnerSemesterColumn.querySelectorAll('.ramo.completado');
            
            // Si el semestre par también está completo, se completó el AÑO.
            if (partnerRamos.length === partnerCompletedRamos.length) {
                const yearMessage = yearMessages[Math.floor(Math.random() * yearMessages.length)];
                showMilestoneNotification('¡Año Completado!', yearMessage, 'year');
            }
        } 
        // Si el índice es PAR, es el primer semestre de un año.
        else {
            const randomMessage = semesterMessages[Math.floor(Math.random() * semesterMessages.length)];
            showMilestoneNotification('¡Semestre Superado!', randomMessage, 'semester');
        }
    }

    function showMilestoneNotification(title, message, type) {
        const overlay = document.createElement('div');
        overlay.className = 'milestone-overlay';
        
        const modal = document.createElement('div');
        modal.className = `milestone-modal ${type}`;
        
        modal.innerHTML = `
            <div class="effects-container"></div>
            <h3>${title}</h3>
            <p>${message}</p>
            <button class="close-button">¡Continuar!</button>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Activar efectos visuales
        const effectsContainer = modal.querySelector('.effects-container');
        launchFireworks(effectsContainer);
        launchConfetti(effectsContainer);

        const close = () => {
            overlay.style.animation = 'fadeOut 0.3s forwards';
            overlay.addEventListener('animationend', () => overlay.remove(), { once: true });
        };

        modal.querySelector('.close-button').onclick = close;
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                close();
            }
        });
    }
    
    function launchFireworks(container) {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.className = 'particle firework';
                const x = Math.random() * 80 + 10;
                const y = Math.random() * 50 + 20;
                const color = `hsl(${Math.random() * 360}, 100%, 70%)`;
                firework.style.left = `${x}%`;
                firework.style.top = `${y}%`;
                firework.style.backgroundColor = color;
                
                const beforeStyle = document.createElement('style');
                const randomId = `fw-${Math.random().toString(36).substr(2, 9)}`;
                firework.id = randomId;
                beforeStyle.innerHTML = `
                    #${randomId}::before {
                        box-shadow: 0 0 15px 5px ${color}, 0 0 0 10px ${color}22;
                    }
                `;
                document.head.appendChild(beforeStyle);
                
                container.appendChild(firework);

                firework.addEventListener('animationend', () => {
                    firework.remove();
                    beforeStyle.remove();
                }, { once: true });
            }, Math.random() * 1000);
        }
    }

    function launchConfetti(container) {
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#ffeb3b', '#ffc107', '#ff9800'];
        for (let i = 0; i < 150; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'particle confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;
            confetti.style.animationDuration = `${Math.random() * 2 + 3}s`;
            container.appendChild(confetti);
            confetti.addEventListener('animationend', () => confetti.remove(), { once: true });
        }
    }

    function saveCompletedRamo(ramoId) {
        let completedRamos = JSON.parse(localStorage.getItem('completedRamosDerecho') || '[]');
        if (!completedRamos.includes(ramoId)) {
            completedRamos.push(ramoId);
            localStorage.setItem('completedRamosDerecho', JSON.stringify(completedRamos));
        }
    }
    
    function removeCompletedRamo(ramoId) {
        let completedRamos = JSON.parse(localStorage.getItem('completedRamosDerecho') || '[]');
        localStorage.setItem('completedRamosDerecho', JSON.stringify(completedRamos.filter(id => id !== ramoId)));
    }
    
    function loadCompletedRamos() {
        const completedRamos = JSON.parse(localStorage.getItem('completedRamosDerecho') || '[]');
        completedRamos.forEach(ramoId => {
            const ramoElement = document.querySelector(`[data-ramo="${ramoId}"]`);
            if (ramoElement) {
                ramoElement.classList.add('completado');
            }
        });
    }
})();

