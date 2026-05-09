import { User, UserRole } from "../types";

export const users: User[] = [
  {
    id: "user-1",
    username: "admin",
    fullName: "Makhumbo Chikaonda",
    email: "makhumbo@cps.mw",
    role: UserRole.ADMIN,
    department: "Management",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "user-2",
    username: "capturer1",
    fullName: "Chisomo Banda",
    email: "chisomo@cps.mw",
    role: UserRole.CAPTURER,
    department: "Operations",
    isActive: true,
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "user-3",
    username: "authorizer1",
    fullName: "Lawrence Kachuma",
    email: "lawrence@cps.mw",
    role: UserRole.AUTHORIZER,
    department: "Compliance",
    isActive: true,
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "user-4",
    username: "capturer2",
    fullName: "Thandiwe Phiri",
    email: "thandiwe@cps.mw",
    role: UserRole.CAPTURER,
    department: "Operations",
    isActive: true,
    createdAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "user-5",
    username: "readonly",
    fullName: "Mphatso Mwale",
    email: "mphatso@cps.mw",
    role: UserRole.READ_ONLY,
    department: "Audit",
    isActive: true,
    createdAt: "2024-02-15T00:00:00Z",
  },
];

// Default user for demo (can be changed via login)
export const currentUser: User = users[0]; // Admin by default
