import { fetchWithAuth } from "./fetchWithAuth";
import type { ApiResponse } from "@/types/api";

interface UserData {
  _id: string;
  username: string;
  email: string;
  phone: string;
}

interface UserResponseData {
  exists: boolean;
  user?: UserData;
}

export const checkUserByPhone = async (phone: string): Promise<UserData | null> => {
  try {
    const response = await fetchWithAuth<UserResponseData>(`/users/phone/${phone}`);
    console.log("🔹 [checkUserByPhone] Response:", response);

    if (!response.success) {
      console.log("❌ [checkUserByPhone] User not found:", response.message);
      return null;
    }

    if (!response.data?.exists || !response.data?.user) {
      console.log("❌ [checkUserByPhone] No user data returned");
      return null;
    }

    console.log("✅ [checkUserByPhone] Found user:", response.data.user);
    return response.data.user;
  } catch (error) {
    console.error("❌ [checkUserByPhone] Error:", error);
    return null;
  }
}; 