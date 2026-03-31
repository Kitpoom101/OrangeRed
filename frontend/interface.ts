import { Document } from "mongoose";

export interface IUser extends Document {
  _id: any;
  name: string;
  email: string;
  role: "user" | "admin";
  tel: string;
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
  pagination: Object,
  data: ShopItem[]
}

export interface Reservations{
  success: boolean
  count: number
  data: ReservationItem[]
}

interface UserReserve {
  _id: string;
  name: string;
  email: string;
  tel: string;
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
  };
  shop: ShopItem; 
  createdAt: string;     
  massageType: string;
  massagePrice: number;
  __v: number
}