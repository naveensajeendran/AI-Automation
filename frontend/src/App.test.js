import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Financial Services Onboarding title", () => {
  render(<App />);
  const heading = screen.getByText(/Financial Services Onboarding/i);
  expect(heading).toBeInTheDocument();
});
