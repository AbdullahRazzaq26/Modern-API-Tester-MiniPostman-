document.addEventListener("DOMContentLoaded", () => {

  document.querySelector("#sendRequest").addEventListener("click", async () => {
    const url = document.querySelector("#api-url").value;
    const method = document.querySelector("#method").value;
    const headersText = document.querySelector("#headers").value.trim();
    const bodyText = document.querySelector("#body").value.trim();

    let headers = {};
    if (headersText) {
      try {
        headers = JSON.parse(headersText);
      } catch (err) {
        return showError("Invalid headers JSON");
      }
    }

    let options = { method, headers };

    if (["POST", "PUT"].includes(method)) {
      try {
        options.body = bodyText ? JSON.stringify(JSON.parse(bodyText)) : "";
        headers["Content-Type"] = "application/json";
      } catch (err) {
        return showError("Invalid body JSON");
      }
    }

    try {
      const response = await fetch(url, options);
      const contentType = response.headers.get("content-type");

      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      document.querySelector("#responseOutput").textContent = JSON.stringify(data, null, 2);
    } catch (err) {
      showError("Request failed: " + err.message);
    }
  });

  function showError(msg) {
    document.querySelector("#responseOutput").textContent = `⚠️ ${msg}`;
  }
});
