export interface User {
  id: string;
  fullName: string;
  email: string;
  department: string;
  phone: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  department: string;
  type: string;
  size: number;
}