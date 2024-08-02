export function sessionChangeListeners() {
  window.addEventListener("storage", (event) => {
    if (event.key === "authChange") {
      window.location.hash = "#/login";
    }
  });
}
