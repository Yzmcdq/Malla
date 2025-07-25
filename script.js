// --- JavaScript from script.js ---
document.addEventListener('DOMContentLoaded', function() {
    
    // --- Mensajes de felicitación ---
    const semesterMessages = [
        "¡Semestre superado! Un paso más cerca de la meta. ¡Excelente trabajo!",
        "¡Felicidades! Has conquistado este semestre con dedicación y esfuerzo.",
        "¡Lo lograste! Cada ramo aprobado es un pilar de tu futuro profesional.",
        "¡Impresionante! Tu constancia te ha llevado a superar este desafío.",
        "¡Adelante! Este semestre es historia. Prepárate para lo que viene.",
        "¡Bien hecho! La justicia y el derecho están un paso más cerca.",
        "¡Misión cumplida! Has demostrado tu capacidad y compromiso.",
        "¡Un semestre menos! Sigue cultivando tu mente y tu vocación.",
        "¡Victoria! El conocimiento es tu mejor argumento. Sigue así.",
        "¡Excelente! Tu esfuerzo de hoy es el éxito de mañana."
    ];

    const yearMessages = [
        "¡Un año menos! Tu perseverancia es admirable. ¡A por el siguiente!",
        "¡Increíble! Has completado un año entero. ¡Estás imparable!",
        "¡Felicitaciones por este gran hito! Un año de crecimiento y aprendizaje.",
        "¡Dominaste el año! Tu dedicación te distingue. ¡Celebra este logro!",
        "¡Año completado! Estás forjando un camino de excelencia en el derecho.",
        "¡Qué gran avance! Has superado un año de desafíos. ¡El futuro es tuyo!",
        "¡Felicidades, futuro colega! Un año más de experiencia y sabiduría.",
        "¡Un brindis por ti! Has cerrado un capítulo importante de tu carrera.",
        "¡Lo has vuelto a hacer! Un año completo de éxito. ¡Sigue brillando!",
        "¡La toga está un año más cerca! Sigue con esa pasión y determinación."
    ];

    const ramos = document.querySelectorAll('.ramo');
    
    loadCompletedRamos();
    
    ramos.forEach(ramo => {
        ramo.addEventListener('click', function() {
            toggleRamoCompletion(this);
        });
        
        ramo.addEventListener('mouseenter', function() {
            if (!this.classList.contains('completado')) {
                this.style.transform = 'translateY(-3px) scale(1.02)';
            }
        });
        
        ramo.addEventListener('mouseleave', function() {
            if (!this.classList.contains('completado')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
    
    function toggleRamoCompletion(ramoElement) {
        const wasCompleted = ramoElement.classList.contains('completado');
        
        if (wasCompleted) {
            ramoElement.classList.remove('completado');
            removeCompletedRamo(ramoElement.dataset.ramo);
            ramoElement.closest('.column').dataset.completed = 'false';
        } else {
            ramoElement.classList.add('completado');
            saveCompletedRamo(ramoElement.dataset.ramo);
            
            ramoElement.style.transform = 'scale(1.1)';
            setTimeout(() => ramoElement.style.transform = 'scale(1)', 200);
            
            // --- NEW: Lógica de hitos mejorada ---
            checkCompletionStatus(ramoElement);
        }
        
        updateStats();
    }

    // --- NEW: Lógica de verificación de hitos corregida ---
    function checkCompletionStatus(ramoElement) {
        const semesterColumn = ramoElement.closest('.column');
        if (!semesterColumn || semesterColumn.dataset.completed === 'true') {
            return;
        }

        const allRamosInSemester = semesterColumn.querySelectorAll('.ramo');
        const completedRamosInSemester = semesterColumn.querySelectorAll('.ramo.completado');

        if (allRamosInSemester.length === 0 || allRamosInSemester.length !== completedRamosInSemester.length) {
            return; // No se ha completado el semestre actual
        }

        // Marcar semestre como completado para no repetir la notificación
        semesterColumn.dataset.completed = 'true';
        const semesterIndex = parseInt(semesterColumn.dataset.semesterIndex, 10);

        // Si es un semestre par (el segundo del año), verificar si el año está completo
        if (semesterIndex % 2 !== 0) { // Índices 1, 3, 5, 7, 9
            const partnerSemesterIndex = semesterIndex - 1;
            const partnerSemesterColumn = document.querySelector(`.column[data-semester-index="${partnerSemesterIndex}"]`);
            // Se asume que el semestre anterior ya debe estar completado para llegar aquí
            if (partnerSemesterColumn && partnerSemesterColumn.querySelectorAll('.ramo.completado').length === partnerSemesterColumn.querySelectorAll('.ramo').length) {
                const yearMessage = yearMessages[Math.floor(Math.random() * yearMessages.length)];
                showMilestoneNotification('¡Año Completado!', yearMessage, 'year');
            }
        } else { // Si es un semestre impar (el primero del año), mostrar mensaje de semestre
            const randomMessage = semesterMessages[Math.floor(Math.random() * semesterMessages.length)];
            showMilestoneNotification('¡Semestre Superado!', randomMessage, 'semester');
        }
    }

    // --- NEW: Función para mostrar modal de felicitación ---
    function showMilestoneNotification(title, message, type) {
        const overlay = document.createElement('div');
        overlay.className = 'milestone-overlay';
        
        const modal = document.createElement('div');
        modal.className = `milestone-modal ${type}`;
        
        modal.innerHTML = `
            <h3>${title}</h3>
            <p>${message}</p>
            <button class="close-button">Cerrar</button>
            <div class="confetti-container"></div>
            <div class="firework-container"></div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Activar efectos
        launchFireworks(modal.querySelector('.firework-container'));
        launchConfetti(modal.querySelector('.confetti-container'));

        const close = () => {
            overlay.style.animation = 'fadeOut 0.3s forwards';
            overlay.addEventListener('animationend', () => overlay.remove());
        };

        modal.querySelector('.close-button').onclick = close;
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                close();
            }
        };
    }
    
    // --- NEW: Funciones para efectos visuales ---
    function launchFireworks(container) {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.className = 'firework';
                const x = Math.random() * 80 + 10; // %
                const y = Math.random() * 50 + 20; // %
                const color = `hsl(${Math.random() * 360}, 100%, 70%)`;
                firework.style.left = `${x}%`;
                firework.style.top = `${y}%`;
                firework.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;
                container.appendChild(firework);
                firework.addEventListener('animationend', () => firework.remove());
            }, Math.random() * 800);
        }
    }

    function launchConfetti(container) {
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = `${Math.random() * 2}s`;
            confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
            container.appendChild(confetti);
            confetti.addEventListener('animationend', () => confetti.remove());
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

        document.querySelectorAll('.column').forEach(column => {
            const allRamos = column.querySelectorAll('.ramo');
            if (allRamos.length > 0 && allRamos.length === column.querySelectorAll('.ramo.completado').length) {
                column.dataset.completed = 'true';
            }
        });
    }
    
    function updateStats() {
        // Esta función podría mostrar el progreso general si se desea, por ahora está vacía.
    }
    
    // Inicializar al cargar la página
    updateStats();
});
