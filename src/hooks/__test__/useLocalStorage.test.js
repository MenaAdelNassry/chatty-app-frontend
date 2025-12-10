import { renderHook, act } from "@testing-library/react";
import useLocalStorage from "@hooks/useLocalStorage";

describe("useLocalStorage Hook", () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  describe("GET operation", () => {
    it("should retrieve and parse existing value", () => {
      window.localStorage.setItem("username", JSON.stringify("Ahmed"));

      const { result } = renderHook(() => useLocalStorage("username", "get"));

      expect(result.current).toBe("Ahmed");
    });

    it("should return null if key does not exist", () => {
      const { result } = renderHook(() => useLocalStorage("non-existing", "get"));
      expect(result.current).toBeNull();
    });
  });

  describe("SET operation", () => {
    it("should save value to localStorage", () => {
      const { result } = renderHook(() => useLocalStorage("theme", "set"));

      const [setValue] = result.current;

      act(() => {
        setValue("dark-mode");
      });

      expect(window.localStorage.getItem("theme")).toEqual(
        JSON.stringify("dark-mode")
      );
    });
  });

  describe("DELETE operation", () => {
    it("should remove value from localStorage", () => {
      window.localStorage.setItem("token", "123456");

      const { result } = renderHook(() => useLocalStorage("token", "delete"));

      const [deleteValue] = result.current;

      act(() => {
        deleteValue();
      });

      expect(window.localStorage.getItem("token")).toBeNull();
    });
  });
});
