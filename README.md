# 🎬 kinoplayer.top

> Плеер нового поколения для фильмов и сериалов. Быстро, бесплатно, без регистрации.

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/badge/version-3.0.0-green?style=for-the-badge)]()

---

## 🚀 Деплой (один клик)

### Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/twixoffltdco/kinoboxtv)

> `vercel.json` уже настроен. После деплоя всё работает.

### Netlify
Подключи репо — `_redirects` обрабатывает роутинг автоматически.

### Apache / cPanel
Загрузи файлы в `public_html`, `.htaccess` уже в корне.

---

## 📌 Как работает роутинг

Сайт использует **hash-роутинг** — он работает на любом хостинге без серверных настроек.

```

При обновлении страницы — всё работает корректно ✅

---

---

## 📂 Структура проекта

```
kinoboxtv/
├── index.html      — главный SPA (hash-роутинг)
├── embed.html      — чистый embed-плеер
├── kinobox.js      — библиотека плеера
├── kinobox.css     — стили для внешнего подключения
├── titlename.js    — получение названий по ID
├── vercel.json     — настройки Vercel
├── _redirects      — настройки Netlify
├── .htaccess       — настройки Apache
├── .gitignore
└── README.md
```

---

## 🌐 Поддерживаемые источники

| Источник | Фильмы | Сериалы |
|---|---|---|
| Collaps | ✅ | ✅ |
| Alloha | ✅ | ✅ |
| HDVB | ✅ | ✅ |
| Kodik | ✅ | ✅ |
| VideoCDN | ✅ | ✅ |
| Bazon | ✅ | ✅ |
| Ashdi | ✅ | ✅ |

---

## 📜 Лицензия

MIT License © 2025 KinoBox.tv
