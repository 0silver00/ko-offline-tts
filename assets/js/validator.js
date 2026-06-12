/**
 * validator.js
 * Input_Validator - 사용자 입력 유효성 검증 순수 함수 모듈
 * Requirements: 2.4, 2.5, 2.6, 2.9, 4.7, 4.8
 */

const CONSTRAINTS = {
  TEXT_MIN: 1,
  TEXT_MAX: 10000,
  SPEED_MIN: 0.5,
  SPEED_MAX: 2.0,
  PITCH_MIN: -10,
  PITCH_MAX: 10,
};

/**
 * 입력 텍스트의 유효성을 검증한다.
 * @param {string} text - 검증할 텍스트
 * @returns {{ valid: boolean, error: string|null }}
 */
function validateText(text) {
  if (!text || text.trim().length < CONSTRAINTS.TEXT_MIN) {
    return { valid: false, error: '입력 텍스트가 비어 있습니다' };
  }
  if (text.length > CONSTRAINTS.TEXT_MAX) {
    return { valid: false, error: '입력 텍스트가 10,000자 제한을 초과합니다' };
  }
  return { valid: true, error: null };
}

/**
 * 속도 파라미터의 유효성을 검증한다.
 * @param {number} speed - 검증할 속도 값 (0.5 ~ 2.0)
 * @returns {{ valid: boolean, error: string|null }}
 */
function validateSpeed(speed) {
  if (speed < CONSTRAINTS.SPEED_MIN || speed > CONSTRAINTS.SPEED_MAX) {
    return { valid: false, error: '속도 값은 0.5에서 2.0 사이여야 합니다' };
  }
  return { valid: true, error: null };
}

/**
 * 음높이 파라미터의 유효성을 검증한다.
 * @param {number} pitch - 검증할 음높이 값 (-10 ~ +10)
 * @returns {{ valid: boolean, error: string|null }}
 */
function validatePitch(pitch) {
  if (pitch < CONSTRAINTS.PITCH_MIN || pitch > CONSTRAINTS.PITCH_MAX) {
    return { valid: false, error: '음높이 값은 -10에서 +10 사이여야 합니다' };
  }
  return { valid: true, error: null };
}

/**
 * 업로드 파일 형식의 유효성을 검증한다.
 * @param {string} filename - 검증할 파일명
 * @returns {{ valid: boolean, error: string|null }}
 */
function validateFileType(filename) {
  if (!filename.toLowerCase().endsWith('.txt')) {
    return { valid: false, error: '텍스트 파일(.txt)만 업로드할 수 있습니다' };
  }
  return { valid: true, error: null };
}

/**
 * 텍스트, 속도, 음높이를 순서대로 검증하고 첫 번째 실패 결과를 반환한다.
 * @param {{ text: string, speed: number, pitch: number }} params
 * @returns {{ valid: boolean, error: string|null }}
 */
function validateAll({ text, speed, pitch }) {
  const textResult = validateText(text);
  if (!textResult.valid) return textResult;

  const speedResult = validateSpeed(speed);
  if (!speedResult.valid) return speedResult;

  const pitchResult = validatePitch(pitch);
  if (!pitchResult.valid) return pitchResult;

  return { valid: true, error: null };
}

// Export for Node.js/Jest testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONSTRAINTS, validateText, validateSpeed, validatePitch, validateFileType, validateAll };
}
