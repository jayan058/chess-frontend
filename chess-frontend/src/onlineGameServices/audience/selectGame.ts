import { Auth } from "../../auth";
export async function fetchActiveRooms(): Promise<any> {
  try {
    let token = Auth.getAccessToken();
    const response = await fetch("http://localhost:3000/room", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch active rooms", error);
    throw error;
  }
}
