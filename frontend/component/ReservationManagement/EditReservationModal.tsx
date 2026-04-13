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
      setError(`Closed: Adjusted to ${shopClose}`);
    } else if (newValue.isBefore(openLimit)) {
      setNewTime(openLimit);
      setError(`Not open: Adjusted to ${shopOpen}`);
    } else {
      setNewTime(newValue);
    }
  };

  const handleSave = () => {
    setError(null);

    if (!newDate || !newTime) {
      setError("Please select both date and time.");
      return;
    }

    const combined = newDate
      .hour(newTime.hour())
      .minute(newTime.minute())
      .second(0)
      .millisecond(0);

    if (combined.isBefore(dayjs(), "minute")) {
      setError("Cannot schedule in the past.");
      return;
    }

    const openLimit = getShopLimit(shopOpen);
    const closeLimit = getShopLimit(shopClose);

    if (combined.isBefore(openLimit) || combined.isAfter(closeLimit)) {
      setError(`Invalid Time: Must be between ${shopOpen} - ${shopClose}`);
      setNewTime(combined.isBefore(openLimit) ? openLimit : closeLimit);
      return; 
    }

    onConfirm(combined.toISOString());
  };

  const fieldStyle = {
    backgroundColor: "rgba(189, 202, 232, 0.2)", 
    borderRadius: "0.5rem",
    "& .MuiInputBase-input": {
      color: "#e5e7eb",
      fontSize: "0.75rem",
      fontFamily: "monospace",
    },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(59, 130, 246, 0.2)" },
    "& .MuiSvgIcon-root": { color: "#60a5fa" },
  };

  return (
    <Dialog open={isOpen} onClose={onClose} PaperProps={{ sx: { bgcolor: "transparent", boxShadow: "none" } }}>
      <div className="relative bg-[#0f172a] border border-blue-500/20 rounded-2xl w-[380px] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="h-20 bg-gradient-to-br from-blue-900/40 to-[#0f172a] flex items-end p-6 border-b border-card-border">
          <div className="relative z-10">
            <p className="text-[9px] uppercase tracking-[0.4em] text-blue-400 font-bold mb-1">System Override</p>
            <h3 className="text-lg font-serif text-text-main uppercase tracking-widest">Reschedule</h3>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="text-[8px] text-gray-500 uppercase tracking-[0.3em]">Date</p>
                <DatePicker
                  value={newDate}
                  disablePast
                  onChange={(v) => { setNewDate(v); setError(null); }}
                  slotProps={{ textField: { fullWidth: true, size: "small", sx: fieldStyle } }}
                />
              </div>

              <div className="space-y-2">
                <p className="text-[8px] text-gray-500 uppercase tracking-[0.3em]">Hours: {shopOpen} — {shopClose}</p>
                <TimePicker
                  value={newTime}
                  ampm={false}
                  onChange={handleTimeChange}
                  slotProps={{ textField: { fullWidth: true, size: "small", sx: fieldStyle } }}
                />
              </div>
            </div>
          </LocalizationProvider>

          <div className="pt-2 flex flex-col gap-3">
            {error && (
              <div className="bg-red-500/10 border-l-2 border-red-500 px-3 py-2 animate-pulse">
                <p className="text-red-400 text-[10px] uppercase tracking-wider font-bold">Error: {error}</p>
              </div>
            )}

            <button
              onClick={handleSave}
              className="w-full py-3.5 bg-blue-600/10 border border-blue-500/40 text-blue-400 text-[10px] uppercase tracking-[0.4em] font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-all"
            >
              Update Schedule
            </button>
            <button onClick={onClose} className="text-[9px] text-gray-600 uppercase tracking-[0.3em] hover:text-text-sub transition-colors">
              Discard Changes
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}