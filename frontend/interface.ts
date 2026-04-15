import { Document } from "mongoose";

export interface IUser extends Document {
  _id: any;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "inactive";
  tel: string;
  profilePicture?: string;
  password?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
}

export interface MassageType {
  name: string;
  description: string;
  price: number;
  picture?: string;
  _id?: string;
}

export interface ShopItem {
  _id: string;
  id?: string;
  name: string;

  shopDescription: string;

  address: {
    street: string;
    district: string;
    province: string;
    postalcode: string;
  };

  tel: string;

  openClose: {
    open: string;
    close: string;
  };

  massageType: MassageType[];

  picture: string;
  __v?: number;

  reservations?:[];

  averageRating?: number;
  ratingCount?: number;
}

export interface RatingItem {
  _id: string;
  user: { _id: string; name: string };
  shop: { _id: string; name: string };
  reservation: string;
  score: number;
  review?: string;
  createdAt: string;
}
  
export interface ShopJson {
  success: boolean,
  count: number,
  pagination: PaginationMeta,
  data: ShopItem[]
}

export interface Reservations{
  success: boolean
  count: number
  pagination: PaginationMeta
  data: ReservationItem[]
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  next?: {
    page: number;
    limit: number;
  };
  prev?: {
    page: number;
    limit: number;
  };
}

interface UserReserve {
  _id: string;
  name: string;
  email: string;
  tel: string;
  status?: "active" | "inactive";
}

interface ShopReserve {
  _id: string;
  name: string;
  tel: string;
  id: string;
}

export interface ReservationItem {
  _id: string;
  appDate: string;       
  user: {
    _id: string;
    name: string;
    email: string;
    tel: string;
    status?: "active" | "inactive";
  };
  shop: ShopItem; 
  createdAt: string;     
  massageType: string;
  massagePrice: number;
  __v: number
}
