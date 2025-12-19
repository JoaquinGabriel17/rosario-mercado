export interface User {
  _id: string;
  name: string;
  email: string;
  whatsappAvailable?: boolean;
  delivery?: boolean;
  isSeller?: boolean;
  createdAt?: string;
  updatedAt?: string;
  businessHours?: string;
  phoneNumber?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  [key: string]: any;
}
