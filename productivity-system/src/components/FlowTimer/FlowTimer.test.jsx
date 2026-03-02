import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FlowTimer from "./FlowTimer";
import { act } from "@testing-library/react";


// Mock lucide icons
jest.mock("lucide-react", () => ({
  Play: () => <div>PlayIcon</div>,
  Pause: () => <div>PauseIcon</div>,
  RotateCcw: () => <div>RotateIcon</div>,
  Coffee: () => <div>CoffeeIcon</div>,
}));

// Mock EnergyModal
jest.mock("../Energy/EnergyModal", () => ({ isOpen }) =>
  isOpen ? <div>EnergyModal Open</div> : null
);

// Mock SessionContext
const mockAddSession = jest.fn();
jest.mock("../../contexts/SessionContext", () => ({
  useSession: () => ({
    addSession: mockAddSession,
  }),
}));

// Mock FocusModeContext
let mockFocusState;

jest.mock("../../contexts/FocusModeContext", () => ({
  useFocusMode: () => mockFocusState,
}));


beforeEach(() => {
  jest.clearAllMocks();

  mockFocusState = {
    activeMode: { id: "deepWork", name: "Deep Work", defaultDuration: 25 },
    secondsElapsed: 0,
    setSecondsElapsed: jest.fn(),
    isRunning: false,
    setIsRunning: jest.fn(),
    setActiveModeId: jest.fn(),
  };
});

test("renderar startläge korrekt", () => {
  render(<FlowTimer />);

  expect(screen.getByText(/Deep Work/i)).toBeInTheDocument();
  expect(screen.getByText("00:00")).toBeInTheDocument();
  expect(screen.getByText("Starta")).toBeInTheDocument();
});

test("klick på Starta togglar isRunning", async () => {
  render(<FlowTimer />);

  await userEvent.click(screen.getByText("Starta"));

  expect(mockFocusState.setIsRunning).toHaveBeenCalled();
});

test("quick switch sparar session om tid > 0", async () => {
  mockFocusState.secondsElapsed = 120;

  render(<FlowTimer />);

  await userEvent.click(screen.getByText("Ta en paus"));

  expect(mockAddSession).toHaveBeenCalledWith(
    expect.objectContaining({
      duration: 120,
      modeId: "deepWork",
    })
  );

  expect(mockFocusState.setActiveModeId).toHaveBeenCalled();
});

test("Avsluta visar EnergyModal efter timeout", async () => {
  jest.useFakeTimers();

  const user = userEvent.setup({
    advanceTimers: jest.advanceTimersByTime,
  });

  mockFocusState.secondsElapsed = 100;

  render(<FlowTimer />);

  await user.click(screen.getByText("Avsluta"));

  await act(async () => {
    jest.advanceTimersByTime(20);
  });

  expect(screen.getByText("EnergyModal Open")).toBeInTheDocument();

  jest.useRealTimers();
});

test("Nollställ klockan återställer state", async () => {
  render(<FlowTimer />);

  await userEvent.click(screen.getByText("Nollställ klockan"));

  expect(mockFocusState.setSecondsElapsed).toHaveBeenCalledWith(0);
  expect(mockFocusState.setIsRunning).toHaveBeenCalledWith(false);
});

afterEach(() => {
  jest.useRealTimers();
});