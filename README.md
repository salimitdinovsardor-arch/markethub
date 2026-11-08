# 🛒 MarketHub – Zamonaviy Online Shop (Internet Do‘kon)

Ushbu loyiha zamonaviy **React.js (Vite)** va **Node.js (Express)** texnologiyalarida yaratilgan to‘liq funksional internet do‘konidir. Haqiqiy **JWT (Access Token: 3 daqiqa, Refresh Token: 7 kun, Axios Interceptor va xavfsiz Cookie)** tizimi bilan ta’minlangan.

---

## 🚀 Ishga tushirish bo‘yicha qo‘llanma

Loyiha papkasida terminalni oching va quyidagi buyruqlarni bajaring:

### 1. Backend Serverni ishga tushirish:
```bash
npm run server
```
Server `http://localhost:5000` manzilida ishga tushadi.

### 2. Frontend ilovasini ishga tushirish (boshqa terminalda):
```bash
npm run dev
```
Frontend `http://localhost:5173` manzilida ochiladi.

---

## 🔑 Sinov hisobi (Demo Account):
- **Email:** `user@example.com`
- **Parol:** `Password123!`
*(Yoki yangi foydalanuvchi sifatida Ro‘yxatdan o‘tishingiz mumkin)*

---

## 🌟 Asosiy imkoniyatlar:

1. **Ro‘yxatdan o‘tish (Register):**
   - Ism, Email, Parol, Parolni tasdiqlash
   - To‘liq frontend va backend validatsiyasi
   - Parolni ko‘rsatish/yashirish (Show/Hide password)
   - Avtomatik JWT tokenlar qabul qilish

2. **Tizimga kirish (Login):**
   - Email va parol tekshiruvi
   - Bir bosishda Demo ma’lumotlarni to‘ldirish tugmasi
   - JWT Access va Refresh tokenlarni qabul qilish

3. **JWT Autentifikatsiya tizimi:**
   - **Access Token:** 3 daqiqa amal qiladi
   - **Refresh Token:** 7 kun amal qiladi
   - **Axios Interceptor:** Access token muddati tugaganda avtomatik ravishda refresh so‘rov yuboriladi va sahifani yangilamasdan yangi token olinadi. Kutib turgan barcha so‘rovlar (failed queue) yangi token bilan qayta yuboriladi.
   - **Xavfsiz Cookie:** Refresh token xavfsiz Cookie orqali boshqariladi.

4. **Tizimdan chiqish (Logout):**
   - Backendga so‘rov yuboriladi, cookie va tokenlar tozalab yuboriladi.
   - Foydalanuvchi darhol login sahifasiga yo‘naltiriladi.

5. **Katalog va Mahsulotlar:**
   - Real-vaqtda qidirish (Search)
   - Kategoriyalar bo‘yicha filterlash
   - Saralash: Arzon, Qimmat, Reyting
   - Mahsulot rasmi, chegirma foizlari, reyting va sharhlar
   - Mahsulot batafsil sahifasi (features, miqdor tanlash, savatchaga qo‘shish)

6. **Xarid savatchasi (Cart):**
   - Mahsulot qo‘shish, sonini oshirish/kamaytirish, o‘chirish
   - Umumiy summa va yetkazib berish narxining avtomatik hisoblanishi
   - Navbar ichida cart count indikatori
   - LocalStorage orqali ma’lumotlar doimiy saqlanadi

7. **Buyurtma berish (Checkout) & Mening buyurtmalarim:**
   - Yetkazib berish manzili, telefon raqami, to‘lov usullari (Payme, Click, Naqd)
   - Buyurtmalar tarixi, holati (Jarayonda, Yetkazildi) va tarkibi

8. **Dizayn va qulaylik:**
   - 🌓 **Dark / Light mode** (tungi va kunduzgi rejim)
   - 📱 **To‘liq Responsive** (Mobil, Planshet, Desktop)
   - 🔔 **Zamonaviy Toast bildirishnomalar**
   - ⚡ **Loading spinnerlar va Empty state** ko‘rinishlari

---

## 📁 Loyiha Strukturasi:
```
acces/
├── index.js                  # Express backend server (JWT, Auth, Products, Orders)
├── index.html                # Asosiy HTML hujjati
├── package.json              # Bog‘liqliklar va skriptlar
├── vite.config.js            # Vite va Proxy sozlamalari
├── tailwind.config.js        # Tailwind CSS va Dark Mode sozlamalari
└── src/
    ├── components/           # Navbar, Footer, ProductCard, LoadingSpinner, EmptyState
    ├── pages/                # Home, Products, ProductDetail, Categories, Cart, Checkout, MyOrders, Profile, Login, Register, NotFound
    ├── context/              # AuthContext, CartContext, ThemeContext, ToastContext
    ├── services/             # api.js (Axios + Interceptors), authService, productService, orderService
    ├── routes/               # AppRoutes.jsx, ProtectedRoute.jsx
    ├── utils/                # constants.js, formatPrice, formatDate
    ├── App.jsx               # Asosiy konteyner
    ├── main.jsx              # Kirish nuqtasi
    └── index.css             # Tailwind uslublari
```

