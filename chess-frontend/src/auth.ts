export class Auth {
  private static ACCESS_TOKEN_KEY = "accessToken";
  private static REFRESH_TOKEN_KEY = "refreshToken";
  private static SESSION_STATE_KEY = "sessionState";

  static isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  static async getAccessToken(): Promise<string | null> {
    let accessToken = this.getToken(this.ACCESS_TOKEN_KEY);
    if (!accessToken) {
      try {
        accessToken = await this.refreshAccessToken();
      } catch (error) {
        window.location.hash = "#/login";
      }
    }
    return accessToken;
  }

  static getRefreshToken(): string | null {
    return this.getToken(this.REFRESH_TOKEN_KEY);
  }

  static setAccessToken(token: string) {
    // Set access token with a 20-second expiration
    this.setToken(this.ACCESS_TOKEN_KEY, token, 20); // 20 seconds time for access token
  }

  static setRefreshToken(token: string) {
    // Set refresh token with a 600-second expiration
    this.setToken(this.REFRESH_TOKEN_KEY, token, 18000); // 10 minutes time for refresh token
  }

  static clearTokens() {
    this.deleteToken(this.ACCESS_TOKEN_KEY);
    this.deleteToken(this.REFRESH_TOKEN_KEY);
    localStorage.setItem(this.SESSION_STATE_KEY, Date.now().toString());
  }

  static logout() {
    this.clearTokens();
  }

  private static getToken(key: string): string | null {
    const nameEQ = key + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  private static setToken(
    key: string,
    token: string,
    expiresInSeconds: number
  ) {
    const date = new Date();
    date.setTime(date.getTime() + expiresInSeconds * 1000);
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${key}=${token}; ${expires}; path=/;`;
  }

  private static deleteToken(key: string) {
    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  static async refreshAccessToken(): Promise<string> {
    const refreshToken = Auth.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch("http://localhost:3000/login/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh access token");
    }

    const data = await response.json();
    const newAccessToken = data.accessToken;
    Auth.setAccessToken(newAccessToken);
    return newAccessToken;
  }
}
