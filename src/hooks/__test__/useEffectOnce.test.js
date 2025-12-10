import { renderHook } from "@testing-library/react";
import useEffectOnce from "@hooks/useEffectOnce";

describe("useEffectOnce Hook", () => {
  it("should run the callback only once", () => {
    const mockCallback = jest.fn();

    const { rerender } = renderHook(
      () => useEffectOnce(mockCallback)
    );

    expect(mockCallback).toHaveBeenCalledTimes(1);

    rerender();
    rerender();
    rerender();

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
