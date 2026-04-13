"use client";
import { useState, useEffect } from "react";
import { DatePicker, TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Dialog } from "@mui/material";
import { ShopItem } from "@/interface";

export default function EditReservationModal({
  isOpen,
  onClose,
  onConfirm,
  initialDate,
  shop,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newDateTime: string) => void;
  initialDate: string;
  shop?: ShopItem;
}) {
  const [newDate, setNewDate] = useState<Dayjs | null>(null);
  const [newTime, setNewTime] = useState<Dayjs | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && initialDate) {
      const d = dayjs(initialDate);
      setNewDate(d.isValid() ? d : dayjs());
      setNewTime(d.isValid() ? d : dayjs());
      setError(null);
    }
  }, [isOpen, initialDate]);

  if (!isOpen) return null;

  const shopOpen = shop?.openClose?.open || "09:00";
  const shopClose = shop?.openClose?.close || "20:00";

  const getShopLimit = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const baseDate = newDate || dayjs();
    return baseDate.hour(hours).minute(minutes).second(0).millisecond(0);
  };

  const handleTimeChange = (newValue: Dayjs | null) => {
    setError(null);
    if (!newValue) {
      setNewTime(null);
      return;
    }

    const openLimit = getShopLimit(shopOpen);
    const closeLimit = getShopLimit(shopClose);

    if (newValue.isAfter(closeLimit)) {
      setNewTime(closeLimit);
      setError(`Closing hour is ${shopClose}`);
    } else if (newValue.isBefore(openLimit)) {
      setNewTime(openLimit);
      setError(`Opening hour is ${shopOpen}`);
    } else {
      setNewTime(newValue);
    }
  };

  const handleSave = () => {
    setError(null);
    if (!newDate || !newTime) {
      setError("Selection incomplete.");
      return;
    }

    const combined = newDate.hour(newTime.hour()).minute(newTime.minute()).second(0).millisecond(0);

    if (combined.isBefore(dayjs(), "minute")) {
      setError("Cannot traverse to the past.");
      return;
    }

    const openLimit = getShopLimit(shopOpen);
    const closeLimit = getShopLimit(shopClose);

    if (combined.isBefore(openLimit) || combined.isAfter(closeLimit)) {
      setError(`Hours: ${shopOpen} - ${shopClose}`);
      return; 
    }

    onConfirm(combined.toISOString());
  };

  // ปรับจูน MUI Styles ให้เข้ากับ accent Theme
  const fieldStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.03)", 
    borderRadius: "1rem",
    border: "1px solid rgba(212, 175, 55, 0.1)", // accent border low opacity
    "& .MuiInputBase-input": {
      color: "var(--text-main)",
      fontSize: "0.8rem",
      letterSpacing: "0.1em",
      fontFamily: "var(--font-mono), monospace",
    },
    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
    "&.Mui-focused": { border: "1px solid var(--accent)" },
    "& .MuiSvgIcon-root": { color: "var(--accent)" },
  };

  const pickerStyle = {
    "& .MuiPaper-root": { bgcolor: "#0f172a", border: "1px solid rgba(212, 175, 55, 0.2)" },
    "& .MuiPickersDay-root.Mui-selected": { backgroundColor: "var(--accent) !important" },
    "& .MuiClockPointer-root, & .MuiClock-pin": { backgroundColor: "var(--accent)" },
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      PaperProps={{ sx: { bgcolor: "transparent", boxShadow: "none" } }}
      transitionDuration={500}
    >
      <div className="relative bg-background border border-accent/20 rounded-[2rem] w-[400px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        
        {/* Header: Midnight accent Gradient */}
        <div className="h-28 bg-gradient-to-br from-accent/10 via-transparent to-transparent flex items-end p-8 border-b border-card-border/50">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
               <span className="h-1 w-1 bg-accent rounded-full animate-pulse" />
               <p className="text-[10px] uppercase tracking-[0.5em] text-accent font-bold">Registry Update</p>
            </div>
            <h3 className="text-2xl font-serif text-text-main italic tracking-tight">Reschedule Stay</h3>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="space-y-6">
              {/* Date Selection */}
              <div className="space-y-3">
                <label className="text-[9px] text-text-sub uppercase tracking-[0.3em] ml-1">New Date</label>
                <DatePicker
                  value={newDate}
                  disablePast
                  onChange={(v) => { setNewDate(v); setError(null); }}
                  slotProps={{ 
                    textField: { fullWidth: true, size: "small", sx: fieldStyle },
                    popper: { sx: pickerStyle }
                  }}
                />
              </div>

              {/* Time Selection */}
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[9px] text-text-sub uppercase tracking-[0.3em]">Arrival Time</label>
                  <span className="text-[9px] text-accent/60 font-mono italic">{shopOpen} — {shopClose}</span>
                </div>
                <TimePicker
                  value={newTime}
                  ampm={false}
                  onChange={handleTimeChange}
                  slotProps={{ 
                    textField: { fullWidth: true, size: "small", sx: fieldStyle },
                    popper: { sx: pickerStyle }
                  }}
                />
              </div>
            </div>
          </LocalizationProvider>

          {/* Action Area */}
          <div className="pt-4 flex flex-col gap-4">
            {error && (
              <div className="bg-red-500/5 border border-red-500/20 px-4 py-2 rounded-xl animate-in fade-in zoom-in duration-300">
                <p className="text-red-400 text-[9px] uppercase tracking-widest font-bold flex items-center gap-2 text-center justify-center">
                  <span>⚠</span> {error}
                </p>
              </div>
            )}

            <button
              onClick={handleSave}
              className="w-full py-4 bg-accent text-background text-[10px] uppercase tracking-[0.4em] font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-accent/10 active:scale-[0.98]"
            >
              Confirm Changes
            </button>
            <button 
              onClick={onClose} 
              className="text-[9px] text-text-sub uppercase tracking-[0.3em] hover:text-text-main transition-colors py-2"
            >
              Keep Existing Time
            </button>
          </div>
        </div>

        {/* Decorative corner element */}
        <div className="absolute top-0 right-0 p-4 opacity-20">
            <div className="text-accent text-xs">✦</div>
        </div>
      </div>
    </Dialog>
  );
}