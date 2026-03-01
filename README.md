# LÖSEV İnci Gönüllülük Takip Sistemi

LÖSEV İnci Gönüllülük Takip Sistemi, öğrencilerin sosyal sorumluluk ve gönüllülük faaliyetlerini dijital ortamda kaydedip, öğretmenleri ve genel merkez tarafından takip edilmesini sağlayan modern bir web uygulamasıdır. 

Öğrenciler katıldıkları etkinlikleri (stant açma, seminer, bağış toplama vb.) sisteme girer, öğretmenleri bu etkinlikleri onaylar ve öğrenciler kazandıkları gönüllülük saatlerine göre çeşitli rozetler (Bronz, Gümüş, Altın, Platin) kazanırlar.

## 🚀 Özellikler

- **Rol Bazlı Erişim (RBAC):** Öğrenci, Öğretmen (Okul Koordinatörü) ve Admin (Genel Merkez) olmak üzere 3 farklı panel.
- **Modern Tasarım:** Glassmorphism (buzlu cam) efektleri, akıcı animasyonlar ve mobil uyumlu (responsive) kullanıcı arayüzü.
- **Etkinlik Yönetimi:** Kanıt (fotoğraf/belge) destekli etkinlik girişi ve öğretmen onay/red/revizyon mekanizması.
- **Oyunlaştırma (Gamification):** Öğrencilerin gönüllülük saatlerine göre kazandıkları dinamik rozet sistemi.
- **Gelişmiş Raporlama:** En aktif öğrenciler, en aktif okullar ve aylık gönüllülük saati istatistikleri.

## 🛠️ Teknoloji Yığını

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Stil & UI:** [Tailwind CSS](https://tailwindcss.com/)
- **Veritabanı & ORM:** [SQLite](https://sqlite.org/) + [Prisma](https://www.prisma.io/)
- **Kimlik Doğrulama:** [NextAuth.js](https://next-auth.js.org/) (JWT tabanlı)
- **Validasyon:** [Zod](https://zod.dev/)
- **Dağıtım (Deployment):** Docker & Docker Compose

## 🔑 Test Hesapları (Demo)

Uygulamadaki farklı rolleri test edebilmeniz için aşağıdaki hazır demo hesaplarını kullanabilirsiniz:

| Rol | E-posta | Şifre |
| :--- | :--- | :--- |
| **Admin** (Genel Merkez) | `admin@losev.org` | `123456` |
| **Öğretmen** (Koordinatör) | `ayse@losev.org` | `123456` |
| **Öğrenci** | `ali@ogrenci.com` | `123456` |

> *Panele giriş yapmak için sağ üstteki "Giriş Yap" butonunu kullanabilirsiniz.*

## 💻 Kurulum ve Çalıştırma

Projeyi yerel bilgisayarınızda (local environment) çalıştırmak için iki yöntem bulunmaktadır.

### Yöntem 1: Standart (Node.js ile)

Önkoşul: Bilgisayarınızda [Node.js](https://nodejs.org/) (v18+) yüklü olmalıdır.

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
2. Veritabanını oluşturun ve Prisma istemcisini güncelleyin:
   ```bash
   npx prisma db push
   npx prisma generate
   ```
3. (Opsiyonel) Demo verilerini (test hesapları dahil) veritabanına yükleyin:
   ```bash
   npm run db:seed
   ```
4. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```
5. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidin.

### Yöntem 2: Docker ile

Önkoşul: Bilgisayarınızda [Docker](https://www.docker.com/) yüklü olmalıdır.

1. Proje dizininde aşağıdaki komutu çalıştırarak konteynerleri ayağa kaldırın:
   ```bash
   docker compose up --build -d
   ```
2. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidin.
3. Uygulamayı durdurmak için:
   ```bash
   docker compose down
   ```

## 🔒 Güvenlik Notları

- Tüm API rotaları yetkilendirme (authorization) ve giriş doğrulaması (Zod) ile korunmaktadır.
- Admin, Öğretmen ve Öğrenci panelleri izole edilmiştir. Veri sızıntısını önlemek adına okullar ve öğrenciler sadece kendi koordinatör öğretmenleri tarafından görüntülenebilir.
- *Production (Canlı)* ortama alırken mutlaka `.env` dosyası oluşturup karmaşık bir `NEXTAUTH_SECRET` değişkeni tanımlanmalıdır.
