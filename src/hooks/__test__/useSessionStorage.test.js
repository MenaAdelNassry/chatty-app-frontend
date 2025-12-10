import { renderHook, act } from "@testing-library/react";
import useSessionStorage from "@hooks/useSessionStorage";

describe("useSessionStorage Hook", () => {
  afterEach(() => {
    window.sessionStorage.clear();
  });

  describe("GET operation", () => {
    it("should retrieve and parse existing value", () => {
      window.sessionStorage.setItem("user_id", JSON.stringify("999"));

      const { result } = renderHook(() => useSessionStorage("user_id", "get"));

      expect(result.current).toBe("999");
    });

    it("should return null if key does not exist", () => {
      const { result } = renderHook(() => useSessionStorage("ghost_key", "get"));
      expect(result.current).toBeNull();
    });
  });

  describe("SET operation", () => {
    it("should save value to sessionStorage", () => {
      const { result } = renderHook(() => useSessionStorage("filter", "set"));

      const [setValue] = result.current;

      act(() => {
        setValue({ active: true });
      });

      expect(window.sessionStorage.getItem("filter")).toEqual(
        JSON.stringify({ active: true })
      );
    });
  });

  describe("DELETE operation", () => {
    it("should remove value from sessionStorage", () => {
      window.sessionStorage.setItem("temp_token", "abc-123");

      const { result } = renderHook(() => useSessionStorage("temp_token", "delete"));

      const [deleteValue] = result.current;

      act(() => {
        deleteValue();
      });

      expect(window.sessionStorage.getItem("temp_token")).toBeNull();
    });
  });
});
