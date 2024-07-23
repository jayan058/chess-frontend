export function loadCSS(page: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Remove existing stylesheets
    const existingLinks = document.querySelectorAll('link[rel="stylesheet"]');
    existingLinks.forEach((link) => link.parentNode?.removeChild(link));

    // Create new link element for the CSS file
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `src/css/${page}.css`;

    // Resolve the promise when the CSS file has been loaded
    link.onload = () => {
      resolve();
    };

    // Reject the promise if there's an error loading the CSS file
    link.onerror = () => {
      reject(new Error(`Failed to load CSS file: ${link.href}`));
    };

    // Append the link element to the document head
    document.head.appendChild(link);
  });
}
