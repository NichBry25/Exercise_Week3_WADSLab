import { render, screen } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase-admin";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/lib/firebase-admin", () => ({
  adminAuth: {
    verifySessionCookie: jest.fn(),
  },
}));

jest.mock("@/components/ui/logout-button", () => ({
  __esModule: true,
  default: function MockLogoutButton() {
    return <button>Logout</button>;
  },
}));

const mockCookies = cookies as jest.Mock;
const mockRedirect = redirect as jest.Mock;
const mockVerifySession = adminAuth.verifySessionCookie as jest.Mock;

describe("DashboardPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects to /login when there is no session cookie", async () => {
    mockCookies.mockResolvedValue({
      get: jest.fn().mockReturnValue(undefined),
    });

    mockRedirect.mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });

    await expect(DashboardPage()).rejects.toThrow("NEXT_REDIRECT");
    expect(mockRedirect).toHaveBeenCalledWith("/login");
  });

  it("redirects to /login when session cookie is invalid", async () => {
    mockCookies.mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: "session-token" }),
    });

    mockVerifySession.mockRejectedValue(new Error("invalid session"));

    mockRedirect.mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });

    await expect(DashboardPage()).rejects.toThrow("NEXT_REDIRECT");
    expect(mockRedirect).toHaveBeenCalledWith("/login");
  });

  it("renders user information when session is valid", async () => {
    mockCookies.mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: "session-token" }),
    });

    mockVerifySession.mockResolvedValue({
      email: "student@example.com",
      uid: "uid-123",
      email_verified: true,
    });

    const ui = await DashboardPage();
    render(ui);

    expect(screen.getByText(/student@example\.com/)).toBeInTheDocument();
    expect(screen.getByText(/uid-123/)).toBeInTheDocument();
    expect(screen.getByText(/Yes/)).toBeInTheDocument();
    expect(screen.getByText(/Logout/)).toBeInTheDocument();
  });
});
