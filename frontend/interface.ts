interface ShopItem {
  _id: string;
  id?: string;
  name: string;

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
    picture: string;
  __v?: number;
}
  
interface ShopJson {
  success: boolean,
  count: number,
  pagination: Object,
  data: ShopItem[]
}

interface Reservations{
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

interface ReservationItem {
  _id: string;
  appDate: string;       
  user: UserReserve;
  shop: ShopReserve;
  createdAt: string;     
  __v: number;
}