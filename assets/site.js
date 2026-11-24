(function () {
  const progressBar = document.getElementById("reading-progress");
  if (!progressBar) return;
  function updateProgress() {
    const documentElement = document.documentElement;
    const scrollableHeight =
      documentElement.scrollHeight - documentElement.clientHeight;
    const progress =
      scrollableHeight > 0
        ? (documentElement.scrollTop / scrollableHeight) * 100
        : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();
})();
(function () {
  const openers = document.querySelectorAll(".photo-open");
  function showImageFallback(image) {
    const button = image.closest(".photo-open");
    if (!button) return;
    const fallback = document.createElement("p");
    fallback.className = "photo-fallback";
    fallback.textContent =
      "This image could not be loaded. See its caption below.";
    button.replaceWith(fallback);
  }
  document.querySelectorAll(".photo img").forEach(function (image) {
    if (image.complete && !image.naturalWidth) {
      showImageFallback(image);
    } else {
      image.addEventListener(
        "error",
        function () {
          showImageFallback(image);
        },
        { once: true },
      );
    }
  });
  if (!openers.length || typeof HTMLDialogElement === "undefined") return;
  const dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.setAttribute("aria-label", "Enlarged image");
  dialog.innerHTML =
    '<button type="button" aria-label="Close enlarged image">Close</button><img alt=""><p></p>';
  document.body.appendChild(dialog);
  const enlargedImage = dialog.querySelector("img");
  const caption = dialog.querySelector("p");
  const closeButton = dialog.querySelector("button");
  openers.forEach(function (button) {
    button.addEventListener("click", function () {
      const sourceImage = button.querySelector("img");
      if (!sourceImage || !sourceImage.naturalWidth) return;
      enlargedImage.src = sourceImage.currentSrc || sourceImage.src;
      enlargedImage.alt = sourceImage.alt;
      caption.textContent =
        button.parentElement.querySelector("figcaption").textContent;
      dialog.showModal();
      closeButton.focus();
    });
  });
  closeButton.addEventListener("click", function () {
    dialog.close();
  });
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) dialog.close();
  });
})();
(function () {
  const navigation = document.querySelector(".primary-nav");
  const navigationTrack = navigation && navigation.querySelector(".nav-track");
  if (!navigation || !navigationTrack) return;
  const toggleButton = document.createElement("button");
  const mobileViewport = window.matchMedia("(max-width: 640px)");
  toggleButton.type = "button";
  toggleButton.className = "nav-toggle";
  toggleButton.setAttribute("aria-expanded", String(!mobileViewport.matches));
  toggleButton.textContent = "Menu";
  navigation.insertBefore(toggleButton, navigationTrack);
  function syncNavigation() {
    const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";
    navigation.classList.toggle(
      "is-collapsed",
      mobileViewport.matches && !isExpanded,
    );
    if (!mobileViewport.matches) {
      toggleButton.setAttribute("aria-expanded", "true");
      toggleButton.textContent = "Menu";
      navigation.classList.remove("is-collapsed");
    } else if (!isExpanded) {
      navigation.classList.add("is-collapsed");
    }
  }
  syncNavigation();
  toggleButton.addEventListener("click", function () {
    const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";
    toggleButton.setAttribute("aria-expanded", String(!isExpanded));
    toggleButton.textContent = isExpanded ? "Menu" : "Close";
    syncNavigation();
  });
  window.addEventListener("resize", syncNavigation);
})();
