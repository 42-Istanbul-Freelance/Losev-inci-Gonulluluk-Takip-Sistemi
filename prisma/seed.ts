import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.activity.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.user.deleteMany();
  await prisma.school.deleteMany();

  // Create schools
  const schools = await Promise.all([
    prisma.school.create({
      data: { name: "Atatürk Anadolu Lisesi", city: "İstanbul", district: "Kadıköy" },
    }),
    prisma.school.create({
      data: { name: "Cumhuriyet Ortaokulu", city: "İstanbul", district: "Beşiktaş" },
    }),
    prisma.school.create({
      data: { name: "Mehmet Akif Ersoy Lisesi", city: "Ankara", district: "Çankaya" },
    }),
    prisma.school.create({
      data: { name: "İnönü Anadolu Lisesi", city: "İzmir", district: "Konak" },
    }),
    prisma.school.create({
      data: { name: "Fatih Sultan Mehmet Ortaokulu", city: "Bursa", district: "Osmangazi" },
    }),
    prisma.school.create({
      data: { name: "Mimar Sinan Lisesi", city: "Antalya", district: "Muratpaşa" },
    }),
  ]);

  const hashedPassword = await hash("123456", 12);

  // Create admin
  await prisma.user.create({
    data: {
      name: "Admin Kullanıcı",
      email: "admin@losev.org",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // Create teachers
  const teachers = await Promise.all(
    [
      { name: "Ayşe Yılmaz", email: "ayse@losev.org", schoolIdx: 0 },
      { name: "Mehmet Kaya", email: "mehmet@losev.org", schoolIdx: 2 },
      { name: "Fatma Demir", email: "fatma@losev.org", schoolIdx: 3 },
    ].map(async (t) => {
      const user = await prisma.user.create({
        data: {
          name: t.name,
          email: t.email,
          password: hashedPassword,
          role: "TEACHER",
          phone: "05551234567",
        },
      });
      const teacher = await prisma.teacher.create({
        data: {
          userId: user.id,
          schoolId: schools[t.schoolIdx].id,
        },
      });
      return teacher;
    })
  );

  // Create students
  const studentData = [
    { name: "Ali Veli", email: "ali@ogrenci.com", grade: "10", schoolIdx: 0, teacherIdx: 0 },
    { name: "Zeynep Kara", email: "zeynep@ogrenci.com", grade: "11", schoolIdx: 0, teacherIdx: 0 },
    { name: "Emre Şahin", email: "emre@ogrenci.com", grade: "9", schoolIdx: 0, teacherIdx: 0 },
    { name: "Elif Yıldız", email: "elif@ogrenci.com", grade: "10", schoolIdx: 2, teacherIdx: 1 },
    { name: "Burak Çelik", email: "burak@ogrenci.com", grade: "8", schoolIdx: 1, teacherIdx: 0 },
    { name: "Sude Arslan", email: "sude@ogrenci.com", grade: "11", schoolIdx: 3, teacherIdx: 2 },
    { name: "Kaan Özdemir", email: "kaan@ogrenci.com", grade: "10", schoolIdx: 3, teacherIdx: 2 },
    { name: "Merve Aydın", email: "merve@ogrenci.com", grade: "7", schoolIdx: 4, teacherIdx: 0 },
    { name: "Arda Koç", email: "arda@ogrenci.com", grade: "12", schoolIdx: 5, teacherIdx: 2 },
    { name: "Deniz Polat", email: "deniz@ogrenci.com", grade: "9", schoolIdx: 2, teacherIdx: 1 },
  ];

  const students = await Promise.all(
    studentData.map(async (s) => {
      const user = await prisma.user.create({
        data: {
          name: s.name,
          email: s.email,
          password: hashedPassword,
          role: "STUDENT",
        },
      });
      const student = await prisma.student.create({
        data: {
          userId: user.id,
          schoolId: schools[s.schoolIdx].id,
          grade: s.grade,
          coordinatorId: teachers[s.teacherIdx].id,
          targetHours: 40,
        },
      });
      return student;
    })
  );

  // Create activities
  const activityTypes = [
    "SEMINER", "STANT", "BAGIS", "KERMES",
    "KAMUSAL_BILINCLENDIRME", "SOSYAL_MEDYA", "FARKINDALIK",
  ];

  const descriptions = [
    "Okul bahçesinde lösemi farkındalık standı kuruldu, broşür dağıtıldı.",
    "Sosyal medya üzerinden LÖSEV tanıtım videosu paylaşıldı.",
    "Okul kantininde kermes düzenlendi, gelir LÖSEV'e aktarıldı.",
    "Sınıflarda lösemi hakkında bilinçlendirme semineri verildi.",
    "Mahallede kapı kapı dolaşılarak bağış toplandı.",
    "Instagram ve Twitter'da farkındalık kampanyası yürütüldü.",
    "Okul koridorlarına farkındalık afişleri asıldı.",
    "Yerel gazetede LÖSEV hakkında yazı yayımlandı.",
    "Diğer öğrencilere gönüllülük hakkında sunum yapıldı.",
    "Online bağış kampanyası düzenlendi.",
  ];

  const now = new Date();

  for (let i = 0; i < students.length; i++) {
    const actCount = 3 + Math.floor(Math.random() * 8);
    let totalApprovedHours = 0;

    for (let j = 0; j < actCount; j++) {
      const daysAgo = Math.floor(Math.random() * 300);
      const date = new Date(now);
      date.setDate(date.getDate() - daysAgo);

      const hours = [1, 1.5, 2, 2.5, 3, 4, 5, 6][Math.floor(Math.random() * 8)];
      const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      const desc = descriptions[Math.floor(Math.random() * descriptions.length)];

      // Most activities approved, some pending/rejected
      const rand = Math.random();
      const status = rand < 0.7 ? "APPROVED" : rand < 0.85 ? "PENDING" : rand < 0.95 ? "REVISION_REQUESTED" : "REJECTED";

      if (status === "APPROVED") totalApprovedHours += hours;

      await prisma.activity.create({
        data: {
          studentId: students[i].id,
          date,
          type,
          hours,
          description: desc,
          status,
          reviewNote: status === "REJECTED" ? "Belge eksik, lütfen tekrar gönderiniz." :
                      status === "REVISION_REQUESTED" ? "Tarih bilgisi hatalı görünüyor." : null,
          reviewedAt: status !== "PENDING" ? new Date() : null,
          reviewedBy: status !== "PENDING" ? "system" : null,
        },
      });
    }

    // Calculate badge
    let badge = "NONE";
    if (totalApprovedHours >= 200) badge = "PLATINUM";
    else if (totalApprovedHours >= 100) badge = "GOLD";
    else if (totalApprovedHours >= 50) badge = "SILVER";
    else if (totalApprovedHours >= 25) badge = "BRONZE";

    await prisma.student.update({
      where: { id: students[i].id },
      data: { totalHours: totalApprovedHours, badgeLevel: badge },
    });
  }

  console.log("Seed completed!");
  console.log("");
  console.log("Demo hesapları:");
  console.log("  Admin:    admin@losev.org / 123456");
  console.log("  Öğretmen: ayse@losev.org / 123456");
  console.log("  Öğrenci:  ali@ogrenci.com / 123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
