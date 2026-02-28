---
name: LOSEV Gorselleri Entegrasyonu
overview: Landing page'e LOSEV'in resmi gorsellerini, sloganlarini ve marka dilini entegre ederek sayfayi gercekci ve profesyonel hale getirme.
todos:
  - id: hero-images
    content: Hero section sag tarafini LOSEV CDN gorsel kolaji ile degistir, dekoratif ikonlari kucult
    status: completed
  - id: losev-slogans
    content: Hero, CTA ve aciklama metinlerini LOSEV'in resmi sloganlari ile guncelle
    status: completed
  - id: cta-background
    content: CTA section'a LOSEV gorseli arka plan olarak ekle (overlay ile)
    status: completed
  - id: inci-banner
    content: Nasil Calisir bolumu oncesine LOSEV Incileri tanitim banneri ekle
    status: completed
isProject: false
---

# LOSEV Gorselleri ve Marka Entegrasyonu

Degisecek dosyalar:

- [src/app/page.tsx](src/app/page.tsx) -- hero section ve CTA guncelleme
- [next.config.js](next.config.js) -- remote image pattern zaten mevcut, degisiklik gerekmez

## Yapilacaklar

### 1. Hero Section'a LOSEV Gorseli Ekleme

Sag taraftaki soyut daireli illustrasyon yerine, LOSEV'in CDN'indeki gercek gorsellerini kullanarak bir gorsel grubu olusturma:

- Ana gorsel: `https://newpageapi.losev.org.tr/losev/slider/1e4839b7-31e3-4c61-b163-7ca422530133.jpg` (losemili cocuk gorunen slider gorseli)
- Ikinci gorsel: `https://newpageapi.losev.org.tr/losev/slider/944f2d90-b1c1-40f2-a764-af94e6dc5571.jpg`
- Goerseller rounded-2xl ile yumusatilmis, hafif golge ve rotate efektiyle ust uste bindirilmis kolaj formunda yerlestirilecek
- Etrafinda hala animasyonlu dekoratif ikonlar (kalp, yildiz) kalacak ama daha kucuk ve gorsele destek olarak

### 2. LOSEV'in Gercek Sloganlari

LOSEV'in kendi sitesinden alinan gercek ifadeler:

- Hero alt baslik: "LÖSEV'in gucu, gonullulerinin yureginde saklidir." (resmi siteden)
- CTA bolumu: "Her adiminiz, yeni bir hayatin baslangici olsun." (resmi siteden)
- "10 Milyonuncu Gonullumuz Ol!" referansi (kampanya mesaji)

### 3. CTA Section Gorseli

Alt CTA bolumune de ikinci slider gorselini arka plan olarak ekleme (overlay ile koyulastirilmis, uzerine yazi)

### 4. LOSEV Inci Projesi Aciklamasi

"Nasil Calisir?" bolumunun ustune kucuk bir banner/alinti ekleyerek LOSEV Incileri projesinin ne oldugunu 1-2 cumlede aciklama (resmi siteden: "gelecegin duyarli bireylerini yetistirmek icin kucuk yaslardan itibaren cocuklara ve genclere dokunan uzun soluklu bir iyilik yolculugu")