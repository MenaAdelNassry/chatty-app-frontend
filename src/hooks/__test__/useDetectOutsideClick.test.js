import { renderHook, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import useDetectOutsideClick from "@hooks/useDetectOutsideClick";

describe("useDetectOutsideClick", () => {
  let divElement;
  let ref;

  beforeAll(() => {
    divElement = document.createElement("div");
    document.body.appendChild(divElement)
    ref = { current: divElement };
  });

  afterAll(() => {
    document.body.removeChild(divElement);
  });

  it("should initialize with default value", () => {
    const { result } = renderHook(() => useDetectOutsideClick(ref, false));
    const [isActive] = result.current;
    expect(isActive).toBe(false);
  });

  it("should NOT close when clicking INSIDE the element", () => {
    const { result } = renderHook(() => useDetectOutsideClick(ref, true));
    userEvent.click(divElement);
    const [isActive] = result.current;
    expect(isActive).toBe(true);
  });

  it("should close when clicking OUTSIDE the element", () => {
    const { result } = renderHook(() => useDetectOutsideClick(ref, true));
    userEvent.click(document.body);
    const [isActive] = result.current;
    expect(isActive).toBe(false);
  });

  it("should allow manual toggling", () => {
    const { result } = renderHook(() => useDetectOutsideClick(ref, false));
    // eslint-disable-next-line no-unused-vars
    const [_, setIsActive] = result.current;
    act(() => {
      setIsActive(true);
    });
    expect(result.current[0]).toBe(true);
  });
});
