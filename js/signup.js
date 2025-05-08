import { VALIDATION_MESSAGE } from '/js/common/validationMessage.js';
import {
  validateEmail,
  isPasswordValid,
  isMatchValid,
  isEmpty,
} from '/js/common/formValidator.js';

const emailInput = document.getElementById('inputEmail');
const nicknameInput = document.getElementById('inputNickname');
const pwdInput = document.getElementById('inputPwd');
const confirmPwdInput = document.getElementById('inputPwd2');

const emailValidError = document.getElementById('emailValidError');
const nicknameValidError = document.getElementById('nicknameValidError');
const pwdValidError = document.getElementById('pwdValidError');
const confirmPwdValidError = document.getElementById('pwd2ValidError');

const signupBtn = document.getElementById('signupBtn');

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
 * 비밀번호 일치 검사 함수
 * @param {HTMLElement} inputEl - 입력 필드 요소
 * @param {HTMLElement} errorEl - 오류 메시지 요소
 * @param {string} password - 비교할 비밀번호
 * @param {string} emptyMessage - 빈 값 오류 메시지
 * @param {string} mismatchMessage - 불일치 오류 메시지
 * @returns {boolean} 검사 결과
 */
function validatePasswordMatch(
  inputEl,
  errorEl,
  password,
  emptyMessage,
  mismatchMessage
) {
  if (isEmpty(inputEl.value)) {
    showError(inputEl, errorEl, emptyMessage);
    return false;
  }

  if (!isMatchValid(password, inputEl.value)) {
    showError(inputEl, errorEl, mismatchMessage);
    console.log(inputEl.value + '/' + password);
    return false;
  }

  clearError(inputEl, errorEl);
  return true;
}

/**
 * 모든 폼 입력값이 유효한지 확인하는 함수
 * @returns {boolean} 모든 입력값이 유효하면 true, 그렇지 않으면 false
 */
function checkFormValid(showAllErrors = false) {
  let isEmailValid, isNicknameValid, isPwdValid, isConfirmPwdValid;

  if (showAllErrors) {
    // 모든 필드의 오류를 표시하는 경우 (예: 제출 시)
    isEmailValid = validateField(
      emailInput,
      emailValidError,
      validateEmail,
      VALIDATION_MESSAGE.email.empty,
      VALIDATION_MESSAGE.email.invalid
    );

    isNicknameValid = validateField(
      nicknameInput,
      nicknameValidError,
      null,
      VALIDATION_MESSAGE.nickname.empty
    );

    isPwdValid = validateField(
      pwdInput,
      pwdValidError,
      isPasswordValid,
      VALIDATION_MESSAGE.password.empty,
      VALIDATION_MESSAGE.password.length
    );

    isConfirmPwdValid = validatePasswordMatch(
      confirmPwdInput,
      confirmPwdValidError,
      pwdInput.value,
      VALIDATION_MESSAGE.password.empty,
      VALIDATION_MESSAGE.password.mismatch
    );
  } else {
    // 오류 메시지 표시 없이 유효성만 검사
    isEmailValid =
      !isEmpty(emailInput.value) && validateEmail(emailInput.value);
    isNicknameValid = !isEmpty(nicknameInput.value);
    isPwdValid = !isEmpty(pwdInput.value) && isPasswordValid(pwdInput.value);
    isConfirmPwdValid =
      !isEmpty(confirmPwdInput.value) &&
      isMatchValid(pwdInput.value, confirmPwdInput.value);
  }

  return isEmailValid && isNicknameValid && isPwdValid && isConfirmPwdValid;
}

/**
 * 입력값들의 유효성을 검사한 후,
 * 모든 항목이 유효할 경우 회원가입 버튼이 활성화
 * 그렇지 않으면 비활성화
 */
function toggleButtonState() {
  const isFormValid = checkFormValid(false); // 오류 메시지 표시 없이 유효성만 검사

  // HTML 표준 disabled 속성 설정
  signupBtn.disabled = !isFormValid;
  signupBtn.setAttribute('aria-disabled', `${!isFormValid}`);
  signupBtn.classList.toggle('disabled', !isFormValid);
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
  // HTML 표준 disabled 속성으로 비활성화
  signupBtn.disabled = true;

  signupBtn.setAttribute('aria-disabled', 'true');
  signupBtn.classList.add('disabled');
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

// 닉네임 유효성 검사
nicknameInput.addEventListener('input', () => {
  validateField(
    nicknameInput,
    nicknameValidError,
    null,
    VALIDATION_MESSAGE.nickname.empty
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

  // 비밀번호가 변경되면 비밀번호 확인 필드도 재검증
  if (confirmPwdInput.value) {
    validatePasswordMatch(
      confirmPwdInput,
      confirmPwdValidError,
      pwdInput.value,
      VALIDATION_MESSAGE.password.empty,
      VALIDATION_MESSAGE.password.mismatch
    );
  }
  toggleButtonState();
});

// 비밀번호 확인 검사
confirmPwdInput.addEventListener('input', () => {
  validatePasswordMatch(
    confirmPwdInput,
    confirmPwdValidError,
    pwdInput.value,
    VALIDATION_MESSAGE.password.empty,
    VALIDATION_MESSAGE.password.mismatch
  );
  toggleButtonState();
});

// 버튼이 활성화된 경우에만 로그인 페이지로 이동
signupBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const isFormValid = checkFormValid(true);

  if (!isFormValid) {
    return; // 유효하지 않으면 제출 중단
  }

  window.location.href = './login.html';
});
