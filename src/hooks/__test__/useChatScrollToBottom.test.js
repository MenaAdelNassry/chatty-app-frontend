import { renderHook } from "@testing-library/react";
import useChatScrollToBottom from "@hooks/useChatScrollToBottom";

describe("useChatScrollToBottom", () => {
  let scrollMock;

  beforeEach(() => {
    scrollMock = jest.fn();
    Element.prototype.scrollTo = scrollMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should scroll to bottom when new messages arrive", () => {
    const { result, rerender } = renderHook(
      (props) => useChatScrollToBottom(props),
      { initialProps: [] }
    );

    const element = document.createElement("div");

    Object.defineProperty(element, "scrollHeight", { value: 500, configurable: true });

    result.current.current = element;

    rerender(["Hello", "World"]);

    expect(scrollMock).toHaveBeenCalledWith({
      top: 500,
      behavior: "smooth",
    });
  });

  it("should not crash if ref is null", () => {
    const { rerender } = renderHook((props) => useChatScrollToBottom(props), {
      initialProps: [],
    });

    rerender(["New message"]);

    expect(scrollMock).not.toHaveBeenCalled();
  });
});
