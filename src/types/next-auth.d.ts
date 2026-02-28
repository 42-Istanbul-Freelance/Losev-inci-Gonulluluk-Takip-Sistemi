import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "STUDENT" | "TEACHER" | "ADMIN";
      studentId?: string;
      teacherId?: string;
      schoolId?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "STUDENT" | "TEACHER" | "ADMIN";
    studentId?: string;
    teacherId?: string;
    schoolId?: string;
  }
}
