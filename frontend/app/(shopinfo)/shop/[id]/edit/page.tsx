import EditShopForm from "@/component/FormComponent/EditShopForm"
import getSingleShops from "@/libs/shops/getSingleShop";

export default async function EditShopPage({params}:{params: Promise<{ id: string }>;}){
  const { id } = await params;
  const shopDetail = await getSingleShops(id);
  
  return(
    <div>
      <EditShopForm shop={shopDetail.data}/>
    </div>
  )
}