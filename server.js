import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';

// ES Modules ortamında __dirname tanımı
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env dosyasındaki değişkenleri yükle
dotenv.config();

// Express uygulamasını başlat
const app = express();

// ── Middleware'ler ──────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Statik Dosyalar (uploads klasörünü dışa aç) ─────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Rotalar ────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

// ── Sağlık Kontrolü ────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({ message: 'EduFlow API çalışıyor 🚀' });
});

// ── MongoDB Bağlantısı ve Sunucuyu Başlatma ────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eduflow';

console.log('🔍 Kullanılan MONGO_URI:', MONGO_URI);

mongoose.connection.on('connected', () => {
    console.log('✅ Bağlanılan Veritabanı:', mongoose.connection.name);
    console.log('✅ Bağlantı Adresi:', mongoose.connection.host);
});

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB bağlantısı başarılı.');

        app.listen(PORT, () => {
            console.log(`🚀 EduFlow sunucusu ${PORT} portunda çalışıyor.`);
        });
    })
    .catch((error) => {
        console.error('❌ MongoDB bağlantı hatası:', error.message);
        process.exit(1);
    });
