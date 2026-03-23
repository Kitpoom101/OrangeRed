"use client";
import createReservations from "@/libs/reservation/createReservation";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { useSession } from "next-auth/react";
import { useState } from "react";
import FormComponent from "./FormComponent";
import SuccessModal from "../ReservationManagement/ReservationSuccess";

export default function ReservationForm({ shop }: { shop: ShopItem }) {
  const { data: session } = useSession();
  const [time, setTime] = useState<Dayjs | null>(null);
  const [date, setDate] = useState<Dayjs | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    handleCreateReservation();
  }

  async function handleCreateReservation() {
    if (!session || !date || !time) return;
    const token = session?.user.token;
    const combinedDateTime = date
      ?.hour(time?.hour() || 0)
      .minute(time?.minute() || 0)
      .toISOString();

    try {
      const res = await createReservations(
        token,
        session?.user.name,
        combinedDateTime,
        shop._id,
      );
      setIsModalOpen(true); 
    } catch (err) {
      console.log("Cannot create reservation");
    }
  }

  return(
    <>
    <FormComponent handleSubmit={handleSubmit}>
      <div className="flex gap-3">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker className="bg-white w-42 rounded-xl" 
            value={date}
            onChange={(newValue) => setDate(newValue)}
            slotProps={{
              textField: {
                size: "small",
                sx: {
                  "& .MuiInputBase-root": {
                    height: 36,
                  },
                }},
            }}/>
          <TimePicker className="bg-white w-42 rounded-xl"
            value={time}
            onChange={(newValue) => setTime(newValue)}
            slotProps={{
              textField: {
                size: "small",
                sx: {
                  "& .MuiInputBase-root": {
                    height: 36,
                  },
                },
              },
            }}/>
        </LocalizationProvider>
      </div>
      <button  className="bg-blue-500 hover:bg-indigo-500 transition-all rounded-2xl duration-100 w-36 h-10 text-white">submit</button>
    </FormComponent>
    <SuccessModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      shopName={shop.name}
    />
    </>
  )
}