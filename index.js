const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'online_shop_access_secret_key_3m_expire';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'online_shop_refresh_secret_key_7d_expire';
const ACCESS_TOKEN_EXPIRY = '3m'; // 3 daqiqa
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 kun

// ======================== SECURITY MIDDLEWARE ========================

// 1. HELMET: HTTP xavfsizlik sarlavhalarini (Security Headers) qo'shish
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Rasmlar va media fayllarning to'siqsiz yuklanishi
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false // Vite/Frontend bilan mos ishlashi uchun
}));

// 2. CORS (Cross-Origin Resource Sharing) xavfsiz konfiguratsiyasi
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Brauzer bo'lmagan so'rovlar (Postman, mobil ilovalar) yoki ro'yxatdagi domenlar
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS to'sig'i: ${origin} manzilidan ulanish taqiqlangan`));
    }
  },
  credentials: true, // Xavfsiz httpOnly cookie (Refresh Token) almashinuvi uchun
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie']
};

app.use(cors(corsOptions));

// 3. Body parsers & cookies
app.use(express.json());
app.use(cookieParser());

// In-Memory Database
const users = [
  {
    id: 'user_1',
    name: 'Dilshodbek Olimov',
    email: 'user@example.com',
    passwordHash: bcrypt.hashSync('Password123!', 10),
    phone: '+998 90 123 45 67',
    address: 'Toshkent shahar, Chilonzor tumani, 9-mavze',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    createdAt: new Date().toISOString()
  }
];

// Refresh token store (whitelist/active sessions)
let activeRefreshTokens = new Set();

const categories = [
  { id: 'all', name: 'Barchasi', icon: 'LayoutGrid' },
  { id: 'electronics', name: 'Elektronika', icon: 'Smartphone' },
  { id: 'fashion', name: 'Kiyim-kechak', icon: 'Shirt' },
  { id: 'home', name: 'Uy va oshxona', icon: 'Home' },
  { id: 'accessories', name: 'Aksessuarlar', icon: 'Watch' },
  { id: 'sports', name: 'Sport va dam olish', icon: 'Activity' }
];

const products = [
  {
    id: 'prod_1',
    name: 'Apple iPhone 15 Pro Max 256GB Natural Titanium',
    price: 1199,
    originalPrice: 1299,
    category: 'electronics',
    rating: 4.9,
    reviewsCount: 142,
    stock: 15,
    isFeatured: true,
    description: 'A17 Pro chipi, kuchli titanium korpus, 48MP asosiy kamera va USB-C porti bilan eng ilg‘or smartfon.',
    features: ['Titanium dizayn', 'A17 Pro protsessor', '48MP Pro kamera', 'Super Retina XDR ekran'],
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod_2',
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling',
    price: 349,
    originalPrice: 399,
    category: 'electronics',
    rating: 4.8,
    reviewsCount: 88,
    stock: 22,
    isFeatured: true,
    description: 'Ovozni bekor qilish (ANC) bo‘yicha jahon yetakchisi, kristalldek toza ovoz va 30 soat batareya quvvati.',
    features: ['Sanoatda yetakchi ANC', 'Hi-Res audio', '30 soat batareya', 'Multipoint ulanish'],
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod_3',
    name: 'MacBook Pro 14" M3 Pro 18GB/512GB Space Black',
    price: 1999,
    originalPrice: 2199,
    category: 'electronics',
    rating: 4.9,
    reviewsCount: 64,
    stock: 8,
    isFeatured: true,
    description: 'Professional darajadagi unumdorlik, Liquid Retina XDR ekrani va butun kun davom etadigan quvvat.',
    features: ['Apple M3 Pro chip', '18GB Unified Memory', 'Liquid Retina XDR', '22 soatgacha batareya'],
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod_4',
    name: 'Nike Air Max 270 Black & White Sneaker',
    price: 150,
    originalPrice: 170,
    category: 'fashion',
    rating: 4.7,
    reviewsCount: 210,
    stock: 35,
    isFeatured: true,
    description: 'Zamonaviy shahar uslubi va ajoyib amortizatsiya uchun ulkan Air birligi.',
    features: ['Maksimal qulaylik', 'Nafas oluvchi to‘r', 'Kauchuk taglik', 'Engil dizayn'],
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod_5',
    name: 'Minimalist Premium Charm Kurtka (Erkaklar)',
    price: 189,
    originalPrice: 230,
    category: 'fashion',
    rating: 4.6,
    reviewsCount: 52,
    stock: 12,
    isFeatured: false,
    description: '100% tabiiy charmdan ishlangan, zamonaviy bichimli va shamolga chidamli kurtka.',
    features: ['Tabiiy charm', 'YKK zamoklar', 'Issiq astar', 'Ichki cho‘ntaklar'],
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod_6',
    name: 'Apple Watch Series 9 GPS 45mm Midnight',
    price: 429,
    originalPrice: 479,
    category: 'accessories',
    rating: 4.8,
    reviewsCount: 95,
    stock: 18,
    isFeatured: true,
    description: 'S9 SiP chip, ikkita teginish (Double Tap) funksiyasi va chuqur salomatlik monitoringi.',
    features: ['Double tap jesti', 'EKG va qon kislorodi', 'Har doim yoniq Retina', 'Crash Detection'],
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod_7',
    name: 'Dyson V15 Detect Simsiz Changyutgich',
    price: 749,
    originalPrice: 799,
    category: 'home',
    rating: 4.9,
    reviewsCount: 77,
    stock: 10,
    isFeatured: false,
    description: 'Lazer nuri ko‘rinmas changlarni ko‘rsatadi, ilmiy darajadagi chuqur tozalash.',
    features: ['Lazerli aniqlash', 'Piezo sensor', '60 daqiqa quvvat', 'LCD ekran hisoboti'],
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod_8',
    name: 'Nespresso Vertuo Pop Qahva Mashinasi',
    price: 129,
    originalPrice: 159,
    category: 'home',
    rating: 4.6,
    reviewsCount: 114,
    stock: 25,
    isFeatured: false,
    description: 'Centrifusion texnologiyasi bilan bir tugmada mukammal kremali espresso va kofe tayyorlaydi.',
    features: ['5 xil kofe hajmi', 'Centrifusion aylanish', 'Kompakt dizayn', 'Tez qizish'],
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod_9',
    name: 'Ray-Ban Classic Aviator Quyosh Ko‘zoynagi',
    price: 165,
    originalPrice: 185,
    category: 'accessories',
    rating: 4.7,
    reviewsCount: 180,
    stock: 30,
    isFeatured: false,
    description: 'Afsonaviy aviator dizayni, 100% UV himoyasi va yuqori sifatli metall ramka.',
    features: ['100% UV400 himoya', 'Kristall linzalar', 'Bardoshli metall', 'Klassik stil'],
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod_10',
    name: 'Garmin Fenix 7 Pro Solar Multisport Soati',
    price: 799,
    originalPrice: 899,
    category: 'sports',
    rating: 4.9,
    reviewsCount: 43,
    stock: 7,
    isFeatured: true,
    description: 'Quyosh batareyasi bilan zaryadlanuvchi, o‘rnatilgan fonarchali professional sport soati.',
    features: ['Quyoshdan quvvatlanish', 'Topografik xaritalar', 'O‘rnatilgan LED fonar', '37 kungacha batareya'],
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod_11',
    name: 'Manduka PRO Yoga Gilamchasi (6mm)',
    price: 120,
    originalPrice: 135,
    category: 'sports',
    rating: 4.8,
    reviewsCount: 65,
    stock: 40,
    isFeatured: false,
    description: 'O‘ta zich yostiqcha, umrlik kafolat va sirpanishga qarshi professional sirt.',
    features: ['6mm qalinlik', 'Toksik bo‘lmagan material', 'Sirpanmas sirt', 'Yengil tozalash'],
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod_12',
    name: 'Sony PlayStation 5 Slim Digital Edition',
    price: 499,
    originalPrice: 549,
    category: 'electronics',
    rating: 4.9,
    reviewsCount: 310,
    stock: 14,
    isFeatured: true,
    description: 'Yangi yupqaroq dizayn, 1TB SSD xotira va 4K 120Hz geyming tajribasi.',
    features: ['Ultra-tezkor SSD', 'Ray Tracing', 'DualSense haptic feedback', 'Tempest 3D Audio'],
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod_13',
    name: 'Samsung Galaxy S24 Ultra 512GB Titanium Gray',
    price: 1299,
    originalPrice: 1399,
    category: 'electronics',
    rating: 4.9,
    reviewsCount: 165,
    stock: 11,
    isFeatured: true,
    description: 'Galaxy AI sun’iy intellekti, o‘rnatilgan S-Pen ruchkasi va 200MP aqlbovar qilmas kamera.',
    features: ['Galaxy AI imkoniyatlari', 'Titanium rom', '200MP kamera', 'Snapdragon 8 Gen 3'],
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod_14',
    name: 'Apple AirPods Max Wireless Over-Ear Silver',
    price: 549,
    originalPrice: 599,
    category: 'electronics',
    rating: 4.8,
    reviewsCount: 94,
    stock: 9,
    isFeatured: true,
    description: 'Hisoblash audiosi, fazoviy ovoz (Spatial Audio) va yuqori darajadagi alyuminiy korpus.',
    features: ['Aktiv shovqinni so‘ndirish', 'Transparent rejim', 'Apple H1 chipi', 'Aqlli g‘ilof'],
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod_15',
    name: 'Marshall Stanmore III Bluetooth Kolonkasi',
    price: 379,
    originalPrice: 420,
    category: 'electronics',
    rating: 4.9,
    reviewsCount: 58,
    stock: 16,
    isFeatured: false,
    description: 'Afsonaviy Marshall rok uslubi va uyni to‘ldiruvchi chuqur bass ovozi.',
    features: ['Keng sahnadagi ovoz', 'Bluetooth 5.2', 'Ekologik materiallar', 'Analog boshqaruv'],
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod_16',
    name: 'Nike Air Jordan 1 Retro High OG Chicago',
    price: 210,
    originalPrice: 240,
    category: 'fashion',
    rating: 4.9,
    reviewsCount: 420,
    stock: 20,
    isFeatured: true,
    description: 'Tarixdagi eng mashhur basketbol krossovkasi. Afsonaviy qizil, oq va qora ranglar uyg‘unligi.',
    features: ['Klassik dizayn', 'Tabiiy charm', 'Nike Air yostiqchasi', 'Kolleksion model'],
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod_17',
    name: 'Kashmir Issiq Sviter (Unisex)',
    price: 95,
    originalPrice: 120,
    category: 'fashion',
    rating: 4.7,
    reviewsCount: 48,
    stock: 28,
    isFeatured: false,
    description: '100% yumshoq kashmirdan to‘qilgan, yengil va sovuq kunlarda tanani iliq tutuvchi sviter.',
    features: ['100% Kashmir', 'Nafas oluvchi tola', 'Klassik yoqa', 'Yuvishda shaklini yo‘qotmaydi'],
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod_18',
    name: 'Casio G-Shock GA-2100 "CasiOak" All Black',
    price: 130,
    originalPrice: 150,
    category: 'accessories',
    rating: 4.8,
    reviewsCount: 130,
    stock: 25,
    isFeatured: false,
    description: 'Uglerod yadroli o‘ta pishiq korpus, 200 metr suv o‘tkazmaslik va zamonaviy oktagonal shakl.',
    features: ['Carbon Core Guard', '200M suvga chidamli', 'Zarbalarga bardoshli', 'Yorqin LED yorug‘lik'],
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod_19',
    name: 'Samsonite Pro-DLX 6 Biznes Ryukzak',
    price: 175,
    originalPrice: 210,
    category: 'accessories',
    rating: 4.8,
    reviewsCount: 72,
    stock: 14,
    isFeatured: false,
    description: '15.6 dyuymli noutbuk uchun himoyalangan bo‘lma, USB quvvatlash porti va suv o‘tkazmas mato.',
    features: ['RFID himoyasi', 'Easy Pass kabel tizimi', 'Suvga chidamli neylon', 'Ergonomik tasmalar'],
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod_20',
    name: 'Xiaomi Robot Vacuum X10+ Aqlli Changyutgich',
    price: 680,
    originalPrice: 750,
    category: 'home',
    rating: 4.8,
    reviewsCount: 89,
    stock: 8,
    isFeatured: true,
    description: 'O‘z-o‘zini tozalovchi stansiya, issiq havo bilan quritish, lidar navigatsiya va 4000Pa tortish kuchi.',
    features: ['Avtomatik mop yuvish', 'LDS lazerli xaritalash', 'Mi Home ilovasi', 'To‘siqlardan aqlli aylanib o‘tish'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod_21',
    name: 'Tefal OptiGrill Elite Aqlli Elektr Gril',
    price: 249,
    originalPrice: 299,
    category: 'home',
    rating: 4.7,
    reviewsCount: 63,
    stock: 19,
    isFeatured: false,
    description: 'Go‘sht qalinligini avtomatik o‘lchash va mukammal qovurilish darajasini ta’minlash sensori.',
    features: ['12 ta avtomatik dastur', 'Intellektual sensor', 'Olinadigan plitalar', 'Qovurish yordamchisi'],
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod_22',
    name: 'Bowflex SelectTech Sozlanuvchi Gantellar (Juflik)',
    price: 399,
    originalPrice: 450,
    category: 'sports',
    rating: 4.9,
    reviewsCount: 54,
    stock: 6,
    isFeatured: true,
    description: 'Bir aylanishda 2 kg dan 24 kg gacha og‘irlikni o‘zgartiradi. 15 ta gantel juftligining o‘rnini bosadi.',
    features: ['2-24 kg sozlash', 'Joy tejovchi dizayn', 'Silliq mexanizm', 'Mustahkam po‘lat'],
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod_23',
    name: 'Hydro Flask 32 oz Keng Bo‘g‘izli Termos',
    price: 45,
    originalPrice: 55,
    category: 'sports',
    rating: 4.8,
    reviewsCount: 220,
    stock: 50,
    isFeatured: false,
    description: 'Ichimlikni 24 soat sovuq, 12 soat qaynoq saqlovchi TempShield vakuumli zanglamas po‘lat idish.',
    features: ['TempShield izolyatsiya', '18/8 zanglamas po‘lat', 'BPA-free', 'Sirpanmas qoplama'],
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod_24',
    name: 'Canon EOS R6 Mark II Mirrorless Fotoapparat',
    price: 2399,
    originalPrice: 2599,
    category: 'electronics',
    rating: 4.9,
    reviewsCount: 38,
    stock: 5,
    isFeatured: true,
    description: '24.2 MP to‘liq kadrli sensor, 40 kadr/sek tezkor suratga olish va 4K 60p video yozish.',
    features: ['Dual Pixel CMOS AF II', '8-stop tasvir stabilizatsiyasi', '4K 60p oversampled', 'Kamera ichidagi HDR'],
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'
  }
];

const orders = [
  {
    id: 'ORD-7821',
    userId: 'user_1',
    date: '2026-11-05T14:30:00.000Z',
    status: 'Yetkazildi',
    paymentMethod: 'Karta orqali (Payme)',
    shippingAddress: 'Toshkent shahar, Chilonzor tumani, 9-mavze, 12-uy',
    items: [
      {
        id: 'prod_2',
        name: 'Sony WH-1000XM5 Wireless Noise Cancelling',
        price: 349,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
      }
    ],
    totalAmount: 349
  }
];

// Token Helpers
function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY } // 3 daqiqa
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY } // 7 kun
  );
}

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: 'Token talab qilinadi (Kirish huquqi yo‘q)' });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Access Token muddati tugagan (TokenExpired)', 
          expired: true 
        });
      }
      return res.status(403).json({ message: 'Yaroqsiz token' });
    }
    req.user = user;
    next();
  });
}

// ======================== ROUTES ========================

// 1. REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Barcha maydonlarni to‘ldirish shart' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email formati noto‘g‘ri' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Parol va tasdiqlash paroli bir-biriga mos kelmadi' });
    }

    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ message: 'Bu email bilan allaqachon ro‘yxatdan o‘tilgan' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      phone: '',
      address: '',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    activeRefreshTokens.add(refreshToken);

    // Refresh tokenni xavfsiz httpOnly cookie da saqlash (7 kun)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // localhost uchun false, prod da true
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 kun
    });

    const { passwordHash: _, ...userSafe } = newUser;
    return res.status(201).json({
      message: 'Muvaffaqiyatli ro‘yxatdan o‘tdingiz!',
      user: userSafe,
      accessToken,
      refreshToken // Cookie bloklangan hollarda fallback uchun ham qaytariladi
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Serverda xatolik yuz berdi' });
  }
});

// 2. LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email va parolni kiriting' });
    }

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ message: 'Email yoki parol noto‘g‘ri' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email yoki parol noto‘g‘ri' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    activeRefreshTokens.add(refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 kun
    });

    const { passwordHash: _, ...userSafe } = user;
    return res.json({
      message: 'Tizimga muvaffaqiyatli kirdingiz!',
      user: userSafe,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Serverda xatolik yuz berdi' });
  }
});

// 3. REFRESH TOKEN (Access token 3m tugaganda chaqiriladi)
app.post('/api/auth/refresh', (req, res) => {
  const tokenFromCookie = req.cookies && req.cookies.refreshToken;
  const tokenFromBody = req.body && req.body.refreshToken;
  const refreshToken = tokenFromCookie || tokenFromBody;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token topilmadi, qaytadan kiring' });
  }

  if (!activeRefreshTokens.has(refreshToken)) {
    return res.status(403).json({ message: 'Refresh token bekor qilingan yoki yaroqsiz' });
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      activeRefreshTokens.delete(refreshToken);
      res.clearCookie('refreshToken');
      return res.status(403).json({ message: 'Refresh token muddati tugagan yoki yaroqsiz' });
    }

    const user = users.find(u => u.id === decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
    }

    // Yangi access token (3 daqiqa) yaratiladi
    const newAccessToken = generateAccessToken(user);

    return res.json({
      accessToken: newAccessToken,
      message: 'Token muvaffaqiyatli yangilandi'
    });
  });
});

// 4. LOGOUT
app.post('/api/auth/logout', (req, res) => {
  const tokenFromCookie = req.cookies && req.cookies.refreshToken;
  const tokenFromBody = req.body && req.body.refreshToken;
  const refreshToken = tokenFromCookie || tokenFromBody;

  if (refreshToken) {
    activeRefreshTokens.delete(refreshToken);
  }

  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'lax'
  });

  return res.json({ message: 'Tizimdan muvaffaqiyatli chiqildi' });
});

// 5. PROFILE (Protected)
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
  }
  const { passwordHash: _, ...userSafe } = user;
  return res.json({ user: userSafe });
});

app.put('/api/auth/profile', authenticateToken, (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.user.id);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
  }

  const { name, phone, address, avatar } = req.body;
  if (name) users[userIndex].name = name;
  if (phone !== undefined) users[userIndex].phone = phone;
  if (address !== undefined) users[userIndex].address = address;
  if (avatar) users[userIndex].avatar = avatar;

  const { passwordHash: _, ...userSafe } = users[userIndex];
  return res.json({ message: 'Profil muvaffaqiyatli yangilandi', user: userSafe });
});

// 6. CATEGORIES
app.get('/api/categories', (req, res) => {
  res.json({ categories });
});

// 7. PRODUCTS (Search, Filter, Sort)
app.get('/api/products', (req, res) => {
  const { search = '', category = 'all', sort = 'default' } = req.query;

  let filtered = [...products];

  // Category filter
  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  // Search filter
  if (search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q)
    );
  }

  // Sort
  if (sort === 'price_asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  res.json({
    products: filtered,
    total: filtered.length
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Mahsulot topilmadi' });
  }
  res.json({ product });
});

// 8. ORDERS (Protected)
app.get('/api/orders', authenticateToken, (req, res) => {
  const userOrders = orders.filter(o => o.userId === req.user.id);
  res.json({ orders: userOrders.reverse() });
});

app.post('/api/orders', authenticateToken, (req, res) => {
  const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

  if (!items || !items.length || !totalAmount) {
    return res.status(400).json({ message: 'Buyurtma uchun mahsulotlar kiritilishi lozim' });
  }

  const newOrder = {
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: req.user.id,
    date: new Date().toISOString(),
    status: 'Jarayonda',
    paymentMethod: paymentMethod || 'Karta orqali',
    shippingAddress: shippingAddress || 'Ko‘rsatilmagan',
    items,
    totalAmount
  };

  orders.push(newOrder);
  res.status(201).json({ message: 'Buyurtma muvaffaqiyatli qabul qilindi!', order: newOrder });
});

// Root health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), message: 'Online Shop API is running' });
});

app.listen(PORT, () => {
  console.log(`>>> Online Shop Backend Server running on http://localhost:${PORT}`);
});

