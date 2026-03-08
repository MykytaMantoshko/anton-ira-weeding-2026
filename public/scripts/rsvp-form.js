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
  var errorSubmit = document.getElementById("rsvp-error-submit");
  var submitBtn = document.getElementById("rsvp-submit");
  var formPreloader = document.getElementById("rsvp-form-preloader");
  var formContent = document.getElementById("rsvp-form-content");

  var lastSubmittedData = null;

  var API_RSVP = "/api/rsvp";
  var RSVP_COOKIE = "rsvp_data";
  var RSVP_COOKIE_DAYS = 365;

  function getSubmitUrl() {
    return API_RSVP;
  }

  function getPrefillUrl(firstName, lastName) {
    return API_RSVP + "?firstName=" + encodeURIComponent(firstName) + "&lastName=" + encodeURIComponent(lastName);
  }

  var messages = {
    firstName: "Будь ласка, вкажіть ім'я",
    lastName: "Будь ласка, вкажіть прізвище",
    attendance: "Будь ласка, оберіть, чи будете ви на весіллі",
    submitError: "Не вдалося зберегти. Перевірте інтернет і спробуйте ще раз.",
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

  function setSubmitLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.textContent = loading ? "Збереження…" : "ПІДТВЕРДИТИ";
  }

  function validate() {
    var data = collectFormData();
    var valid = true;

    hideError(errorFirstName);
    hideError(errorLastName);
    hideError(errorAttendance);
    hideError(errorSubmit);
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

  function showFormPreloader() {
    if (formPreloader) formPreloader.classList.remove("hidden");
    if (formContent) formContent.classList.add("hidden");
  }

  function hideFormPreloader() {
    if (formPreloader) formPreloader.classList.add("hidden");
    if (formContent) formContent.classList.remove("hidden");
  }

  function setRsvpCookie(data) {
    if (!data || !data.firstName || !data.lastName) return;
    try {
      var value = encodeURIComponent(JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        attendance: data.attendance || "",
        alcohol: data.alcohol || [],
        notes: data.notes || ""
      }));
      var expires = new Date();
      expires.setDate(expires.getDate() + RSVP_COOKIE_DAYS);
      document.cookie = RSVP_COOKIE + "=" + value + "; path=/; expires=" + expires.toUTCString() + "; SameSite=Lax";
    } catch (e) {}
  }

  function getRsvpCookie() {
    try {
      var name = RSVP_COOKIE + "=";
      var parts = document.cookie.split(";");
      for (var i = 0; i < parts.length; i++) {
        var part = parts[i].trim();
        if (part.indexOf(name) === 0) {
          var json = decodeURIComponent(part.slice(name.length));
          return JSON.parse(json);
        }
      }
    } catch (e) {}
    return null;
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

  function applyFetchedData(data) {
    if (!data) return;
    var payload = {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      attendance: data.attendance || "",
      alcohol: Array.isArray(data.alcohol) ? data.alcohol : [],
      notes: data.notes || "",
    };
    restoreForm(payload);
  }

  function sendToGoogleSheets(data, onSuccess, onError) {
    var url = getSubmitUrl();
    var payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      attendance: data.attendance,
      alcohol: data.alcohol,
      notes: data.notes,
    };
    setSubmitLoading(true);
    hideError(errorSubmit);
    fetch(url, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        setSubmitLoading(false);
        if (res.ok) {
          res.json().then(function (body) {
            if (onSuccess) onSuccess();
          }).catch(function () {
            if (onSuccess) onSuccess();
          });
        } else {
          res.text().then(function (text) {
            var detail = res.status + " " + res.statusText + (text ? ": " + text.slice(0, 300) : "");
            if (onError) onError(messages.submitError + " (" + detail + ")");
          }).catch(function () {
            var detail = res.status + " " + res.statusText;
            if (onError) onError(messages.submitError + " (" + detail + ")");
          });
        }
      })
      .catch(function (err) {
        setSubmitLoading(false);
        var detail = (err && err.message) ? err.message : String(err);
        if (onError) onError(messages.submitError + " (" + detail + ")");
      });
  }

  function onSubmitSuccess(data) {
    lastSubmittedData = data;
    setRsvpCookie(data);
    if (data.attendance === "yes") {
      showThankYouYes(data.firstName);
    } else {
      showThankYouNo();
    }
  }

  function onSubmitError(msg) {
    showError(errorSubmit, msg || messages.submitError);
    scrollToFormSection();
  }

  function tryPrefillFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var firstName = (params.get("firstName") || params.get("name") || "").trim();
    var lastName = (params.get("lastName") || params.get("surname") || "").trim();
    if (typeof decodeURIComponent === "function") {
      try {
        if (params.get("firstName")) firstName = decodeURIComponent(firstName);
        if (params.get("lastName")) lastName = decodeURIComponent(lastName);
        if (params.get("name")) firstName = decodeURIComponent(firstName);
        if (params.get("surname")) lastName = decodeURIComponent(lastName);
      } catch (e) {}
    }
    if (!firstName || !lastName) {
      tryPrefillFromCookie();
      return;
    }
    showFormPreloader();
    var getUrl = getPrefillUrl(firstName, lastName);
    fetch(getUrl, { method: "GET" })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        hideFormPreloader();
        if (json && json.found && json.data) {
          applyFetchedData(json.data);
          setRsvpCookie({
            firstName: json.data.firstName,
            lastName: json.data.lastName,
            attendance: json.data.attendance,
            alcohol: json.data.alcohol,
            notes: json.data.notes
          });
        } else {
          if (firstNameInput) firstNameInput.value = firstName;
          if (lastNameInput) lastNameInput.value = lastName;
        }
      })
      .catch(function () {
        hideFormPreloader();
        if (firstNameInput) firstNameInput.value = firstName;
        if (lastNameInput) lastNameInput.value = lastName;
      });
  }

  function tryPrefillFromCookie() {
    var data = getRsvpCookie();
    if (data && (data.firstName || data.lastName)) {
      restoreForm(data);
    }
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) {
        scrollToFormSection();
        return;
      }
      var data = collectFormData();
      sendToGoogleSheets(data, function () {
        onSubmitSuccess(data);
      }, function (msg) {
        onSubmitError(msg);
      });
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

  tryPrefillFromUrl();
})();
