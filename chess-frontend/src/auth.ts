export class Auth {
  private static ACCESS_TOKEN_KEY = "accessToken";
  private static REFRESH_TOKEN_KEY = "refreshToken";
  private static SESSION_STATE_KEY = "sessionState";

  static isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  static getAccessToken(): string | null {
    return this.getToken(this.ACCESS_TOKEN_KEY);
  }

  static clearTokens() {
    fetch('/logout', { method: 'POST' })
      .then(response => {
        if (response.ok) {
          document.cookie = `${this.ACCESS_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
          document.cookie = `${this.REFRESH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
          localStorage.setItem(this.SESSION_STATE_KEY, Date.now().toString());
        }
      })
      .catch(error => console.error('Logout error:', error));
  }

  static logout(){

  }

  private static getToken(key: string): string | null {
    const nameEQ = `${key}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
}
