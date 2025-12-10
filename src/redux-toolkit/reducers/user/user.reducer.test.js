import userReducer , { addUser, clearUser, updateUserProfile } from "@redux/reducers/user/user.reducer"

describe("userReducer", () => {
  it("should return the initial state", () => {
    const result = userReducer(undefined, { type: undefined });
    expect(result).toEqual({ token: '', profile: null });
  });

  it("should handle addUser", () => {
    const initialState = { token: '', profile: null };
    const userData = { token: '123456', profile: { username: 'Ahmed', _id: '1' } };
    const result = userReducer(initialState, addUser(userData));
    expect(result).toEqual({
      token: "123456",
      profile: { username: 'Ahmed', _id: '1' }
    });
  });

  it("should handle clearUser", () => {
    const initialState = { token: '123456', profile: { username: 'Ahmed', _id: '1' } };
    const result = userReducer(initialState, clearUser());
    expect(result).toEqual({ token: '', profile: null });
  });

  it("should handle updateUserProfile", () => {
    const initialState = { token: '123456', profile: { username: 'Old Name' } };
    const newProfile = { username: 'New Name' };

    const result = userReducer(initialState, updateUserProfile(newProfile));
    expect(result.profile).toEqual({ username: "New Name" });
    expect(result.token).toEqual("123456");
  });
});
