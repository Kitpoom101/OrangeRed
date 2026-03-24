"use client";
import createReservations from "@/libs/reservation/createReservation";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
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
  const [massagePrice, setMassagePrice] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTreatmentChange = (typeName: string) => {
    setMassageType(typeName);
    const selectedTreatment = shop.massageType.find((t) => t.name === typeName);
    if (selectedTreatment) {
      setMassagePrice(selectedTreatment.price);
    }
  };

  const getShopTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const baseDate = date || dayjs();
    return baseDate.hour(hours).minute(minutes).second(0).millisecond(0);
  };

  const pickerStyle = {
    "& .MuiPickersDay-root": { color: "#d1d5db" },
    "& .MuiPickersDay-root.Mui-selected": { backgroundColor: "#3b82f6 !important" },
    "& .MuiClock-pin, & .MuiClockPointer-root": { backgroundColor: "#3b82f6" },
    "& .MuiClockPointer-thumb": { borderColor: "#3b82f6" },
    "& .MuiMultiSectionDigitalClockSection-item.Mui-selected": {
      backgroundColor: "#3b82f6 !important",
      color: "#fff",
    },
    "& .MuiPaper-root": { bgcolor: "#1e2d3d", color: "#e5e7eb" }
  };

  const fieldStyle = {
    backgroundColor: "rgba(30, 45, 61, 0.4)",
    borderRadius: "0.75rem",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(55, 65, 81, 0.3)" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(59, 130, 246, 0.5)" },
    "& .MuiInputBase-input": {
      color: "#ffffff !important",
      WebkitTextFillColor: "#ffffff !important",
      fontSize: "0.75rem",
      textTransform: "uppercase",
      letterSpacing: "0.15em",
    },
    "& input::placeholder": {
      color: "#9ca3af !important", 
      opacity: "1 !important",
      WebkitTextFillColor: "#9ca3af !important",
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

    try {
      await createReservations(
        session?.user.token,
        session?.user.name,
        selectedDateTime.toISOString(),
        shop._id,
        massageType,
        massagePrice || 0,
      );
      setIsModalOpen(true);
    } catch (err) {
      console.error("Reservation Error:", err);
    }
  }

  return (
    <>
      <FormComponent handleSubmit={(e) => { e.preventDefault(); handleCreateReservation(); }}>
        <div className="flex flex-col gap-5">
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-blue-400 font-bold">Select Treatment</p>
            <FormControl fullWidth size="small">
              <Select
                value={massageType}
                onChange={(e) => handleTreatmentChange(e.target.value)}
                displayEmpty
                sx={fieldStyle}
                MenuProps={{ PaperProps: { sx: { bgcolor: "#1e2d3d", color: "#d1d5db" } } }}
              >
                <MenuItem value="" disabled>
                  <span className="text-gray-400 lowercase italic opacity-80">Choose a service...</span>
                </MenuItem>
                {shop.massageType.map((type) => (
                  <MenuItem key={type._id} value={type.name} sx={{ fontSize: "0.75rem" }}>
                    <div className="flex justify-between w-full uppercase">
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
                  value={date}
                  disablePast
                  onChange={(newValue) => setDate(newValue)}
                  slotProps={{
                    textField: { size: "small", sx: fieldStyle, placeholder: "DATE" },
                    popper: { sx: pickerStyle }
                  }}
                />
                <TimePicker
                  value={time}
                  ampm={false}
                  onChange={(newValue) => setTime(newValue)}
                  minTime={getShopTime(shop.openClose.open)}
                  maxTime={getShopTime(shop.openClose.close)}
                  slotProps={{
                    textField: { size: "small", sx: fieldStyle, placeholder: "TIME" },
                    popper: { sx: pickerStyle }
                  }}
                />
              </LocalizationProvider>
            </div>
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