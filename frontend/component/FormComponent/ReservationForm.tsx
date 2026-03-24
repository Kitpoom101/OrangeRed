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
import { ShopItem } from "@/interface";
import SubmitButton from "../ui/SubmitButton";
import { FormControl, Select, MenuItem } from "@mui/material";


export default function ReservationForm({ shop }: { shop: ShopItem }) {
  const { data: session } = useSession();
  const [time, setTime] = useState<Dayjs | null>(null);
  const [date, setDate] = useState<Dayjs | null>(null);
  const [massageType, setMassageType] = useState<string>(""); // New State
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function handleCreateReservation() {
    if (!session || !date || !time || !massageType) return; // Validate massageType
    
    const token = session?.user.token;
    const combinedDateTime = date
      ?.hour(time?.hour() || 0)
      .minute(time?.minute() || 0)
      .toISOString();

    try {
      await createReservations(
        token,
        session?.user.name,
        combinedDateTime,
        shop._id,
        massageType // Pass the state here
      );
      setIsModalOpen(true); 
    } catch (err) {
      console.log("Cannot create reservation");
    }
  }

  return (
    <>
      <FormComponent handleSubmit={(e) => { e.preventDefault(); handleCreateReservation(); }}>
        <div className="flex flex-col gap-4"> {/* Changed to col for better spacing */}
          
          <FormControl fullWidth size="small">
            <Select
              value={massageType}
              onChange={(e) => setMassageType(e.target.value)}
              displayEmpty
              className="bg-white rounded-xl h-[36px]"
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value="" disabled>Select Massage Type</MenuItem>
              {shop.massageType.map((type) => (
                <MenuItem key={type._id} value={type.name}>
                  {type.name} - ${type.price}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className="flex gap-3">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker 
                className="bg-white w-full rounded-xl" 
                value={date}
                onChange={(newValue) => setDate(newValue)}
                slotProps={{ textField: { size: "small" }}}
              />
              <TimePicker 
                className="bg-white w-full rounded-xl"
                value={time}
                onChange={(newValue) => setTime(newValue)}
                slotProps={{ textField: { size: "small" }}}
              />
            </LocalizationProvider>
          </div>
        </div>
        <SubmitButton />
      </FormComponent>
    <SuccessModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      shopName={shop.name}
    />
    </>
  )
}