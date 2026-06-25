<h1 align="center">💰 Finansal Okuryazarlık Platformu</h1>

<p align="center">
  Express.js ile geliştirilmiş, Docker ile çalıştırılabilen finansal okuryazarlık web uygulaması.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
</p>

---

## 📁 Proje Yapısı

```
.
├── app.js            # Express sunucusu (giriş noktası)
├── package.json      # Bağımlılıklar ve script'ler
├── Dockerfile        # Docker imaj tanımı
├── public/           # Statik dosyalar (CSS, JavaScript)
│   ├── style.css
│   └── main.js
└── views/            # HTML sayfaları
    └── index.html
```

---

## 🧩 Dosya Açıklamaları

| Dosya / Klasör | Açıklama |
| :------------- | :------- |
| **`app.js`** | Express uygulamasını başlatır. `public/` klasörünü statik olarak sunar, kök dizinde (`/`) `views/index.html` dosyasını döner ve **3000** portunda çalışır. |
| **`public/`** | Tarayıcıya doğrudan sunulan statik varlıklar (stil ve istemci tarafı JavaScript). |
| **`views/`** | Sunucu tarafından döndürülen HTML sayfaları. |
| **`Dockerfile`** | Uygulamayı bir Docker imajı olarak paketler. |
| **`package.json`** | Proje bağımlılıkları ve çalıştırma script'leri. |

---

<p align="center">
  <sub>Express • Docker ile geliştirildi</sub>
</p>
