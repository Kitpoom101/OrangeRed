import ShopUI from "@/component/Shop/ShopUI";
import MassageServiceList from "@/component/Shop/MassageServiceList";
import getSingleShops from "@/libs/shops/getSingleShop";
import getAllReservations from "@/libs/reservation/getAllReservation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import DeleteButton from "@/component/ui/DeleteButton";
import { authOptions } from "@/libs/auth/authOption";
import { ShopItem } from "@/interface";
import EditButton from "@/component/ui/EditButton";
import UserComments from "@/component/Shop/UserComments";
import ChatRoom from "@/component/Chat/ChatRoom";

export default async function ShopDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const shopDetail = await getSingleShops(id);
  const shop: ShopItem = shopDetail.data;
  const shopId = shop.id || shop._id; 

  const session = await getServerSession(authOptions);

  let reservationCount = 0;
  let validReservationId = "";
  let canCreateRating = false;
  let createDisabledMessage = "";

  if (session && session.user.role === "user") {
    try {
      const reservations = await getAllReservations(session.user.token);
      
      const resData = reservations.data || [];
      reservationCount = reservations.count || resData.length || 0;
      const now = new Date();

      const shopReservations = resData.filter((res: any) => 
        (res.shop?._id || res.shop) === shopId
      );

      const completedReservation = shopReservations
        .filter((res: any) => new Date(res.appDate) <= now)
        .sort(
          (a: any, b: any) =>
            new Date(b.appDate).getTime() - new Date(a.appDate).getTime()
        )[0];

      if (completedReservation) {
        validReservationId = completedReservation._id;
        canCreateRating = true;
      } else if (shopReservations.length > 0) {
        createDisabledMessage = "You can review after your appointment time has passed.";
      } else {
        createDisabledMessage = "Please try the service first before leaving a review.";
      }
    } catch (error) {
      console.error("Error fetching quota:", error);
      createDisabledMessage = "We could not verify your reservations right now.";
    }
  } else if (session?.user.role === "admin") {
    canCreateRating = true;
  }

  const userToken = session?.user?.token || "";

  return (
    <div className="min-h-screen bg-background text-text-main pb-24 px-8 pt-6 transition-colors duration-300">
      <Link
        href="/shop"
        className="group inline-flex items-center text-[11px] uppercase tracking-[0.2em] text-text-sub hover:text-accent transition-all duration-300"
      >
        <span className="mr-2 transition-transform duration-300 group-hover:-translate-x-1">←</span>
        <span>Browse More Shops</span>
      </Link>

      <div className="min-h-screen flex flex-col items-center py-16 px-4">
        <div className="max-w-5xl w-full bg-card rounded-2xl overflow-hidden border border-card-border shadow-2xl">
          <ShopUI 
            shop={shop} 
            session={session} 
            reservationCount={reservationCount} 
          />
        </div>

        <div className="max-w-5xl w-full mt-16">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-serif tracking-[0.2em] uppercase text-text-main">
              Service Menu
            </h2>
            <div className="h-[1px] w-12 bg-accent/50 mx-auto mt-4" />
          </div>
          
          <MassageServiceList services={shop.massageType} />
          
          <UserComments
            shopId={shopId}
            token={userToken}
            reservationId={validReservationId}
            userId={session?.user?._id}
            isAdmin={session?.user?.role === "admin"}
            canCreateRating={canCreateRating}
            createDisabledMessage={createDisabledMessage}
          />

          <div className="mt-16">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-serif tracking-[0.2em] uppercase text-gray-100">
                Chat
              </h2>
              <div className="h-[1px] w-12 bg-blue-500/50 mx-auto mt-4" />
            </div>
            <div className="h-[600px] rounded-2xl overflow-hidden border border-gray-700/50">
              <ChatRoom
                shopId={shopId}
                shopName={shop.name}
                userId={session?.user?._id}
                isAdmin={session?.user?.role === 'admin'}
              />
            </div>
          </div>
        </div>
      </div>

      {session?.user.role === "admin" && 
      <div className="flex gap-4 justify-center mt-8">
        <DeleteButton shopId={shopId}/> 
        <EditButton shopId={shopId}/>
      </div>
      }
    </div>
  );
}
