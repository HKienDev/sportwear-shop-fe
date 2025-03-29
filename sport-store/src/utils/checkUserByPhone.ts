import { fetchWithAuth } from "./fetchWithAuth";

interface UserResponse {
  success: boolean;
  exists: boolean;
  message: string;
  user?: {
    _id: string;
    username: string;
    email: string;
    phone: string;
  };
}

export const checkUserByPhone = async (phone: string) => {
  try {
    const response = await fetchWithAuth(`/users/phone/${phone}`);
    console.log("🔹 [checkUserByPhone] Response:", response);

    if (!response.success) {
      console.log("❌ [checkUserByPhone] User not found:", response.message);
      return null;
    }

    if (!response.exists || !response.user) {
      console.log("❌ [checkUserByPhone] No user data returned");
      return null;
    }

    console.log("✅ [checkUserByPhone] Found user:", response.user);
    return response.user;
  } catch (error) {
    console.error("❌ [checkUserByPhone] Error:", error);
    return null;
  }
}; 