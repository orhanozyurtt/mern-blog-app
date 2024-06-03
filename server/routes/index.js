import express from 'express';

// 'url' modülünden fileURLToPath fonksiyonunu içeri aktarıyoruz
// Bu fonksiyon, bir URL'yi dosya yoluna dönüştürmek için kullanılacak
import { fileURLToPath } from 'url';

// 'path' modülünden dirname ve join fonksiyonlarını içeri aktarıyoruz
// dirname, bir dosya yolundan dizin adını çıkarır
// join, bir veya daha fazla dosya yolu bölgesini birleştirir ve birleştirilmiş yol adını oluşturur
import { dirname, join } from 'path';

// 'fs' modülünü içeri aktarıyoruz
// Bu modül, dosya işlemleri için kullanılacak
import fs from 'fs';

// Express Router'ını kullanarak bir router nesnesi oluşturuyoruz
const router = express.Router();
router.get('/', (req, res) => {
  res.json('welcome api');
});
// __filename değişkenini, import.meta.url kullanarak alıyoruz ve bu URL'yi dosya yoluna dönüştürüyoruz
const __filename = fileURLToPath(import.meta.url);

// Dosya yolunu kullanarak dizin adını alıyoruz
const __dirname = dirname(__filename);

// __dirname'deki rota dosyalarını okuyoruz
const routes = fs.readdirSync(__dirname);

// Rotaları yükleyen bir async işlev tanımlıyoruz
const loadRoutes = async () => {
  // Tüm rotaları işle
  for (const route of routes) {
    // .js ile biten ve index.js olmayan dosyaları işle
    if (route.endsWith('.js') && route !== 'index.js') {
      // Rota dosyasının tam yolunu oluştur
      const routePath = join(__dirname, route);

      // Rota dosyasını içeri aktar
      const { default: routeModule } = await import(`file://${routePath}`);

      // Eğer rota modülü varsa, rotayı router'a ekle
      if (routeModule) {
        router.use(`/${route.replace('.js', '')}`, routeModule);
      }
    }
  }
};

// Rotaları yükle ve herhangi bir hata olursa konsola yazdır
loadRoutes().catch((error) => {
  console.error('Error while loading routes:', error);
});

// Router nesnesini dışa aktar
export default router;
