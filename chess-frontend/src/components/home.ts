//The homepage of the game
export class HomePage {
  static async load(): Promise<string> {
    const response = await fetch("src/views/home.html");
    return response.text();
  }

  static initEventListeners() {}
}
