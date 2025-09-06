// script.js
// Implements form validation, password toggles, digit-only phone input,
// and reaction-time tracking (time from first focus to submit).

$(document).ready(function () {
  // Track when the user first starts interacting with any input
  let formStartTime = null;

  // Cache jQuery selectors
  const $form = $('#registrationForm');
  const $email = $('#email');
  const $phone = $('#phoneno');
  const $password = $('#password');
  const $confirmPassword = $('#confirmpassword');
  const $messageBox = $('#message');

  // Regular expressions and rules
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  // Password rule: min 8 chars, at least 1 uppercase, 1 lowercase, 1 digit
  function isValidPassword(password) {
    if (typeof password !== 'string') return false;
    const minLength = 8;
    const hasMinLength = password.length >= minLength;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    return hasMinLength && hasUpper && hasLower && hasDigit;
  }

  // Email validation helper
  function isValidEmail(email) {
    return emailRegex.test(email);
  }

  // Phone validation: exactly 10 digits
  function isValidPhone(phone) {
    return /^\d{10}$/.test(phone);
  }

  // Show a message (type = 'error' or 'success')
  function showMessage(htmlContent, type) {
    $messageBox
      .html(htmlContent)
      .removeClass('error success hidden')
      .addClass(type === 'success' ? 'success' : 'error');
  }

  // Toggle password visibility for the clicked toggle (data-target)
  $(document).on('click', '.toggle-pass', function () {
    const targetSelector = $(this).attr('data-target');
    const $targetInput = $(targetSelector);
    if ($targetInput.length === 0) return;
    const currentType = $targetInput.attr('type');
    $targetInput.attr('type', currentType === 'password' ? 'text' : 'password');
    // Small visual cue (optional): change button text
    const newLabel = $targetInput.attr('type') === 'password' ? '👁️': '👁️';
    $(this).text(newLabel);
  });

  // Enforce digit-only input for phone number as user types
  $phone.on('input', function () {
    // Remove any non-digit characters and trim to maxlength
    const cleaned = $(this).val().replace(/\D/g, '').slice(0, 10);
    $(this).val(cleaned);
  });

  // Record the time when user first focuses any input field
  $form.on('focusin', 'input', function () {
    if (formStartTime === null) {
      formStartTime = Date.now();
    }
  });

  // On form submit, validate fields
  $form.on('submit', function (event) {
    event.preventDefault();

    const errors = [];

    // Read values (trim whitespace where appropriate)
    const emailVal = $email.val().trim();
    const phoneVal = $phone.val().trim();
    const passwordVal = $password.val();
    const confirmPasswordVal = $confirmPassword.val();

    // Required field checks
    if (!emailVal) errors.push('Email is required.');
    if (!phoneVal) errors.push('Phone number is required.');
    if (!passwordVal) errors.push('Password is required.');
    if (!confirmPasswordVal) errors.push('Confirm password is required.');

    // If field present, validate content
    if (emailVal && !isValidEmail(emailVal)) {
      errors.push('Enter a valid email address (e.g., user@example.com).');
    }

    if (phoneVal && !isValidPhone(phoneVal)) {
      errors.push('Phone number must contain exactly 10 digits.');
    }

    if (passwordVal && !isValidPassword(passwordVal)) {
      errors.push('Password must be at least 8 characters and include uppercase, lowercase and a number.');
    }

    if (passwordVal && confirmPasswordVal && passwordVal !== confirmPasswordVal) {
      errors.push('Passwords do not match.');
    }

    // Show errors or success
    if (errors.length > 0) {
      // Build concise HTML list for errors
      const errorHtml = '<strong>Please fix the following:</strong><ul style="margin-top:6px;padding-left:18px;">' +
        errors.map(e => `<li>${escapeHtml(e)}</li>`).join('') +
        '</ul>';
      showMessage(errorHtml, 'error');
    } else {
      // Calculate reaction time in seconds (if started), otherwise 'N/A'
      let elapsedText = 'N/A';
      if (formStartTime !== null) {
        const elapsedMs = Date.now() - formStartTime;
        const elapsedSec = (elapsedMs / 1000).toFixed(2);
        elapsedText = `${elapsedSec} seconds`;
      }
      const successHtml = `✅ Form submitted successfully!`;
      showMessage(successHtml, 'success');

      // Optionally: reset timing so subsequent fills are tracked separately
      formStartTime = null;

      // If you want to actually submit to a server, do it here (AJAX/fetch).
      // For this assignment, we only show the success message.
    }
  });

  // Simple escaping to avoid any injection in message HTML
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
});
