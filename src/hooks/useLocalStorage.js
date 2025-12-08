const useLocalStorage = (key, type) => {
  try {
    if (type === 'get') {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } else if (type === 'set') {
      const setValue = (newValue) => {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      };
      return [setValue];
    } else {
      const deleteValue = () => {
        window.localStorage.removeItem(key);
      };
      return [deleteValue];
    }
  } catch (error) {
    console.log(error);
  }
};

export default useLocalStorage;
