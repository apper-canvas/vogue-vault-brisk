import usersData from "../mockData/users.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const USER_SESSION_KEY = "vogue_vault_user_session";

// Simple hash simulation (NOT for production use)
const hashPassword = (password) => {
  return btoa(password + "vogue_vault_salt");
};

const authService = {
  login: async (email, password) => {
    await delay(500);
    
    const user = usersData.find((u) => u.email === email);
    
    if (!user) {
      throw new Error("Invalid email or password");
    }
    
    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      throw new Error("Invalid email or password");
    }
    
    const { password: _, ...userWithoutPassword } = user;
    
    try {
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userWithoutPassword));
    } catch (error) {
      console.error("Error saving user session:", error);
    }
    
    return userWithoutPassword;
  },

  register: async (userData) => {
    await delay(500);
    
    const existingUser = usersData.find((u) => u.email === userData.email);
    if (existingUser) {
      throw new Error("Email already registered");
    }
    
    const newUser = {
      Id: Math.max(...usersData.map((u) => u.Id)) + 1,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: hashPassword(userData.password),
      phone: "",
      addresses: [],
      createdAt: new Date().toISOString()
    };
    
    usersData.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    
    try {
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userWithoutPassword));
    } catch (error) {
      console.error("Error saving user session:", error);
    }
    
    return userWithoutPassword;
  },

  logout: async () => {
    await delay(200);
    
    try {
      localStorage.removeItem(USER_SESSION_KEY);
    } catch (error) {
      console.error("Error removing user session:", error);
    }
  },

  getCurrentUser: () => {
    try {
      const session = localStorage.getItem(USER_SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error("Error reading user session:", error);
      return null;
    }
  },

  isAuthenticated: () => {
    return authService.getCurrentUser() !== null;
  }
};

export default authService;