import { renderHook, act } from "@testing-library/react";
import useDebounce from "@hooks/useDebounce";

describe("useDebounce Hook", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("Hello", 1000));

    expect(result.current).toBe("Hello");
  });

  it("should update value after the delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "Hello", delay: 1000 } }
    );

    expect(result.current).toBe("Hello");

    rerender({ value: "Hello World", delay: 1000 });

    expect(result.current).toBe("Hello");

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current).toBe("Hello World");
  });
});
