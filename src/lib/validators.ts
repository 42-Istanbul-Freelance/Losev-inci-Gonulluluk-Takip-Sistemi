import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Ad soyad en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
  role: z.enum(["STUDENT", "TEACHER"]),
  phone: z.string().optional(),
  schoolId: z.string().min(1, "Okul seçimi zorunlu"),
  grade: z.string().optional(),
});

export const activitySchema = z.object({
  date: z.string().min(1, "Tarih zorunlu"),
  type: z.string().min(1, "Etkinlik türü zorunlu"),
  hours: z.number().min(0.5, "En az 0.5 saat").max(24, "En fazla 24 saat"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalı"),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Ad soyad en az 2 karakter olmalı"),
  phone: z.string().optional(),
  grade: z.string().optional(),
  targetHours: z.number().min(10).max(500).optional(),
});

export const reviewSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "REVISION_REQUESTED"]),
  reviewNote: z.string().optional(),
});
