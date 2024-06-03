import mongoose from 'mongoose';

// Bir Singleton deseni uygulanıyor
let instance = null;
class Database {
  constructor() {
    // Singleton: Tek bir örnek oluşturulması için kontrol sağlanıyor
    if (!instance) {
      // MongoDB bağlantısı için bir alan oluşturuluyor
      this.mongoConnection = null;
      // instance, bu sınıfın tek örneği olarak ayarlanıyor
      instance = this;
    }
    // Eğer daha önce bir örnek oluşturulmuşsa, mevcut örneği döndür
    return instance;
  }

  // MongoDB'ye bağlanmak için bir yöntem
  async connect(options) {
    // MongoDB'ye bağlanma işlemi gerçekleştiriliyor
    console.log('db connecting...');
    let db = await mongoose.connect(options.CONNECTION_STRING);
    // Bağlantı bilgileri bu sınıfın mongoConnection özelliğine atanıyor
    this.mongoConnection = db;
  }
}

// Database sınıfı dışa aktarılıyor
export default Database;
