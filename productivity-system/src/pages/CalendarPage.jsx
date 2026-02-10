import Calendar from "../components/Calendar/Calendar";
import DailySchedule from "../components/Schedule/DailySchedule";
export default function CalendarPage({ selectedDate, setSelectedDate }) {
  return (
    <div>
      <Calendar selectedTs={selectedDate} onDateChange={setSelectedDate} />
      <DailySchedule selectedDate={selectedDate} />
    </div>
  );
}