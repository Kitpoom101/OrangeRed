import getSingleShops from "@/libs/shops/getSingleShop";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

export default async function ShopDetailPage({ params }: { params: Promise<{ id: string }> }){
  const {id} = await params;
  const shopDetail = await getSingleShops(id);
  const shop: ShopItem = shopDetail.data;
  return(
    <div className="flex justify-center py-10">
      <div className="bg-cyan-300/20 w-1/2 flex flex-col items-center">
        <p className="text-2xl">Make a Reservation</p>
        <div className="">
          <p>{shop.name}</p>
          <p>OPEN : {shop.openClose.open} CLOSE : {shop.openClose.close}</p>
          <p>ADDRESS: {shop.address.street} {shop.address.district} {shop.address.province} {shop.address.postalcode}</p>
          <p>TEL : {shop.tel}</p>
        </div>
        
      </div>
      
    </div>
  )
}