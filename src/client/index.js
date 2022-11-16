const webview = document.querySelector("webview");
const loader = document.querySelector("#loader");

webview.addEventListener("dom-ready", () => {
  webview.focus();
  setTimeout(() => {
    loader.classList.add("hide");
  }, 500);
});

window.addEventListener("online", () => {
  webview.classList.remove("hide");
  loader.classList.add("hide");
});

window.addEventListener("offline", () => {
  loader.innerHTML = "Internet connection is required";
  loader.classList.remove("hide");
  webview.classList.add("hide");
});
