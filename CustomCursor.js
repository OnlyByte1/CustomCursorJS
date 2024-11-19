const body = document.body;
const customCursor = document.createElement('div');
customCursor.id = 'custom-cursor';
customCursor.style.position = 'absolute';
customCursor.style.pointerEvents = 'none';
customCursor.style.zIndex = '9999';
customCursor.style.transition = 'background-image 0.3s';


// Функция загрузки конфигурации из config.json
async function loadConfig() {
    try {
        const response = await fetch('config.json');
        if (!response.ok) {
            throw new Error(`HTTP ошибка! статус: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при загрузке config.json:', error);
        return null;
    }
}


async function initCursor() {
    const config = await loadConfig();
    if (config) {
        const cursorConfig = config.cursor;
        customCursor.style.width = `${cursorConfig.width}px`;
        customCursor.style.height = `${cursorConfig.height}px`;
        customCursor.style.backgroundImage = `url("${cursorConfig.normal}")`;

        const isTouchDevice = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));


        if (!isTouchDevice) {
            body.appendChild(customCursor);

            document.addEventListener('mousemove', (event) => {
                customCursor.style.left = `${event.clientX - cursorConfig.width / 2}px`;
                customCursor.style.top = `${event.clientY - cursorConfig.height / 2}px`;
            });

            document.addEventListener('mousedown', () => {
                customCursor.style.backgroundImage = `url("${cursorConfig.active}")`;
            });

            document.addEventListener('mouseup', () => {
                customCursor.style.backgroundImage = `url("${cursorConfig.normal}")`;
            });

            document.addEventListener('selectionchange', () => {
                if (window.getSelection().toString().length > 0) {
                    customCursor.style.backgroundImage = `url("${cursorConfig.active}")`;
                } else {
                    customCursor.style.backgroundImage = `url("${cursorConfig.normal}")`;
                }
            });
        }
    }
}


initCursor();

