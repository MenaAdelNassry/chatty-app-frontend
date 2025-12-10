import AuthTabs from "@pages/auth/auth-tabs/AuthTabs";
import { render, screen, within } from "@root/test.utils";
import userEvent from "@testing-library/user-event";

describe("Authtabs", () => {
  it("signin tab should be displayed", () => {
    render(<AuthTabs />);

    const list = screen.getByRole("list");
    const { getAllByRole } = within(list);
    const items = getAllByRole("listitem");

    expect(items[0]).toHaveTextContent("Sign In");
    expect(items[0]).toHaveClass("active");
  });

  it("sign up tab should be displayed", () => {
    render(<AuthTabs />);

    const list = screen.getByRole("list");
    const { getAllByRole } = within(list);
    const items = getAllByRole("listitem");

    const signupButton = within(items[1]).getByRole('button', { name: /sign up/i });
    userEvent.click(signupButton);

    expect(items[1]).toHaveTextContent("Sign Up");
    expect(items[1]).toHaveClass("active");
  });
});
