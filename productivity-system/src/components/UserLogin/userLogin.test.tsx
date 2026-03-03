import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import UserLogin from "./userLogin";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("UserLogin - login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("navigerar till /dashboard vid korrekt login", async () => {
    render(
      <MemoryRouter>
        <UserLogin />
      </MemoryRouter>
    );

    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("E-post"), "test@test.com");
    await user.type(screen.getByPlaceholderText("Lösenord"), "123456");
    await user.click(screen.getByRole("button", { name: "Logga in" }));

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});