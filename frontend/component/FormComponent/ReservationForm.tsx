"use client";
import createReservations from "@/libs/reservation/createReservation";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs"; // Import dayjs directly
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
  const [massageType, setMassageType] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getShopTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return (date || dayjs()).hour(hours).minute(minutes).second(0);
  };

  const fieldStyle = {
    backgroundColor: "rgba(30, 45, 61, 0.4)",
    borderRadius: "0.75rem",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(55, 65, 81, 0.3)" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(59, 130, 246, 0.3)" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(59, 130, 246, 0.5)" },
    "& .MuiInputBase-input": {
      fontSize: "0.75rem",
      textTransform: "uppercase",
      letterSpacing: "0.15em",
      "&::placeholder": { color: "#9ca3af", opacity: 1 },
    },
    "& .MuiSvgIcon-root": { color: "#60a5fa" },
  };

  const timeStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: "0.75rem",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(55, 65, 81, 0.3)" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(59, 130, 246, 0.3)" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(59, 130, 246, 0.5)" },
    "& .MuiInputBase-input": {
      fontSize: "0.75rem",
      textTransform: "uppercase",
      letterSpacing: "0.15em",
      "&::placeholder": { color: "#9ca3af", opacity: 1 },
    },
    "& .MuiSvgIcon-root": { color: "#60a5fa" },
  };

  async function handleCreateReservation() {
    if (!session || !date || !time || !massageType) return;
    
    const openTime = date
      .hour(dayjs(shop.openClose.open, "HH:mm").hour())
      .minute(dayjs(shop.openClose.open, "HH:mm").minute());

    const closeTime = date
      .hour(dayjs(shop.openClose.close, "HH:mm").hour())
      .minute(dayjs(shop.openClose.close, "HH:mm").minute());

    const selectedDateTime = date
      .hour(time.hour())
      .minute(time.minute());

    // // Final validation check before submitting
    // const openTime = getShopTime(shop.openClose.open);
    // const closeTime = getShopTime(shop.openClose.close);
    
    if (selectedDateTime.isBefore(openTime) || selectedDateTime.isAfter(closeTime)) {
      alert(`Please select a time between ${shop.openClose.open} and ${shop.openClose.close}`);
      return;
    }

    const token = session?.user.token;
    const combinedDateTime = date
      .hour(time.hour())
      .minute(time.minute())
      .toISOString();

    try {
      await createReservations(token, session?.user.name, combinedDateTime, shop._id, massageType);
      setIsModalOpen(true);
    } catch (err) {
      console.log("Cannot create reservation");
    }
  }

  return (
    <>
      <FormComponent handleSubmit={(e) => { e.preventDefault(); handleCreateReservation(); }}>
        <div className="flex flex-col gap-5">
          {/* Treatment Selection */}
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-blue-400 font-bold">Select Treatment</p>
            <FormControl fullWidth size="small">
              <Select
                value={massageType}
                onChange={(e) => setMassageType(e.target.value)}
                displayEmpty
                sx={fieldStyle}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: "#1e2d3d",
                      color: "#d1d5db",
                      border: "1px solid rgba(55, 65, 81, 0.5)",
                      "& .MuiMenuItem-root:hover": { bgcolor: "rgba(59, 130, 246, 0.1)" },
                    },
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <span className="text-gray-400 lowercase italic opacity-80">Choose a service...</span>
                </MenuItem>
                {shop.massageType.map((type) => (
                  <MenuItem key={type._id} value={type.name} sx={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <div className="flex justify-between w-full">
                      <span>{type.name}</span>
                      <span className="text-blue-400">${type.price}</span>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-blue-400 font-bold">Schedule Appointment</p>
            <div className="grid grid-cols-2 gap-3">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={null}
                  value={date}
                  disablePast 
                  onChange={(newValue) => setDate(newValue)}
                  slotProps={{
                    textField: { size: "small", sx: timeStyle },
                  }}
                />
                <TimePicker
                  value={time}
                  onChange={(newValue) => setTime(newValue)}
                  minTime={getShopTime(shop.openClose.open)}
                  maxTime={getShopTime(shop.openClose.close)} 
                  slotProps={{
                    textField: { size: "small", sx: timeStyle },
                  }}
                />
              </LocalizationProvider>
            </div>
            <p className="text-[8px] text-gray-500 uppercase tracking-widest px-1">
              Store Hours: {shop.openClose.open} - {shop.openClose.close}
            </p>
          </div>

          <div className="pt-2">
            <SubmitButton />
          </div>
        </div>
      </FormComponent>

      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        shopName={shop.name}
      />
    </>
  );
}