import { VALIDATION_MESSAGE } from '/js/common/validationMessage.js';
import {
  validateEmail,
  isPasswordValid,
  isEmpty,
} from '/js/common/formValidator.js';

const emailInput = document.getElementById('inputEmail');
const pwdInput = document.getElementById('inputPwd');

const emailValidError = document.getElementById('emailValidError');
const pwdValidError = document.getElementById('pwdValidError');

const loginBtn = document.getElementById('loginBtn');

/**
 * 에러 메시지 표시
 * @param {HTMLElement} inputEl - 입력 필드 요소
 * @param {HTMLElement} errorEl - 오류 메시지 요소
 * @param {string} message - 표시할 오류 메시지
 */
function showError(inputEl, errorEl, message) {
  inputEl.classList.add('error');
  inputEl.classList.remove('success');
  errorEl.textContent = message;
}

/**
 * 에러 메세지 제거
 * @param {HTMLElement} inputEl - 입력 필드 요소
 * @param {HTMLElement} errorEl - 오류 메시지 요소
 */
function clearError(inputEl, errorEl) {
  inputEl.classList.remove('error');
  inputEl.classList.add('success');
  errorEl.textContent = '';
}

/**
 * 입력 필드 유효성 검사 함수
 * @param {HTMLElement} inputEl - 입력 필드 요소
 * @param {HTMLElement} errorEl - 오류 메시지 요소
 * @param {function} validationFn - 유효성 검사 함수
 * @param {string} emptyMessage - 빈 값 오류 메시지
 * @param {string} invalidMessage - 유효하지 않은 값 오류 메시지
 * @returns {boolean} 유효성 검사 결과
 */
function validateField(
  inputEl,
  errorEl,
  validationFn,
  emptyMessage,
  invalidMessage
) {
  // 빈 값 검사
  if (isEmpty(inputEl.value)) {
    showError(inputEl, errorEl, emptyMessage);
    return false;
  }

  // 유효성 검사 함수가 있고, 유효하지 않은 경우
  if (validationFn && !validationFn(inputEl.value)) {
    showError(inputEl, errorEl, invalidMessage);
    return false;
  }

  // 유효한 경우
  clearError(inputEl, errorEl);
  return true;
}

/**
 * 로그인 폼의 유효성을 검사하는 함수
 * @returns {boolean} 모든 입력값이 유효하면 true, 그렇지 않으면 false
 */
function checkLoginFormValid(showAllErrors = false) {
  let isEmailValid, isPwdValid;

  if (showAllErrors) {
    // 모든 필드의 오류를 표시해야 하는 경우 (예: 제출 시)
    isEmailValid = validateField(
      emailInput,
      emailValidError,
      validateEmail,
      VALIDATION_MESSAGE.email.empty,
      VALIDATION_MESSAGE.email.invalid
    );

    isPwdValid = validateField(
      pwdInput,
      pwdValidError,
      isPasswordValid,
      VALIDATION_MESSAGE.password.empty,
      VALIDATION_MESSAGE.password.length
    );
  } else {
    // 오류 메시지 표시 없이 유효성만 검사
    isEmailValid =
      !isEmpty(emailInput.value) && validateEmail(emailInput.value);
    isPwdValid = !isEmpty(pwdInput.value) && isPasswordValid(pwdInput.value);
  }

  return isEmailValid && isPwdValid;
}

/**
 * 입력값들의 유효성을 검사한 후,
 * 모든 항목이 유효할 경우 회원가입 버튼이 활성화
 * 그렇지 않으면 비활성화
 */
function toggleButtonState() {
  const isFormValid = checkLoginFormValid(false); // 오류 메시지 표시 없이 유효성만 검사
  const isFormInvalid = !isFormValid;

  // HTML 표준 disabled 속성 설정
  loginBtn.disabled = isFormInvalid;
  loginBtn.setAttribute('aria-disabled', `${isFormInvalid}`);
  loginBtn.classList.toggle('disabled', isFormInvalid);
}

/**
 * 비밀번호 숨김 버튼 설정
 */
function setupPasswordToggle() {
  const toggleButtons = document.querySelectorAll('.toggle-password');

  toggleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      const img = btn.querySelector('img');

      const isHidden = input.type === 'password';

      input.type = isHidden ? 'text' : 'password';
      img.src = isHidden
        ? '/assets/visibility_on.png'
        : '/assets/visibility_off.png';
      img.alt = isHidden ? '비밀번호 보이기' : '비밀번호 숨기기';
      btn.setAttribute(
        'aria-label',
        isHidden ? '비밀번호 보이기' : '비밀번호 숨기기'
      );
    });
  });
}

// 초기 상태에서 회원가입 버튼 비활성화 처리
document.addEventListener('DOMContentLoaded', () => {
  loginBtn.setAttribute('aria-disabled', 'true');
  loginBtn.classList.add('disabled');
  setupPasswordToggle();
});

// 이메일 유효성 검사
emailInput.addEventListener('input', () => {
  validateField(
    emailInput,
    emailValidError,
    validateEmail,
    VALIDATION_MESSAGE.email.empty,
    VALIDATION_MESSAGE.email.invalid
  );
  toggleButtonState();
});

// 비밀번호 유효성 검사
pwdInput.addEventListener('input', () => {
  validateField(
    pwdInput,
    pwdValidError,
    isPasswordValid,
    VALIDATION_MESSAGE.password.empty,
    VALIDATION_MESSAGE.password.length
  );
  toggleButtonState();
});

// 버튼이 활성화된 경우에만 로그인 페이지로 이동
loginBtn.addEventListener('click', (e) => {
  const isFormValid = checkLoginFormValid(true); // 모든 오류 메시지 표시

  if (!isFormValid) {
    e.preventDefault();
    return;
  }

  window.location.href = '/items.html';
});
