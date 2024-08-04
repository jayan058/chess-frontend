//Function to load the CSS stylesheets into the html files during the routing process
export function loadCSS(page: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existingLinks = document.querySelectorAll('link[rel="stylesheet"]');
    existingLinks.forEach((link) => link.parentNode?.removeChild(link));

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `src/css/${page}.css`;

    link.onload = () => {
      resolve();
    };

    link.onerror = () => {
      reject(new Error(`Failed to load CSS file: ${link.href}`));
    };

    document.head.appendChild(link);
  });
}
