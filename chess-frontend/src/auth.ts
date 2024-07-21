export class Auth {
  private static TOKEN_KEY = "auth-token";

  static login(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
