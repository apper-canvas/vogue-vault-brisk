import authService from "./authService";

const userService = {
  getProfile: async () => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Id" } },
        { field: { Name: "email_c" } },
        { field: { Name: "first_name_c" } },
        { field: { Name: "last_name_c" } },
        { field: { Name: "phone_c" } },
        { field: { Name: "addresses_c" } },
        { field: { Name: "created_at_c" } }
      ]
    };

    const response = await apperClient.getRecordById("user_c", currentUser.Id, params);

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch user profile");
    }

    if (!response.data) {
      throw new Error("User not found");
    }

    const userProfile = {
      Id: response.data.Id,
      email: response.data.email_c,
      firstName: response.data.first_name_c,
      lastName: response.data.last_name_c,
      phone: response.data.phone_c || "",
      addresses: response.data.addresses_c ? JSON.parse(response.data.addresses_c) : [],
      createdAt: response.data.created_at_c
    };

    return userProfile;
  },

  updateProfile: async (profileData) => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const updateData = {
      Id: currentUser.Id,
      first_name_c: profileData.firstName,
      last_name_c: profileData.lastName,
      phone_c: profileData.phone || ""
    };

    const params = {
      records: [updateData]
    };

    const response = await apperClient.updateRecord("user_c", params);

    if (!response.success) {
      throw new Error(response.message || "Failed to update profile");
    }

    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      if (failed.length > 0) {
        const errorMsg = failed[0].message || "Failed to update profile";
        throw new Error(errorMsg);
      }

      const updatedData = response.results[0].data;
      const updatedUser = {
        Id: updatedData.Id,
        email: updatedData.email_c,
        firstName: updatedData.first_name_c,
        lastName: updatedData.last_name_c,
        phone: updatedData.phone_c || "",
        addresses: updatedData.addresses_c ? JSON.parse(updatedData.addresses_c) : [],
        createdAt: updatedData.created_at_c
      };

      try {
        localStorage.setItem("vogue_vault_user_session", JSON.stringify(updatedUser));
      } catch (error) {
        console.error("Error updating user session:", error);
      }

      return updatedUser;
    }

    throw new Error("Update failed");
  }
};

export default userService;