// --- JavaScript from script.js ---
document.addEventListener('DOMContentLoaded', function() {
    // Obtener todos los elementos de ramos
    const ramos = document.querySelectorAll('.ramo');
    
    // Cargar estado guardado desde localStorage
    loadCompletedRamos();
    
    // Agregar event listener a cada ramo
    ramos.forEach(ramo => {
        ramo.addEventListener('click', function() {
            toggleRamoCompletion(this);
        });
        
        // Agregar efecto de hover mejorado
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
            
            // Animación de "descompletar"
            ramoElement.style.transform = 'scale(0.95)';
            setTimeout(() => {
                ramoElement.style.transform = 'scale(1)';
            }, 150);
            
        } else {
            // Si no está completado, marcarlo como completado
            ramoElement.classList.add('completado');
            saveCompletedRamo(ramoId);
            
            // Animación de completado
            ramoElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                ramoElement.style.transform = 'scale(1)';
            }, 200);
            
            // Efecto de confetti simple
            createConfettiEffect(ramoElement);
        }
        
        // Actualizar estadísticas
        updateStats();
    }
    
    // Función para crear un efecto de confetti simple
    function createConfettiEffect(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 10; i++) {
            createConfettiParticle(centerX, centerY);
        }
    }
    
    function createConfettiParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.backgroundColor = ['#28a745', '#ffc107', '#a67c00', '#dc3545'][Math.floor(Math.random() * 4)];
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        
        document.body.appendChild(particle);
        
        // Animación de la partícula
        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 50;
        const gravity = 0.5;
        let vx = Math.cos(angle) * velocity;
        let vy = Math.sin(angle) * velocity;
        let posX = x;
        let posY = y;
        
        function animate() {
            posX += vx * 0.02;
            posY += vy * 0.02;
            vy += gravity;
            
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = parseFloat(particle.style.opacity || 1) - 0.02;
            
            if (parseFloat(particle.style.opacity) > 0 && posY < window.innerHeight + 50) {
                requestAnimationFrame(animate);
            } else {
                if (particle.parentNode) {
                   document.body.removeChild(particle);
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Funciones para guardar y cargar el estado en localStorage
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
    }
    
    // Función para actualizar estadísticas
    function updateStats() {
        const totalRamos = document.querySelectorAll('.ramo').length;
        const completedRamos = document.querySelectorAll('.ramo.completado').length;
        const percentage = totalRamos > 0 ? Math.round((completedRamos / totalRamos) * 100) : 0;
        
        // Actualizar el título de la página con el progreso
        document.title = `Malla Curricular (${percentage}% completado) - Derecho`;
        
        // Mostrar notificación de progreso
        if (completedRamos > 0) {
            showProgressNotification(completedRamos, totalRamos, percentage);
        }
    }
    
    // Función para mostrar notificación de progreso
    function showProgressNotification(completed, total, percentage) {
        // Remover notificación anterior si existe
        const existingNotification = document.querySelector('.progress-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = 'progress-notification';
        notification.innerHTML = `
            <div class="progress-content">
                <span class="progress-text">Progreso: ${completed}/${total} ramos (${percentage}%)</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
        
        // Estilos para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            min-width: 250px;
            animation: slideIn 0.3s ease-out;
        `;
        
        // Estilos para el contenido
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .progress-content {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .progress-bar {
                width: 100%;
                height: 6px;
                background: rgba(255,255,255,0.3);
                border-radius: 3px;
                overflow: hidden;
            }
            .progress-fill {
                height: 100%;
                background: white;
                border-radius: 3px;
                transition: width 0.3s ease;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        // Remover la notificación después de 3 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideIn 0.3s ease-out reverse';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 3000);
    }
    
    // Inicializar estadísticas al cargar
    updateStats();
});
