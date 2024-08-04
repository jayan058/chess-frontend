export class Auth {
  private static ACCESS_TOKEN_KEY = "accessToken";
  private static REFRESH_TOKEN_KEY = "refreshToken";
  private static SESSION_STATE_KEY = "sessionState";
  private static ACCESS_TOKEN_LIFETIME = 20; //20 seconds
  private static REFRESH_TOKEN_LIFETIME = 18000; //5 hours in seconds

  static isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  static async getAccessToken(): Promise<string | null> {
    let accessToken = this.getToken(this.ACCESS_TOKEN_KEY);
    if (!accessToken) {
      try {
        accessToken = await this.refreshAccessToken(); //If acess token expired then get a new one form the server
      } catch (error) {
        window.location.hash = "#/login";
      }
    }
    return accessToken;
  }

  static getRefreshToken(): string | null {
    return this.getToken(this.REFRESH_TOKEN_KEY);
  }
  //Function to set the access token

  static setAccessToken(token: string) {
    this.setToken(this.ACCESS_TOKEN_KEY, token, this.ACCESS_TOKEN_LIFETIME);
  }

  //Function to set the refresh token
  static setRefreshToken(token: string) {
    this.setToken(this.REFRESH_TOKEN_KEY, token, this.REFRESH_TOKEN_LIFETIME);
  }
  //Clear all the token(used during handling logout)
  static clearTokens() {
    this.deleteToken(this.ACCESS_TOKEN_KEY);
    this.deleteToken(this.REFRESH_TOKEN_KEY);
    localStorage.setItem(this.SESSION_STATE_KEY, Date.now().toString());
  }

  static logout() {
    this.clearTokens();
  }

  //Function to get the token (both access and refresh)
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
    expiresInSeconds: number,
  ) {
    const date = new Date();
    date.setTime(date.getTime() + expiresInSeconds * 1000);
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${key}=${token}; ${expires}; path=/;`; //Path is set to "/" to ensure it is available throughout the application
  }

  private static deleteToken(key: string) {
    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`; //Delete the token by setting its expiry time
  }

  //Function to refresh the access token
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
    Auth.setAccessToken(newAccessToken); //Set the newly recieved access token in the cookie
    return newAccessToken;
  }
}
