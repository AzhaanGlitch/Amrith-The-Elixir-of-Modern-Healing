import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Badge, Button } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { timeSlots } from '../../data/mockData';
import { ChevronLeft, ChevronRight, Plus, Clock, Check, X } from 'lucide-react';

export default function DoctorSchedulePage() {
  const { addToast } = useToast();
  const [weekOffset, setWeekOffset] = useState(0);

  const getWeekDays = (offset) => {
    const days = [];
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1 + offset * 7);
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const weekDays = getWeekDays(weekOffset);
  const today = new Date().toDateString();

  // Mock available slots per day
  const mockSlots = {
    1: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM', '03:00 PM'],
    2: ['09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
    3: ['09:00 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
    4: ['09:00 AM', '09:30 AM', '10:00 AM', '02:00 PM', '02:30 PM', '03:00 PM', '04:00 PM'],
    5: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM'],
  };

  const toggleSlot = (day, time) => {
    addToast(`Slot ${time} updated for ${day.toLocaleDateString('en-US', { weekday: 'long' })}`, 'success');
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-heading font-bold text-text">Schedule & Availability</h1>
        <Button size="sm" variant="outline">
          <Plus className="w-4 h-4" /> Add Time Off
        </Button>
      </div>

      {/* Week Navigation */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setWeekOffset(weekOffset - 1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 transition-all"
            aria-label="Previous week"
          >
            <ChevronLeft className="w-5 h-5 text-text-muted" />
          </button>
          <h2 className="font-heading font-semibold text-text">
            {weekDays[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} — {weekDays[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </h2>
          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 transition-all"
            aria-label="Next week"
          >
            <ChevronRight className="w-5 h-5 text-text-muted" />
          </button>
        </div>
      </Card>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDays.map((day, i) => {
          const isToday = day.toDateString() === today;
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;
          const slots = mockSlots[day.getDay()] || [];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`p-4 h-full ${isToday ? 'ring-2 ring-primary' : ''} ${isWeekend ? 'opacity-60' : ''}`}>
                <div className="text-center mb-3">
                  <p className="text-xs font-medium text-text-muted uppercase">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <p className={`text-lg font-bold mt-1 ${isToday ? 'text-primary' : 'text-text'}`}>
                    {day.getDate()}
                  </p>
                  {isToday && <span className="text-[10px] font-bold text-primary">TODAY</span>}
                </div>

                {isWeekend ? (
                  <p className="text-xs text-text-muted text-center py-4">Day Off</p>
                ) : (
                  <div className="space-y-1.5">
                    {slots.map(time => (
                      <button
                        key={time}
                        onClick={() => toggleSlot(day, time)}
                        className="w-full py-1.5 px-2 bg-primary/8 hover:bg-primary/15 rounded-lg text-xs font-medium text-primary transition-all text-center"
                      >
                        {time}
                      </button>
                    ))}
                    <p className="text-[10px] text-text-muted text-center mt-2">{slots.length} slots</p>
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
