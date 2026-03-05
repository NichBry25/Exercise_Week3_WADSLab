import { render, screen } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";

describe("DashboardPage", () => {
  it("renders dashboard welcome content", () => {
    render(<DashboardPage />);

    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(screen.getByText(/manage your tasks and stay organized/i)).toBeInTheDocument();
    expect(screen.getByText(/quick start/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /go to my todo list/i })
    ).toHaveAttribute("href", "/dashboard/todos");
  });
});
