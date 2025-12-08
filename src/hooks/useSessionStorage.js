const useSessionStorage = (key, type) => {
  try {
    if (type === 'get') {
      const value = window.sessionStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } else if (type === 'set') {
      const setValue = (newValue) => {
        window.sessionStorage.setItem(key, JSON.stringify(newValue));
      };
      return [setValue];
    } else {
      const deleteValue = () => {
        window.sessionStorage.removeItem(key);
      };
      return [deleteValue];
    }
  } catch (error) {
    console.log(error);
  }
};

export default useSessionStorage;
