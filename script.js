document.addEventListener('DOMContentLoaded', function() {
    // Загрузочный экран
    const bootScreen = document.getElementById('boot-screen');
    const bootProgressBar = document.querySelector('.boot-progress-bar');
    const bootMessage = document.querySelector('.boot-message');
    
    // Имитация загрузки системы
    setTimeout(() => {
        bootProgressBar.style.width = '30%';
        bootMessage.textContent = 'Телепортируем в прошлое...';
    }, 300);
    
    setTimeout(() => {
        bootProgressBar.style.width = '60%';
        bootMessage.textContent = 'Рисвем кнопки...';
    }, 800);
    
    setTimeout(() => {
        bootProgressBar.style.width = '90%';
        bootMessage.textContent = 'Вспоминаем старые команды...';
    }, 1300);
    
    setTimeout(() => {
        bootProgressBar.style.width = '100%';
        bootMessage.textContent = 'Запускаем настольгию...';
    }, 1800);
    
    setTimeout(() => {
        bootScreen.style.display = 'none';
    }, 2200);
    
    // Проверка мобильного устройства
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        document.body.classList.add('mobile-device');
    }
    
    // Отображение текущего времени
    function updateTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        
        // Добавление ведущего нуля
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        
        document.getElementById('current-time').textContent = hours + ':' + minutes;
    }
    
    // Обновление времени каждую минуту
    updateTime();
    setInterval(updateTime, 60000);
    
    // Стартовое меню
    const startButton = document.querySelector('.start-button');
    const startMenu = document.getElementById('start-menu');
    
    startButton.addEventListener('click', function() {
        if (startMenu.style.display === 'block') {
            startMenu.style.display = 'none';
        } else {
            startMenu.style.display = 'block';
        }
    });
    
    // Закрытие стартового меню при клике вне его
    document.addEventListener('click', function(event) {
        if (!startMenu.contains(event.target) && !startButton.contains(event.target)) {
            startMenu.style.display = 'none';
        }
    });
    
    // Обработка кнопки "Выключить"
    document.getElementById('shutdown').addEventListener('click', function() {
        bootScreen.style.display = 'flex';
        bootProgressBar.style.width = '0';
        bootMessage.textContent = 'Выключение системы...';
        
        setTimeout(() => {
            bootProgressBar.style.width = '50%';
        }, 500);
        
        setTimeout(() => {
            bootProgressBar.style.width = '100%';
            bootMessage.textContent = 'Система выключена. Нажмите F5 для перезагрузки.';
        }, 1500);
    });
    
    // Управление окнами
    const windows = document.querySelectorAll('.window');
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    const startMenuItems = document.querySelectorAll('.start-menu-item');
    
    // Функция для активации окна
    function activateWindow(windowId) {
        // Скрыть все окна
        windows.forEach(window => {
            window.classList.remove('active');
        });
        
        // Показать и активировать выбранное окно
        const targetWindow = document.getElementById(windowId);
        if (targetWindow) {
            targetWindow.style.display = 'block';
            targetWindow.classList.add('active');
            
            // Позиционирование окна в центре, если оно еще не было открыто
            if (!targetWindow.dataset.opened) {
                const desktopWidth = document.querySelector('.desktop').offsetWidth;
                const desktopHeight = document.querySelector('.desktop').offsetHeight;
                const windowWidth = targetWindow.offsetWidth;
                const windowHeight = targetWindow.offsetHeight;
                
                targetWindow.style.left = (desktopWidth / 2 - windowWidth / 2) + 'px';
                targetWindow.style.top = (desktopHeight / 2 - windowHeight / 2) + 'px';
                
                targetWindow.dataset.opened = 'true';
            }
            
            // Обновить панель задач
            updateTaskbar(windowId);
        }
        
        // Скрыть стартовое меню
        startMenu.style.display = 'none';
    }
    
    // Обработка клика по иконкам рабочего стола
    desktopIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const windowId = this.getAttribute('data-window');
            activateWindow(windowId);
        });
    });
    
    // Обработка клика по элементам стартового меню
    startMenuItems.forEach(item => {
        item.addEventListener('click', function() {
            const windowId = this.getAttribute('data-window');
            if (windowId) {
                activateWindow(windowId);
            }
        });
    });
    
    // Обработка кнопок управления окнами
    windows.forEach(window => {
        const closeButton = window.querySelector('.close');
        const minimizeButton = window.querySelector('.minimize');
        const maximizeButton = window.querySelector('.maximize');
        
        // Кнопка закрытия
        closeButton.addEventListener('click', function() {
            window.style.display = 'none';
            updateTaskbar();
        });
        
        // Кнопка минимизации
        minimizeButton.addEventListener('click', function() {
            window.style.display = 'none';
            updateTaskbar();
        });
        
        // Кнопка максимизации
        maximizeButton.addEventListener('click', function() {
            toggleMaximize(window);
        });
        
        // Функция для переключения максимизации окна
        function toggleMaximize(window) {
            if (window.style.width === '100%' && window.style.height === 'calc(100% - 5px)') {
                // Восстановление размера
                window.style.width = window.dataset.prevWidth || '400px';
                window.style.height = window.dataset.prevHeight || '300px';
                window.style.left = window.dataset.prevLeft || '50px';
                window.style.top = window.dataset.prevTop || '50px';
            } else {
                // Сохранение текущих размеров
                window.dataset.prevWidth = window.style.width;
                window.dataset.prevHeight = window.style.height;
                window.dataset.prevLeft = window.style.left;
                window.dataset.prevTop = window.style.top;
                
                // Максимизация
                window.style.width = '100%';
                window.style.height = 'calc(100% - 5px)';
                window.style.left = '0';
                window.style.top = '0';
            }
        }
        
        // Активация окна при клике
        window.addEventListener('mousedown', function(e) {
            // Не активировать окно при клике на контекстное меню
            if (e.target.closest('.window-context-menu')) {
                return;
            }
            
            windows.forEach(w => {
                w.classList.remove('active');
            });
            window.classList.add('active');
            updateTaskbar(window.id);
            
            // Скрыть все контекстные меню
            document.querySelectorAll('.window-context-menu').forEach(menu => {
                menu.style.display = 'none';
            });
        });
        
        // Перетаскивание окна
        const header = window.querySelector('.window-header');
        let isDragging = false;
        let offsetX, offsetY;
        
        header.addEventListener('mousedown', function(e) {
            if (e.target === header || e.target.classList.contains('window-title')) {
                isDragging = true;
                offsetX = e.clientX - window.getBoundingClientRect().left;
                offsetY = e.clientY - window.getBoundingClientRect().top;
            }
        });
        
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                window.style.left = (e.clientX - offsetX) + 'px';
                window.style.top = (e.clientY - offsetY) + 'px';
            }
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
        
        // Контекстное меню для окна
        header.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            
            // Скрыть все контекстные меню
            document.querySelectorAll('.window-context-menu').forEach(menu => {
                menu.style.display = 'none';
            });
            
            // Показать контекстное меню для текущего окна
            const contextMenu = window.querySelector('.window-context-menu');
            contextMenu.style.display = 'block';
            contextMenu.style.left = e.pageX + 'px';
            contextMenu.style.top = e.pageY + 'px';
            
            // Обработка клика на пункты контекстного меню
            const restoreItem = contextMenu.querySelector('.window-restore');
            const moveItem = contextMenu.querySelector('.window-move');
            const sizeItem = contextMenu.querySelector('.window-size');
            const minimizeItem = contextMenu.querySelector('.window-minimize');
            const maximizeItem = contextMenu.querySelector('.window-maximize');
            const closeItem = contextMenu.querySelector('.window-close');
            
            // Восстановить
            restoreItem.addEventListener('click', function() {
                if (window.style.width === '100%' && window.style.height === 'calc(100% - 5px)') {
                    toggleMaximize(window);
                }
                contextMenu.style.display = 'none';
            });
            
            // Переместить
            moveItem.addEventListener('click', function() {
                contextMenu.style.display = 'none';
                // Здесь можно добавить логику для перемещения окна
            });
            
            // Размер
            sizeItem.addEventListener('click', function() {
                contextMenu.style.display = 'none';
                // Здесь можно добавить логику для изменения размера окна
            });
            
            // Свернуть
            minimizeItem.addEventListener('click', function() {
                window.style.display = 'none';
                updateTaskbar();
                contextMenu.style.display = 'none';
            });
            
            // Развернуть
            maximizeItem.addEventListener('click', function() {
                toggleMaximize(window);
                contextMenu.style.display = 'none';
            });
            
            // Закрыть
            closeItem.addEventListener('click', function() {
                window.style.display = 'none';
                updateTaskbar();
                contextMenu.style.display = 'none';
            });
        });
    });
    
    // Обновление панели задач
    function updateTaskbar(activeWindowId) {
        const taskbarItems = document.querySelector('.taskbar-items');
        taskbarItems.innerHTML = '';
        
        let hasVisibleWindows = false;
        
        windows.forEach(window => {
            if (window.style.display === 'block') {
                hasVisibleWindows = true;
                const taskbarItem = document.createElement('div');
                taskbarItem.className = 'taskbar-item';
                taskbarItem.textContent = window.querySelector('.window-title').textContent;
                
                if (window.id === activeWindowId) {
                    taskbarItem.classList.add('active');
                }
                
                taskbarItem.addEventListener('click', function() {
                    if (window.style.display === 'none') {
                        window.style.display = 'block';
                    }
                    activateWindow(window.id);
                });
                
                taskbarItems.appendChild(taskbarItem);
            }
        });
        
        if (!hasVisibleWindows) {
            const defaultItem = document.createElement('div');
            defaultItem.className = 'taskbar-item active';
            defaultItem.textContent = 'Портфолио.exe';
            taskbarItems.appendChild(defaultItem);
        }
    }
    
    // Обработка отправки формы
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            alert(`Спасибо за сообщение, ${name}!\nВаш email: ${email}\nСообщение: ${message}\n\nВ реальном приложении это сообщение было бы отправлено.`);
            
            contactForm.reset();
        });
    }
    
    // Закрытие контекстных меню при клике вне их
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.window-context-menu') && !e.target.closest('.window-header')) {
            document.querySelectorAll('.window-context-menu').forEach(menu => {
                menu.style.display = 'none';
            });
        }
    });
});