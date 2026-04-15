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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationError, setValidationError] = useState<string>("");

  const handleTreatmentChange = (typeName: string) => {
    setMassageType(typeName);
    setValidationError("");
  };

  const getShopTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const baseDate = date || dayjs();
    return baseDate.hour(hours).minute(minutes).second(0).millisecond(0);
  };

  const pickerStyle = {
    "& .MuiPaper-root": { bgcolor: "#0f172a", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.1)" },
    "& .MuiPickersDay-root": { color: "#bbcadf", fontSize: "0.75rem" },
    "& .MuiPickersDay-root.Mui-selected": { backgroundColor: "accent !important" },
    "& .MuiClock-pin, & .MuiClockPointer-root": { backgroundColor: "accent" },
    "& .MuiClockPointer-thumb": { borderColor: "accent" },
    "& .MuiMultiSectionDigitalClockSection-item.Mui-selected": {
      backgroundColor: "accent !important",
      color: "#fff",
    },
  };

  const fieldStyle = {
    backgroundColor: "rgba(237, 237, 237, 0.4)",
    borderRadius: "1rem",
    color: "#f8fafc",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.1)" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "accent" },
    "& .MuiInputBase-input": {
      fontSize: "0.7rem",
      textTransform: "uppercase",
      letterSpacing: "0.2em",
      padding: "12px 16px",
    },
    "& .MuiSvgIcon-root": { color: "accent" },
  };

  async function handleCreateReservation() {
    setValidationError("");
    if (!massageType || !date || !time) {
      setValidationError("Kindly complete all fields to proceed.");
      return;
    }
    if (!session) return;
    
    const selectedTreatment = shop.massageType.find((t) => t.name === massageType);
    const price = selectedTreatment?.price;

    const openTime = date
      .hour(dayjs(shop.openClose.open, "HH:mm").hour())
      .minute(dayjs(shop.openClose.open, "HH:mm").minute());

    const closeTime = date
      .hour(dayjs(shop.openClose.close, "HH:mm").hour())
      .minute(dayjs(shop.openClose.close, "HH:mm").minute());

    const selectedDateTime = date.hour(time.hour()).minute(time.minute());
    
    if (selectedDateTime.isBefore(openTime) || selectedDateTime.isAfter(closeTime)) {
      setValidationError(`Operational hours: ${shop.openClose.open} - ${shop.openClose.close}`);
      return;
    }

    try {
      await createReservations(
        session?.user.token,
        session?.user.name,
        selectedDateTime.toISOString(),
        shop._id,
        massageType,
        price!,
      );
      setIsModalOpen(true);
    } catch (err: any) {
      setValidationError(err.message || "A disturbance in the connection. Please try again.");
    }
  }

  return (
    <>
      <FormComponent handleSubmit={(e) => { e.preventDefault(); handleCreateReservation(); }}>
        <div className="flex flex-col gap-8 w-full">
          {/* Service Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-px w-4 bg-accent/40" />
              <p className="text-[9px] uppercase tracking-[0.4em] text-accent font-bold">Select Service</p>
            </div>
            <FormControl fullWidth size="small">
              <Select
                value={massageType}
                onChange={(e) => handleTreatmentChange(e.target.value)}
                displayEmpty
                sx={fieldStyle}
                MenuProps={{ PaperProps: { sx: { bgcolor: "#0f172a", backgroundImage: "none", border: "1px solid rgba(255,255,255,0.1)" } } }}
              >
                <MenuItem value="" disabled>
                  <span className="text-text-sub text-[10px] uppercase tracking-widest opacity-50">Select your treatment</span>
                </MenuItem>
                {shop.massageType.map((type) => (
                  <MenuItem key={type._id} value={type.name} sx={{ py: 1.5, "&:hover": { bgcolor: "rgba(197, 163, 87, 0.1)" } }}>
                    <div className="flex justify-between w-full text-[10px] uppercase tracking-[0.15em] font-medium">
                      <span className="text-text-main">{type.name}</span>
                      <span className="text-accent">฿{type.price}</span>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-px w-4 bg-accent/40" />
              <p className="text-[9px] uppercase tracking-[0.4em] text-accent font-bold">Inscribe Time</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={date}
                  disablePast
                  onChange={(newValue) => { setDate(newValue); setValidationError(""); }}
                  slotProps={{
                    textField: { size: "small", sx: fieldStyle, placeholder: "DATE" },
                    popper: { sx: pickerStyle }
                  }}
                />
                <TimePicker
                  value={time}
                  ampm={false}
                  onChange={(newValue) => { setTime(newValue); setValidationError(""); }}
                  slotProps={{
                    textField: { size: "small", sx: fieldStyle, placeholder: "TIME" },
                    popper: { sx: pickerStyle }
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>

          {/* Footer & Actions */}
          <div className="pt-4 space-y-4">
            {validationError && (
              <div className="bg-red-500/5 py-2 px-3 rounded-lg border border-red-500/10 animate-in fade-in duration-300">
                <p className="text-red-400 text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                  <span>✧</span> {validationError}
                </p>
              </div>
            )}
            <div className="group relative">
               <SubmitButton />
            </div>
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
