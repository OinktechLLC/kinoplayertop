(function () {
  window.KINOBOX_AD_CONFIG = window.KINOBOX_AD_CONFIG || {
    sources: [
      // Добавьте ваши mp4 рекламные ссылки ниже:
      // "https://example.com/ad-1.mp4",
      // "https://example.com/ad-2.mp4"
    ],
    interval: 900000 // 15 минут в миллисекундах (15 * 60 * 1000)
  };

  // Функция для показа рекламы
  function showAd() {
    var ads = window.KINOBOX_AD_CONFIG.sources;
    if (!ads || ads.length === 0) return;
    
    var randomAd = ads[Math.floor(Math.random() * ads.length)];
    
    // Создаём оверлей для рекламы
    var overlay = document.createElement('div');
    overlay.id = 'kinoplayer-ad-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:999999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px);';
    
    var container = document.createElement('div');
    container.style.cssText = 'position:relative;max-width:90%;max-height:90%;';
    
    var video = document.createElement('video');
    video.src = randomAd;
    video.controls = true;
    video.autoplay = true;
    video.style.cssText = 'max-width:100%;max-height:80vh;border-radius:16px;box-shadow:0 10px 50px rgba(99,102,241,0.3);border:1px solid rgba(255,255,255,0.1);';
    
    var closeBtn = document.createElement('button');
    closeBtn.textContent = '✕ Пропустить';
    closeBtn.style.cssText = 'position:absolute;top:-40px;right:0;background:linear-gradient(135deg,#6366f1,#818cf8);color:#fff;border:none;padding:8px 16px;border-radius:20px;cursor:pointer;font-weight:600;font-size:12px;box-shadow:0 4px 15px rgba(99,102,241,0.5);';
    closeBtn.onclick = function() {
      document.body.removeChild(overlay);
    };
    
    video.onended = function() {
      document.body.removeChild(overlay);
    };
    
    container.appendChild(closeBtn);
    container.appendChild(video);
    overlay.appendChild(container);
    document.body.appendChild(overlay);
  }

  // Проверяем и показываем рекламу каждые 15 минут
  var lastAdTime = localStorage.getItem('kinoplayer_last_ad_time') || 0;
  var now = Date.now();
  
  if (now - lastAdTime > window.KINOBOX_AD_CONFIG.interval) {
    showAd();
    localStorage.setItem('kinoplayer_last_ad_time', now.toString());
  }
})();
