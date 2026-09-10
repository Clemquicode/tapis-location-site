document.addEventListener("DOMContentLoaded", function () {
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
});
