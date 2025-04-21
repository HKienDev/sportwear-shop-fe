import { fetchWithAuth } from "./fetchWithAuth";

interface UserData {
  _id: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
}

export async function checkUserByPhone(phone: string): Promise<UserData | null> {
  try {
    const response = await fetchWithAuth<UserData>(`/users/check-phone/${phone}`);
    return response.data || null;
  } catch (error) {
    console.error('Error checking user by phone:', error);
    return null;
  }
} 