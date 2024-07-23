// main.ts
import { Router } from "./router";

document.addEventListener("DOMContentLoaded", () => {
  Router.init();
  window.addEventListener("hashchange", () => {
    Router.loadContent();
  });
});
