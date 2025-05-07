// Variables globales
let messages = [];
let currentProfileImage = 'assets/icona-vatar.jpg';
let currentOS = 'android';
let batteryLevel = 100;
let isKeyboardVisible = false;

// Funciones de utilidad
function formatTime(date) {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(date) {
    return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
}

// Funciones para el sistema operativo
function setOS(os) {
    currentOS = os;
    const preview = document.querySelector('.preview');
    preview.className = `preview ${os}`;
    updateStatusBar();
}

function updateStatusBar() {
    const statusBar = document.querySelector('.status-bar');
    const batteryIcon = document.querySelector('.battery-icon');
    const signalIcon = document.querySelector('.signal-icon');
    const wifiIcon = document.querySelector('.wifi-icon');
    
    // Actualizar ícono de batería
    if (batteryLevel >= 90) {
        batteryIcon.className = 'fas fa-battery-full battery-icon';
    } else if (batteryLevel >= 60) {
        batteryIcon.className = 'fas fa-battery-three-quarters battery-icon';
    } else if (batteryLevel >= 40) {
        batteryIcon.className = 'fas fa-battery-half battery-icon';
    } else if (batteryLevel >= 20) {
        batteryIcon.className = 'fas fa-battery-quarter battery-icon';
    } else {
        batteryIcon.className = 'fas fa-battery-empty battery-icon';
    }
    
    // Actualizar estilo según OS
    if (currentOS === 'ios') {
        statusBar.classList.add('ios');
        statusBar.classList.remove('android');
    } else {
        statusBar.classList.add('android');
        statusBar.classList.remove('ios');
    }
}

function updateBatteryLevel(level) {
    const batteryLevel = document.getElementById('batteryLevel');
    const batteryLevelText = document.getElementById('batteryLevelText');
    const deviceSelector = document.getElementById('deviceSelector');
    const selectedDevice = deviceSelector.value;
    
    // Actualizar el texto del nivel
    batteryLevelText.textContent = `${level}%`;
    
    if (selectedDevice === 'samsung') {
        // Para Samsung, actualizar el SVG
        const batteryLevel = document.querySelector('#battery-level');
        const batteryText = document.querySelector('#battery-text');
        const fastCharging = document.querySelector('#fast-charging');
        const wirelessCharging = document.querySelector('#wireless-charging');
        
        if (batteryLevel && batteryText) {
            // Actualizar el nivel de batería (usando clip-path)
            const percentage = level / 100;
            const path = `M4 12C4 7.58172 7.58172 4 12 4H${12 + (36 * percentage)}C${12 + (36 * percentage)} 4 ${12 + (36 * percentage)} 20 12 20H4V12Z`;
            batteryLevel.setAttribute('d', path);
            
            // Actualizar el texto del porcentaje (solo números)
            batteryText.textContent = `${level}`;
            
            // Cambiar el color según el nivel
            if (level <= 15) {
                batteryLevel.setAttribute('fill', '#ff3b30');
            } else if (level <= 30) {
                batteryLevel.setAttribute('fill', '#ff9500');
            } else {
                batteryLevel.setAttribute('fill', 'currentColor');
            }
            
            // Mostrar/ocultar iconos de carga
            if (level < 100) {
                fastCharging.style.display = 'block';
                wirelessCharging.style.display = 'none';
            } else {
                fastCharging.style.display = 'none';
                wirelessCharging.style.display = 'none';
            }
        }
    } else {
        // Para otros dispositivos, usar el sistema actual
        updateBatteryIcon(level);
    }
}

function updateDeviceStyle() {
    const deviceSelector = document.getElementById('deviceSelector');
    const statusBar = document.querySelector('.status-bar');
    const selectedDevice = deviceSelector.value;
    const samsungBattery = document.querySelector('.samsung-battery');
    const defaultBattery = document.querySelector('.default-battery');
    
    // Remover todas las clases de dispositivo
    statusBar.classList.remove('samsung', 'xiaomi', 'motorola', 'pixel', 'oneplus', 'huawei');
    
    // Agregar la clase del dispositivo seleccionado
    if (selectedDevice !== 'default') {
        statusBar.classList.add(selectedDevice);
    }
    
    // Manejar la visualización de la batería
    if (selectedDevice === 'samsung') {
        samsungBattery.style.display = 'block';
        defaultBattery.style.display = 'none';
    } else {
        samsungBattery.style.display = 'none';
        defaultBattery.style.display = 'block';
    }
    
    // Actualizar el nivel de batería para aplicar los nuevos estilos
    const currentLevel = document.getElementById('batteryLevel').value;
    updateBatteryLevel(currentLevel);
}

function toggleKeyboard() {
    isKeyboardVisible = !isKeyboardVisible;
    const keyboard = document.getElementById('keyboard');
    const inputBar = document.querySelector('.chat-input-bar');
    
    if (isKeyboardVisible) {
        keyboard.style.display = 'block';
        inputBar.style.bottom = '200px';
    } else {
        keyboard.style.display = 'none';
        inputBar.style.bottom = '0';
    }
}

// Funciones principales
function addMessage() {
    const messageText = document.getElementById('messageText').value;
    const messageType = document.getElementById('messageType').value;
    const messageTime = document.getElementById('messageTime').value;
    const messageDate = document.getElementById('messageDate').value;

    if (!messageText) return;

    const message = {
        text: messageText,
        type: messageType,
        time: messageTime,
        date: messageDate,
        timestamp: new Date(`${messageDate}T${messageTime}`).getTime()
    };

    messages.push(message);
    updateChatPreview();
    document.getElementById('messageText').value = '';
    toggleKeyboard(); // Ocultar teclado después de enviar
}

function updateChatPreview() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';

    messages.sort((a, b) => a.timestamp - b.timestamp).forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = `message message-${message.type}`;
        
        const messageContent = document.createElement('p');
        messageContent.textContent = message.text;
        
        const messageMeta = document.createElement('span');
        messageMeta.className = 'message-meta';
        messageMeta.innerHTML = `${message.time} <i class="fas fa-check-double"></i>`;
        
        messageElement.appendChild(messageContent);
        messageElement.appendChild(messageMeta);
        chatMessages.appendChild(messageElement);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function updateHeaderInfo() {
    const contactName = document.getElementById('contactName').value;
    const contactStatus = document.getElementById('contactStatus').value;
    const chatDescription = document.getElementById('chatDescription').value;
    const headerTime = document.getElementById('headerTime').value;
    const showDescription = document.getElementById('showDescription').checked;

    document.getElementById('previewName').textContent = contactName || 'Nombre del contacto';
    document.getElementById('statusTime').textContent = headerTime;
    
    const statusElement = document.getElementById('previewStatus');
    if (contactStatus === 'online') {
        statusElement.textContent = 'en línea';
    } else if (contactStatus === 'lastSeen') {
        const lastSeenDate = document.getElementById('lastSeenDate').value;
        const lastSeenTime = document.getElementById('lastSeenTime').value;
        statusElement.textContent = `visto por última vez ${lastSeenDate} a las ${lastSeenTime}`;
    } else {
        statusElement.textContent = '';
    }

    // Actualizar la descripción del chat
    const descriptionElement = document.getElementById('previewDescription');
    const descriptionContainer = descriptionElement.parentElement;
    
    if (chatDescription && showDescription) {
        descriptionElement.textContent = chatDescription;
        descriptionContainer.classList.remove('hidden');
    } else {
        descriptionContainer.classList.add('hidden');
    }
}

function updateProfileImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentProfileImage = e.target.result;
            document.getElementById('previewProfileMini').src = currentProfileImage;
        };
        reader.readAsDataURL(file);
    }
}

function toggleNightMode() {
    const preview = document.querySelector('.preview');
    const body = document.body;
    const isNightMode = document.getElementById('nightModeSwitch').checked;
    
    preview.classList.toggle('night-mode', isNightMode);
    body.classList.toggle('night-mode', isNightMode);
}

function updateChatBackground() {
    const bgSelector = document.getElementById('chatBgSelector');
    const preview = document.querySelector('.preview');
    const customBgInput = document.getElementById('customBgInput');
    
    preview.className = 'preview';
    
    if (bgSelector.value === 'custom') {
        customBgInput.style.display = 'block';
        if (customBgInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.style.backgroundImage = `url(${e.target.result})`;
                preview.classList.add('bg-custom');
            };
            reader.readAsDataURL(customBgInput.files[0]);
        }
    } else {
        customBgInput.style.display = 'none';
        preview.classList.add(`bg-${bgSelector.value}`);
    }
}

function saveChat() {
    const previewContainer = document.getElementById('previewContainer');
    
    html2canvas(previewContainer).then(canvas => {
        const link = document.createElement('a');
        link.download = 'chat-whatsapp.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

function clearMessages() {
    messages = [];
    updateChatPreview();
}

// Funciones para el teclado virtual
function initializeKeyboard() {
    const keyboard = document.getElementById('keyboard');
    const input = document.getElementById('messageText');
    let isShiftPressed = false;

    // Función para insertar texto
    function insertText(text) {
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const value = input.value;
        input.value = value.substring(0, start) + text + value.substring(end);
        input.selectionStart = input.selectionEnd = start + text.length;
        input.focus();
    }

    // Función para manejar teclas especiales
    function handleSpecialKey(key) {
        switch(key) {
            case 'backspace':
                const start = input.selectionStart;
                const end = input.selectionEnd;
                const value = input.value;
                if (start === end && start > 0) {
                    input.value = value.substring(0, start - 1) + value.substring(end);
                    input.selectionStart = input.selectionEnd = start - 1;
                } else if (start !== end) {
                    input.value = value.substring(0, start) + value.substring(end);
                    input.selectionStart = input.selectionEnd = start;
                }
                break;
            case 'space':
                insertText(' ');
                break;
            case 'enter':
                addMessage();
                break;
            case 'shift':
                isShiftPressed = !isShiftPressed;
                keyboard.querySelectorAll('.key:not(.shift):not(.backspace):not(.space):not(.enter)').forEach(key => {
                    key.textContent = isShiftPressed ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
                });
                break;
        }
    }

    // Agregar event listeners a todas las teclas
    keyboard.querySelectorAll('.key').forEach(key => {
        key.addEventListener('click', () => {
            if (key.classList.contains('shift') || key.classList.contains('backspace') || 
                key.classList.contains('space') || key.classList.contains('enter')) {
                handleSpecialKey(key.classList[1] || key.classList[0]);
            } else {
                insertText(key.textContent);
            }
        });
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar fecha y hora actual
    const now = new Date();
    document.getElementById('messageDate').value = formatDate(now).split('T')[0];
    document.getElementById('messageTime').value = formatTime(now);
    
    // Event listeners
    document.getElementById('profileImage').addEventListener('change', updateProfileImage);
    document.getElementById('contactName').addEventListener('input', updateHeaderInfo);
    document.getElementById('contactStatus').addEventListener('change', updateHeaderInfo);
    document.getElementById('chatDescription').addEventListener('input', updateHeaderInfo);
    document.getElementById('headerTime').addEventListener('input', updateHeaderInfo);
    document.getElementById('nightModeSwitch').addEventListener('change', toggleNightMode);
    document.getElementById('chatBgSelector').addEventListener('change', updateChatBackground);
    document.getElementById('customBgInput').addEventListener('change', updateChatBackground);
    
    // Mostrar/ocultar grupo de última vez
    document.getElementById('contactStatus').addEventListener('change', function() {
        const lastSeenGroup = document.getElementById('lastSeenGroup');
        lastSeenGroup.style.display = this.value === 'lastSeen' ? 'block' : 'none';
    });
    
    // Nuevos event listeners
    document.getElementById('osSelector').addEventListener('change', function() {
        setOS(this.value);
    });
    
    document.getElementById('batteryLevel').addEventListener('input', function() {
        updateBatteryLevel(this.value);
    });
    
    document.getElementById('messageText').addEventListener('focus', function() {
        toggleKeyboard();
    });
    
    // Agregar event listener para mostrar/ocultar descripción
    document.getElementById('showDescription').addEventListener('change', updateHeaderInfo);
    
    // Inicializar estado
    setOS('android');
    updateBatteryLevel(100);
    
    // Inicializar el teclado virtual
    initializeKeyboard();
    
    // Agregar event listener para el selector de dispositivo
    document.getElementById('deviceSelector').addEventListener('change', updateDeviceStyle);
}); 