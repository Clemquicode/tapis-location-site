document.addEventListener("DOMContentLoaded", function () {
  initContactForm();
  initViewer360();
  initFAQ();
});

function initContactForm() {
  var form = document.getElementById("contact-form");
  var success = document.getElementById("form-success");

  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // No backend yet: confirm locally. Swap this for a real submit
    // (fetch to an API, or a service like Formspree) when ready.
    form.hidden = true;
    success.hidden = false;
    success.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function initViewer360() {
  var viewer = document.getElementById("viewer360");
  var img = document.getElementById("viewer360-img");
  var frameLabel = document.getElementById("viewer360-frame");
  var hint = document.getElementById("viewer360-hint");

  if (!viewer || !img) return;

  var FRAME_COUNT = 15;
  var PATH = "images/360/tapis-";

  // A drag spanning this fraction of the viewer's own width completes one
  // full rotation. Deriving it from the element's rendered size (rather
  // than a fixed pixel value) keeps the feel consistent across phone and
  // desktop widths, and compensates for having only FRAME_COUNT source
  // photos rather than true continuous footage.
  var ROTATION_WIDTH_FACTOR = 0.75;

  var currentFrame = 1;
  var dragging = false;
  var startX = 0;
  var startFrame = 1;
  var hintDismissed = false;
  var pxPerFrame = 32;

  function framePath(n) {
    return PATH + String(n).padStart(2, "0") + ".png";
  }

  // Preload all frames so dragging feels smooth from the first interaction.
  var preloaded = [];
  for (var i = 1; i <= FRAME_COUNT; i++) {
    var im = new Image();
    im.src = framePath(i);
    preloaded.push(im);
  }

  function setFrame(n) {
    var normalized = ((n - 1) % FRAME_COUNT + FRAME_COUNT) % FRAME_COUNT + 1;
    if (normalized === currentFrame) return;
    currentFrame = normalized;
    img.src = framePath(currentFrame);
    if (frameLabel) {
      frameLabel.textContent = String(currentFrame).padStart(2, "0") + " / " + FRAME_COUNT;
    }
  }

  function dismissHint() {
    if (hintDismissed || !hint) return;
    hintDismissed = true;
    hint.classList.add("is-hidden");
  }

  function onPointerDown(event) {
    dragging = true;
    startX = event.clientX;
    startFrame = currentFrame;
    var width = viewer.getBoundingClientRect().width || 320;
    pxPerFrame = (width * ROTATION_WIDTH_FACTOR) / FRAME_COUNT;
    viewer.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event) {
    if (!dragging) return;
    var deltaX = event.clientX - startX;
    var frameDelta = Math.round(-deltaX / pxPerFrame);
    if (frameDelta !== 0) dismissHint();
    setFrame(startFrame + frameDelta);
  }

  function onPointerUp(event) {
    if (!dragging) return;
    dragging = false;
    if (viewer.hasPointerCapture(event.pointerId)) {
      viewer.releasePointerCapture(event.pointerId);
    }
  }

  viewer.addEventListener("pointerdown", onPointerDown);
  viewer.addEventListener("pointermove", onPointerMove);
  viewer.addEventListener("pointerup", onPointerUp);
  viewer.addEventListener("pointercancel", onPointerUp);

  viewer.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") {
      dismissHint();
      setFrame(currentFrame + 1);
      event.preventDefault();
    } else if (event.key === "ArrowLeft") {
      dismissHint();
      setFrame(currentFrame - 1);
      event.preventDefault();
    }
  });
}

function initFAQ() {
  var toggle = document.getElementById("faq-toggle");
  var panel = document.getElementById("faq-panel");
  var backdrop = document.getElementById("faq-backdrop");
  var closeBtn = document.getElementById("faq-close");

  if (!toggle || !panel || !backdrop) return;

  function openPanel() {
    panel.classList.add("is-open");
    backdrop.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    var firstQuestion = panel.querySelector(".faq-question");
    if (firstQuestion) firstQuestion.focus();
  }

  function closePanel() {
    panel.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  toggle.addEventListener("click", function () {
    if (panel.classList.contains("is-open")) {
      closePanel();
    } else {
      openPanel();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      closePanel();
      toggle.focus();
    });
  }

  backdrop.addEventListener("click", closePanel);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && panel.classList.contains("is-open")) {
      closePanel();
      toggle.focus();
    }
  });

  var questions = panel.querySelectorAll(".faq-question");
  questions.forEach(function (button) {
    button.addEventListener("click", function () {
      var item = button.closest(".faq-item");
      var expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      item.classList.toggle("is-expanded", !expanded);
    });
  });
}
