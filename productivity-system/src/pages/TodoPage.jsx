import RoutineSection from "../components/RoutineSection/RoutineSection";
import TodoWidget from "../components/ToDo/TodoWidget";
export default function TodoPage({ selectedDate }) {
  return (
    <div>
      <RoutineSection selectedDate={selectedDate} />
      <TodoWidget selectedDate={selectedDate} />
    </div>
  );
}