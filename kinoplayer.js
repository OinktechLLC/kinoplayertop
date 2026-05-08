/**
 * Kinoplayer.js — KinoPlayerTop
 * Версия: 2.0 Glassmorphism Edition
 * Стиль: Жидкое Стекло, Зеленая гамма
 */

(function(window) {
    'use strict';

    // Конфигурация источников (балансеры + новые источники)
    const SOURCES = [
        { type: 'videocdn', name: 'VideoCDN', url: 'https://video.cdn.ru/embed/' },
        { type: 'alloha', name: 'Alloha', url: 'https://alloha.tv/embed/' },
        { type: 'videobox', name: 'VideoBox', url: 'https://videobox.tv/embed/' },
        { type: 'hdvk', name: 'HDVK', url: 'https://hdvk.info/embed/' },
        { type: 'collaps', name: 'Collaps', url: 'https://collaps.cc/embed/' },
        { type: 'fs3', name: 'FS3', url: 'https://fs3.to/embed/' },
        { type: 'kodik', name: 'Kodik', url: 'https://kodik.cc/embed/' },
        { type: 'albom', name: 'Albom', url: 'https://albom.tv/embed/' },
        { type: 'retrolab', name: 'RetroLab', url: 'https://retrolab.work/embed/' },
        { type: 'trailer', name: 'Trailer', url: 'https://www.kinopoisk.ru/film/' }
    ];

    // Текущее состояние
    let state = {
        kpId: null,
        currentSource: 0,
        menuOpen: false,
        container: null,
        iframe: null
    };

    // Создание стилей
    function injectStyles() {
        if (document.getElementById('kinoplayer-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'kinoplayer-styles';
        style.textContent = `
            /* Kinoplayer Glassmorphism Styles */
            .kp-wrapper {
                width: 100%;
                font-family: "Montserrat", "Segoe UI", sans-serif;
                background: rgba(5, 20, 15, 0.8);
                backdrop-filter: blur(18px);
                -webkit-backdrop-filter: blur(18px);
                border-radius: 20px;
                overflow: hidden;
                border: 1px solid rgba(16, 185, 129, 0.2);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.05);
            }
            
            .kp-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 16px;
                background: rgba(10, 31, 23, 0.7);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border-bottom: 1px solid rgba(16, 185, 129, 0.15);
            }
            
            .kp-title {
                font-size: 14px;
                font-weight: 600;
                color: #86efac;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .kp-menu-btn {
                width: 44px;
                height: 36px;
                background: rgba(107, 114, 128, 0.9);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                border: none;
                border-radius: 999px;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 5px;
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                outline: solid 3px rgba(0, 0, 0, 0.17);
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
                flex-shrink: 0;
            }
            
            .kp-menu-btn:hover {
                background: rgba(75, 85, 99, 0.95);
                transform: scale(1.05);
            }
            
            .kp-menu-btn span {
                display: block;
                width: 22px;
                height: 2.5px;
                background: #fafafa;
                border-radius: 2px;
                transition: all 0.2s ease;
            }
            
            .kp-menu-btn.active span:nth-child(1) {
                transform: translateY(7.5px) rotate(45deg);
            }
            
            .kp-menu-btn.active span:nth-child(2) {
                opacity: 0;
            }
            
            .kp-menu-btn.active span:nth-child(3) {
                transform: translateY(-7.5px) rotate(-45deg);
            }
            
            .kp-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(7, 9, 15, 0.85);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                z-index: 9999;
                display: flex;
                align-items: flex-end;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.2s linear, visibility 0.2s linear;
            }
            
            .kp-modal-overlay.kp-open {
                opacity: 1;
                visibility: visible;
            }
            
            .kp-modal {
                position: relative;
                display: flex;
                flex-direction: column;
                gap: 8px;
                max-height: min(72vh, 520px);
                width: min(560px, 90%);
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
                margin: 0 16px 16px;
                padding: 14px;
                background: rgba(31, 36, 51, 0.95);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border-radius: 20px;
                border: 1px solid rgba(49, 56, 79, 0.8);
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.44), inset 0 0 30px rgba(255, 255, 255, 0.05);
                list-style: none;
                transform: translateY(20px);
                transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .kp-modal-overlay.kp-open .kp-modal {
                transform: translateY(0);
            }
            
            .kp-modal-item {
                flex: 0 0 auto;
                display: block;
                overflow: hidden;
                padding: 14px 18px;
                background: rgba(43, 49, 68, 0.9);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                border-radius: 14px;
                border: 1px solid rgba(255, 255, 255, 0.05);
                font: 15px "Montserrat", system-ui, sans-serif;
                color: #fafafa;
                text-align: left;
                white-space: nowrap;
                text-overflow: ellipsis;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .kp-modal-item:hover {
                background: rgba(59, 67, 90, 0.95);
                border-color: rgba(16, 185, 129, 0.3);
                transform: translateX(4px);
            }
            
            .kp-modal-item.kp-active {
                background: linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(52, 211, 153, 0.9));
                border-color: rgba(16, 185, 129, 0.5);
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.1);
            }
            
            .kp-frame {
                position: relative;
                width: 100%;
                padding-top: 56.25%;
                background: #000;
            }
            
            .kp-frame iframe {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: none;
            }
            
            .kp-loading {
                padding: 60px 20px;
                text-align: center;
                color: #6a8a7a;
                font-size: 13px;
            }
            
            .kp-error {
                padding: 40px 20px;
                text-align: center;
                color: #fca5a5;
                font-size: 12px;
                line-height: 1.7;
            }
        `;
        document.head.appendChild(style);
    }

    // Построение URL источника
    function buildUrl(source, kpId) {
        switch(source.type) {
            case 'videocdn':
                return source.url + kpId;
            case 'alloha':
                return source.url + kpId;
            case 'videobox':
                return source.url + '?kp=' + kpId;
            case 'hdvk':
                return source.url + kpId;
            case 'collaps':
                return source.url + kpId;
            case 'fs3':
                return source.url + kpId;
            case 'kodik':
                return source.url + '?kinopoisk=' + kpId;
            case 'albom':
                return source.url + kpId;
            case 'retrolab':
                return source.url + kpId;
            case 'trailer':
                return 'https://www.kinopoisk.ru/film/' + kpId + '/video/?player=small';
            default:
                return source.url + kpId;
        }
    }

    // Обновление iframe
    function updateIframe() {
        if (!state.container || !state.kpId) return;
        
        const source = SOURCES[state.currentSource];
        const url = buildUrl(source, state.kpId);
        
        let iframe = state.container.querySelector('.kp-frame iframe');
        if (!iframe) {
            const frame = state.container.querySelector('.kp-frame');
            iframe = document.createElement('iframe');
            iframe.allowFullscreen = true;
            iframe.allow = 'autoplay; fullscreen; encrypted-media';
            frame.appendChild(iframe);
        }
        iframe.src = url;
    }

    // Открытие/закрытие меню
    function toggleMenu() {
        state.menuOpen = !state.menuOpen;
        
        const btn = state.container.querySelector('.kp-menu-btn');
        const overlay = state.container.querySelector('.kp-modal-overlay');
        
        if (btn) {
            btn.classList.toggle('active', state.menuOpen);
        }
        
        if (overlay) {
            overlay.classList.toggle('kp-open', state.menuOpen);
        }
    }

    // Закрытие меню
    function closeMenu() {
        state.menuOpen = false;
        const btn = state.container.querySelector('.kp-menu-btn');
        const overlay = state.container.querySelector('.kp-modal-overlay');
        
        if (btn) btn.classList.remove('active');
        if (overlay) overlay.classList.remove('kp-open');
    }

    // Выбор источника
    function selectSource(index) {
        state.currentSource = index;
        updateIframe();
        closeMenu();
        renderMenuItems();
    }

    // Рендер элементов меню
    function renderMenuItems() {
        const modal = state.container.querySelector('.kp-modal');
        if (!modal) return;
        
        modal.innerHTML = '';
        
        SOURCES.forEach((source, index) => {
            const item = document.createElement('div');
            item.className = 'kp-modal-item' + (index === state.currentSource ? ' kp-active' : '');
            item.textContent = source.name;
            item.addEventListener('click', () => selectSource(index));
            modal.appendChild(item);
        });
    }

    // Создание HTML структуры
    function createHTML() {
        return `
            <div class="kp-wrapper">
                <div class="kp-header">
                    <div class="kp-title">🎬 KinoPlayerTop</div>
                    <button class="kp-menu-btn" aria-label="Источники">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
                <div class="kp-frame"></div>
                <div class="kp-modal-overlay">
                    <ul class="kp-modal"></ul>
                </div>
            </div>
        `;
    }

    // Инициализация плеера
    function init(containerSelector, options = {}) {
        injectStyles();
        
        const container = typeof containerSelector === 'string' 
            ? document.querySelector(containerSelector) 
            : containerSelector;
        
        if (!container) {
            console.error('[Kinoplayer] Контейнер не найден:', containerSelector);
            return;
        }
        
        state.container = container;
        state.kpId = options.search?.kinopoisk || options.kpId || 301;
        
        container.innerHTML = createHTML();
        
        // Обработчик кнопки меню
        const menuBtn = container.querySelector('.kp-menu-btn');
        menuBtn.addEventListener('click', toggleMenu);
        
        // Закрытие по клику вне меню
        const overlay = container.querySelector('.kp-modal-overlay');
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeMenu();
            }
        });
        
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.menuOpen) {
                closeMenu();
            }
        });
        
        // Рендер меню
        renderMenuItems();
        
        // Загрузка iframe
        updateIframe();
        
        console.log('[Kinoplayer] Инициализирован для KP ID:', state.kpId);
    }

    // Экспорт API
    window.kinobox = init;
    window.kinoplayer = {
        init,
        setSource: (index) => selectSource(index),
        loadFilm: (kpId) => {
            state.kpId = kpId;
            updateIframe();
        },
        sources: SOURCES
    };

})(window);
