import usersData from "../mockData/users.json";
import authService from "./authService";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const userService = {
  getProfile: async () => {
    await delay(300);
    
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
    
    const user = usersData.find((u) => u.Id === currentUser.Id);
    if (!user) {
      throw new Error("User not found");
    }
    
    const { password: _, ...userProfile } = user;
    return userProfile;
  },

  updateProfile: async (profileData) => {
    await delay(400);
    
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
    
    const userIndex = usersData.findIndex((u) => u.Id === currentUser.Id);
    if (userIndex === -1) {
      throw new Error("User not found");
    }
    
    usersData[userIndex] = {
      ...usersData[userIndex],
      ...profileData,
      Id: currentUser.Id,
      email: currentUser.email,
      password: usersData[userIndex].password
    };
    
    const { password: _, ...updatedUser } = usersData[userIndex];
    
    try {
      localStorage.setItem("vogue_vault_user_session", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error updating user session:", error);
    }
    
    return updatedUser;
  },

  getAddresses: async () => {
    await delay(200);
    
    const profile = await userService.getProfile();
    return profile.addresses || [];
  },

  addAddress: async (address) => {
    await delay(300);
    
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
    
    const userIndex = usersData.findIndex((u) => u.Id === currentUser.Id);
    if (userIndex === -1) {
      throw new Error("User not found");
    }
    
    const newAddress = {
      Id: Date.now(),
      ...address,
      isDefault: usersData[userIndex].addresses.length === 0
    };
    
    usersData[userIndex].addresses.push(newAddress);
    
    const { password: _, ...updatedUser } = usersData[userIndex];
    
    try {
      localStorage.setItem("vogue_vault_user_session", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error updating user session:", error);
    }
    
    return newAddress;
  }
};

export default userService;