import { render, screen } from "@testing-library/react";
import Header from "./components/incl/Header.jsx";

jest.mock("./components/incl/Header.jsx");

test("renders header", () => {
    Header.mockImplementation(() => <div>SSR Editor</div>);

    render(<Header />);
    const header = screen.getByText("SSR Editor");

    expect(header).toBeInTheDocument();
  });
