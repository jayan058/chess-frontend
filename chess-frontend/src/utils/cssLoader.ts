export function loadCSS(page: string) {
  const existingLinks = document.querySelectorAll('link[rel="stylesheet"]');
  existingLinks.forEach((link) => link.parentNode?.removeChild(link));
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `src/css/${page}.css`;
  document.head.appendChild(link);
}
