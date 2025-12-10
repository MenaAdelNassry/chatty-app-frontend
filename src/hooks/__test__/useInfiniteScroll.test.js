import { renderHook } from "@testing-library/react";
import { fireEvent } from "@testing-library/react"; // بنستخدم fireEvent عشان السكرول
import useInfiniteScroll from "@hooks/useInfiniteScroll";

describe("useInfiniteScroll", () => {
  let bodyRef;
  let bottomLineRef;
  let mockCallback;

  beforeEach(() => {
    const bodyElement = document.createElement("div");
    const bottomElement = document.createElement("div");

    bodyRef = { current: bodyElement };
    bottomLineRef = { current: bottomElement };

    mockCallback = jest.fn();
  });

  it("should call callback when bottom line is visible (Scrolled to bottom)", () => {
    bodyRef.current.getBoundingClientRect = jest.fn(() => ({ height: 500 }));
    bottomLineRef.current.getBoundingClientRect = jest.fn(() => ({ top: 400 }));

    renderHook(() =>
      useInfiniteScroll(bodyRef, bottomLineRef, mockCallback)
    );

    fireEvent.scroll(bodyRef.current);

    expect(mockCallback).toHaveBeenCalled();
  });

  it("should NOT call callback when bottom line is NOT visible", () => {
    bodyRef.current.getBoundingClientRect = jest.fn(() => ({ height: 500 }));
    bottomLineRef.current.getBoundingClientRect = jest.fn(() => ({ top: 600 }));

    renderHook(() =>
      useInfiniteScroll(bodyRef, bottomLineRef, mockCallback)
    );

    fireEvent.scroll(bodyRef.current);

    expect(mockCallback).not.toHaveBeenCalled();
  });
});
