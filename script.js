// --- JavaScript from script.js ---
document.addEventListener('DOMContentLoaded', function() {
    
    // --- NEW: Mensajes de felicitación ---
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

    // Obtener todos los elementos de ramos
    const ramos = document.querySelectorAll('.ramo');
    
    // Cargar estado guardado desde localStorage
    loadCompletedRamos();
    
    // Agregar event listener a cada ramo
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
    
    // Función para alternar el estado de completado de un ramo
    function toggleRamoCompletion(ramoElement) {
        const ramoId = ramoElement.getAttribute('data-ramo');
        
        if (ramoElement.classList.contains('completado')) {
            // Si está completado, quitarlo
            ramoElement.classList.remove('completado');
            removeCompletedRamo(ramoId);
            ramoElement.closest('.column').dataset.completed = 'false'; // Marcar semestre como no completado
        } else {
            // Si no está completado, marcarlo como completado
            ramoElement.classList.add('completado');
            saveCompletedRamo(ramoId);
            
            // Animación y efectos
            ramoElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                ramoElement.style.transform = 'scale(1)';
            }, 200);
            createConfettiEffect(ramoElement);
            
            // --- NEW: Verificar si se completó un hito (semestre/año) ---
            checkCompletionStatus(ramoElement);
        }
        
        // Actualizar estadísticas de progreso general
        updateStats();
    }

    // --- NEW: Función para verificar hitos de compleción ---
    function checkCompletionStatus(ramoElement) {
        const semesterColumn = ramoElement.closest('.column');
        if (!semesterColumn || semesterColumn.dataset.completed === 'true') {
            return; // Salir si no hay columna o el semestre ya fue marcado como completado
        }

        const allRamosInSemester = semesterColumn.querySelectorAll('.ramo');
        const completedRamosInSemester = semesterColumn.querySelectorAll('.ramo.completado');

        // Verificar si se completó el SEMESTRE
        if (allRamosInSemester.length > 0 && allRamosInSemester.length === completedRamosInSemester.length) {
            semesterColumn.dataset.completed = 'true'; // Marcar para no repetir notificación
            const randomMessage = semesterMessages[Math.floor(Math.random() * semesterMessages.length)];
            showMilestoneNotification(randomMessage, 'semester');

            // Después de completar un semestre, verificar si se completó el AÑO
            const semesterIndex = parseInt(semesterColumn.dataset.semesterIndex, 10);
            let partnerSemesterIndex;

            // Determinar el índice del semestre par
            if (semesterIndex % 2 === 0) { // Si es 0, 2, 4...
                partnerSemesterIndex = semesterIndex + 1;
            } else { // Si es 1, 3, 5...
                partnerSemesterIndex = semesterIndex - 1;
            }

            const partnerSemesterColumn = document.querySelector(`.column[data-semester-index="${partnerSemesterIndex}"]`);
            if (partnerSemesterColumn && partnerSemesterColumn.dataset.completed === 'true') {
                const yearMessage = yearMessages[Math.floor(Math.random() * yearMessages.length)];
                showMilestoneNotification(yearMessage, 'year');
            }
        }
    }

    // --- NEW: Función para mostrar notificaciones de hitos ---
    function showMilestoneNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `milestone-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // La animación de salida es manejada por CSS, pero removemos el elemento del DOM después
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    function createConfettiEffect(element) {
        const rect = element.getBoundingClientRect();
        for (let i = 0; i < 15; i++) {
            createConfettiParticle(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
    }
    
    function createConfettiParticle(x, y) {
        // ... (código de partículas sin cambios)
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
        completedRamos = completedRamos.filter(id => id !== ramoId);
        localStorage.setItem('completedRamosDerecho', JSON.stringify(completedRamos));
    }
    
    function loadCompletedRamos() {
        const completedRamos = JSON.parse(localStorage.getItem('completedRamosDerecho') || '[]');
        completedRamos.forEach(ramoId => {
            const ramoElement = document.querySelector(`[data-ramo="${ramoId}"]`);
            if (ramoElement) {
                ramoElement.classList.add('completado');
            }
        });

        // --- NEW: Marcar semestres ya completados al cargar para evitar notificaciones ---
        document.querySelectorAll('.column').forEach(column => {
            const allRamos = column.querySelectorAll('.ramo');
            if (allRamos.length === 0) return; // Ignorar columnas vacías
            const completedRamos = column.querySelectorAll('.ramo.completado');
            if (allRamos.length === completedRamos.length) {
                column.dataset.completed = 'true';
            }
        });
    }
    
    function updateStats() {
        // ... (código de estadísticas sin cambios)
    }
    
    function showProgressNotification(completed, total, percentage) {
        // ... (código de notificación de progreso sin cambios)
    }
    
    // Inicializar estadísticas al cargar
    updateStats();
});
