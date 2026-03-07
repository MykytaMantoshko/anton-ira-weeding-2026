(function () {
  var formSection = document.getElementById("rsvp-form-section");
  var thankYouYes = document.getElementById("rsvp-thank-you-yes");
  var thankYouNo = document.getElementById("rsvp-thank-you-no");
  var form = document.getElementById("rsvp-form");
  var firstNameInput = document.getElementById("rsvp-firstName");
  var lastNameInput = document.getElementById("rsvp-lastName");
  var thankYouNameSpan = document.getElementById("rsvp-thank-you-name");
  var errorFirstName = document.getElementById("rsvp-error-firstName");
  var errorLastName = document.getElementById("rsvp-error-lastName");
  var errorAttendance = document.getElementById("rsvp-error-attendance");

  var lastSubmittedData = null;

  var messages = {
    firstName: "Будь ласка, вкажіть ім'я",
    lastName: "Будь ласка, вкажіть прізвище",
    attendance: "Будь ласка, оберіть, чи будете ви на весіллі",
  };

  function getAttendance() {
    var r = form.querySelector('input[name="attendance"]:checked');
    return r ? r.value : null;
  }

  function collectFormData() {
    var alcohol = [];
    form.querySelectorAll('input[name="alcohol"]:checked').forEach(function (el) {
      alcohol.push(el.value);
    });
    return {
      firstName: (firstNameInput && firstNameInput.value) ? firstNameInput.value.trim() : "",
      lastName: (lastNameInput && lastNameInput.value) ? lastNameInput.value.trim() : "",
      attendance: getAttendance(),
      alcohol: alcohol,
      notes: (form.querySelector('textarea[name="notes"]') && form.querySelector('textarea[name="notes"]').value) ? form.querySelector('textarea[name="notes"]').value.trim() : "",
    };
  }

  function showError(el, text) {
    if (!el) return;
    el.textContent = text || "";
    el.classList.remove("hidden");
  }

  function hideError(el) {
    if (!el) return;
    el.textContent = "";
    el.classList.add("hidden");
  }

  function setInputInvalid(input, invalid) {
    if (!input) return;
    if (invalid) {
      input.classList.add("border-red");
      input.classList.remove("border-transparent");
    } else {
      input.classList.remove("border-red");
      input.classList.add("border-transparent");
    }
  }

  function validate() {
    var data = collectFormData();
    var valid = true;

    hideError(errorFirstName);
    hideError(errorLastName);
    hideError(errorAttendance);
    setInputInvalid(firstNameInput, false);
    setInputInvalid(lastNameInput, false);

    if (!data.firstName) {
      showError(errorFirstName, messages.firstName);
      setInputInvalid(firstNameInput, true);
      valid = false;
    }
    if (!data.lastName) {
      showError(errorLastName, messages.lastName);
      setInputInvalid(lastNameInput, true);
      valid = false;
    }
    if (!data.attendance) {
      showError(errorAttendance, messages.attendance);
      valid = false;
    }

    return valid;
  }

  function scrollToFormSection() {
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  /** Placeholder: send data to Google Sheets. Implement later. */
  function sendToGoogleSheets(data) {
    // TODO: integrate with Google Sheets (e.g. Google Apps Script Web App or serverless function)
    console.log("RSVP data (would send to Google):", data);
  }

  function showForm() {
    if (formSection) formSection.classList.remove("hidden");
    if (thankYouYes) thankYouYes.classList.add("hidden");
    if (thankYouNo) thankYouNo.classList.add("hidden");
  }

  function showThankYouYes(name) {
    if (formSection) formSection.classList.add("hidden");
    if (thankYouYes) thankYouYes.classList.remove("hidden");
    if (thankYouNo) thankYouNo.classList.add("hidden");
    if (thankYouNameSpan) thankYouNameSpan.textContent = name || "Ім'я";
  }

  function showThankYouNo() {
    if (formSection) formSection.classList.add("hidden");
    if (thankYouYes) thankYouYes.classList.add("hidden");
    if (thankYouNo) thankYouNo.classList.remove("hidden");
  }

  function restoreForm(data) {
    if (!data) return;
    if (firstNameInput) firstNameInput.value = data.firstName || "";
    if (lastNameInput) lastNameInput.value = data.lastName || "";
    form.querySelectorAll('input[name="attendance"]').forEach(function (el) {
      el.checked = el.value === data.attendance;
    });
    form.querySelectorAll('input[name="alcohol"]').forEach(function (el) {
      el.checked = data.alcohol && data.alcohol.indexOf(el.value) >= 0;
    });
    var notes = form.querySelector('textarea[name="notes"]');
    if (notes) notes.value = data.notes || "";
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) {
        scrollToFormSection();
        return;
      }
      var data = collectFormData();
      lastSubmittedData = data;
      sendToGoogleSheets(data);
      if (data.attendance === "yes") {
        showThankYouYes(data.firstName);
      } else {
        showThankYouNo();
      }
    });
  }

  if (firstNameInput) {
    firstNameInput.addEventListener("input", function () {
      hideError(errorFirstName);
      setInputInvalid(firstNameInput, false);
    });
  }
  if (lastNameInput) {
    lastNameInput.addEventListener("input", function () {
      hideError(errorLastName);
      setInputInvalid(lastNameInput, false);
    });
  }
  if (form) {
    form.querySelectorAll("input[name=\"attendance\"]").forEach(function (radio) {
      radio.addEventListener("change", function () {
        hideError(errorAttendance);
      });
    });
  }

  var editYesBtn = document.getElementById("rsvp-edit-yes");
  var editNoBtn = document.getElementById("rsvp-edit-no");
  if (editYesBtn) {
    editYesBtn.addEventListener("click", function () {
      showForm();
      restoreForm(lastSubmittedData);
      scrollToFormSection();
    });
  }
  if (editNoBtn) {
    editNoBtn.addEventListener("click", function () {
      showForm();
      restoreForm(lastSubmittedData);
      scrollToFormSection();
    });
  }
})();
