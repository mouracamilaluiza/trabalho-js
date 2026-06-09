(function initEscapeHtml(global) {
  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      escapeHtml,
    };
  }

  global.escapeHtml = escapeHtml;
})(typeof window !== "undefined" ? window : globalThis);
