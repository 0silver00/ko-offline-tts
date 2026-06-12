/**
 * app.js
 * 메인 앱 로직 - 상태 머신 및 핵심 합성 로직
 * Requirements: 1.3, 1.4, 3.6, 5.6, 7.1, 7.2, 7.3, 7.5
 */

// ─── 앱 상태 정의 ───────────────────────────────────────────
const AppState = {
  LOADING: 'LOADING',
  READY: 'READY',
  SYNTHESIZING: 'SYNTHESIZING',
  DONE: 'DONE',
  ERROR: 'ERROR',
};

let currentState = null;
let currentBlobUrl = null;
let currentMp3Blob = null;

// ─── DOM 요소 캐싱 ──────────────────────────────────────────
const dom = {
  get textInput() { return document.getElementById('text-input'); },
  get charCount() { return document.getElementById('char-count'); },
  get fileUpload() { return document.getElementById('file-upload'); },
  get filenameInput() { return document.getElementById('filename-input'); },
  get speedSlider() { return document.getElementById('speed-slider'); },
  get speedInput() { return document.getElementById('speed-input'); },
  get pitchSlider() { return document.getElementById('pitch-slider'); },
  get pitchInput() { return document.getElementById('pitch-input'); },
  get synthesizeBtn() { return document.getElementById('synthesize-btn'); },
  get statusMessage() { return document.getElementById('status-message'); },
  get audioPlayer() { return document.getElementById('audio-player'); },
  get playerBar() { return document.getElementById('player-bar'); },
  get downloadBtn() { return document.getElementById('download-btn'); },
  get speedValue() { return document.getElementById('speed-value'); },
  get pitchValue() { return document.getElementById('pitch-value'); },
};

// ─── 상태 머신 ──────────────────────────────────────────────

/**
 * 앱 상태를 전환하고 UI를 업데이트한다.
 * @param {string} state - AppState 중 하나
 */
function setAppState(state) {
  currentState = state;

  switch (state) {
    case AppState.LOADING:
      dom.synthesizeBtn.disabled = true;
      dom.downloadBtn.disabled = true;
      if (dom.playerBar) dom.playerBar.hidden = true;
      showStatus('모델 로딩 중...', 'info');
      break;

    case AppState.READY:
      dom.synthesizeBtn.disabled = false;
      dom.synthesizeBtn.textContent = '✦ Generate (음성 생성)';
      dom.downloadBtn.disabled = true;
      if (dom.playerBar) dom.playerBar.hidden = true;
      break;

    case AppState.SYNTHESIZING:
      dom.synthesizeBtn.disabled = true;
      dom.synthesizeBtn.textContent = '⏳ 생성 중...';
      showStatus('🔊 음성 생성 중 — "응답 없는 페이지" 팝업이 뜨면 [대기] 버튼을 눌러주세요. 정상 처리 중입니다.', 'info');
      break;

    case AppState.DONE:
      dom.synthesizeBtn.disabled = false;
      dom.synthesizeBtn.textContent = '✦ Generate (음성 생성)';
      dom.downloadBtn.disabled = false;
      if (dom.playerBar) {
        dom.playerBar.hidden = false;
        dom.audioPlayer.hidden = false;
        var placeholder = document.getElementById('audio-placeholder');
        if (placeholder) placeholder.hidden = true;
      }
      showStatus('합성 완료', 'success');
      break;

    case AppState.ERROR:
      dom.synthesizeBtn.disabled = false;
      dom.synthesizeBtn.textContent = '✦ Generate (음성 생성)';
      dom.downloadBtn.disabled = true;
      break;
  }
}

// ─── 상태 메시지 표시 ────────────────────────────────────────

/**
 * 상태 메시지 영역의 내용과 CSS 클래스를 업데이트한다.
 * @param {string} message - 표시할 메시지
 * @param {string} type - 'info' | 'success' | 'error'
 */
function showStatus(message, type) {
  const el = dom.statusMessage;
  el.textContent = message;
  // 기존 상태 클래스 제거
  el.classList.remove('status-info', 'status-success', 'status-error');
  // 새 상태 클래스 추가
  if (type === 'info') {
    el.classList.add('status-info');
  } else if (type === 'success') {
    el.classList.add('status-success');
  } else if (type === 'error') {
    el.classList.add('status-error');
  }
}

// ─── 다운로드 파일명 생성 ────────────────────────────────────

/**
 * 다운로드 파일명을 반환한다.
 * filename-input 값이 있으면 "{name}.mp3", 없으면 "output.mp3"
 * @returns {string}
 */
function getDownloadFilename() {
  const name = dom.filenameInput.value.trim();
  if (name) {
    return name + '.mp3';
  }
  return CONFIG.DEFAULT_FILENAME + '.mp3';
}

// ─── 재생 설정 ───────────────────────────────────────────────

/**
 * 오디오 플레이어에 Blob URL을 설정하고, 다운로드 정보를 저장한다.
 * @param {string} blobUrl - 오디오 Blob URL
 * @param {Blob} mp3Blob - MP3 Blob 객체
 */
function setupPlayback(blobUrl, mp3Blob) {
  // 이전 Blob URL 해제
  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl);
  }
  currentBlobUrl = blobUrl;
  currentMp3Blob = mp3Blob;
  dom.audioPlayer.src = blobUrl;
}

// ─── 핵심 합성 로직 ──────────────────────────────────────────

/**
 * 텍스트를 음성으로 합성하는 비동기 함수.
 * 중앙화된 오류 처리 패턴을 구현한다.
 */
async function synthesize() {
  setAppState(AppState.SYNTHESIZING);

  try {
    const text = dom.textInput.value;
    const speed = parseFloat(dom.speedInput.value);
    const pitch = dom.pitchInput ? parseInt(dom.pitchInput.value, 10) : 0;

    // 입력 유효성 검증
    const validation = validateAll({ text, speed, pitch });
    if (!validation.valid) {
      showStatus(validation.error, 'error');
      setAppState(AppState.READY);
      return;
    }

    // TTS 엔진으로 합성 (UI 업데이트를 위해 한 프레임 양보)
    await new Promise(function(resolve) { setTimeout(resolve, 50); });

    var speakerSelect = document.getElementById('speaker-select');
    var sid = speakerSelect ? parseInt(speakerSelect.value, 10) : 0;
    const result = await ttsEngine.generate({ text, speed, sid: sid });

    // PCM 유효성 검사
    if (result.samples.some(s => !isFinite(s))) {
      throw new Error('PCM_Buffer에 유효하지 않은 값이 포함되어 있습니다');
    }

    // MP3 인코딩
    const mp3Blob = encode(result);
    const blobUrl = URL.createObjectURL(mp3Blob);

    // 재생 설정
    setupPlayback(blobUrl, mp3Blob);
    setAppState(AppState.DONE);

  } catch (err) {
    showStatus('엔진 오류: ' + err.message, 'error');
    setAppState(AppState.ERROR);
  }
}

// ─── 다운로드 핸들러 ─────────────────────────────────────────

/**
 * MP3 파일 다운로드를 실행한다.
 * <a> 태그 동적 생성 및 click() 후 URL.revokeObjectURL 호출.
 */
function downloadMp3() {
  if (!currentBlobUrl || !currentMp3Blob) return;

  const a = document.createElement('a');
  a.href = currentBlobUrl;
  a.download = getDownloadFilename();
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(currentBlobUrl);
  currentBlobUrl = null;
}

// ─── 슬라이더 ↔ 숫자 필드 양방향 동기화 ─────────────────────

/**
 * 슬라이더와 숫자 입력 필드를 양방향으로 동기화한다.
 * - 슬라이더 input 이벤트 → 숫자 필드 값 동기화
 * - 숫자 필드 change 이벤트 → 유효성 검사 후 슬라이더 값 동기화 (범위 초과 시 클리핑)
 * @param {string} sliderId - 슬라이더 요소 ID
 * @param {string} inputId - 숫자 입력 필드 요소 ID
 * @param {function} validator - 유효성 검사 함수 (숫자 → { valid, error })
 */
function syncControls(sliderId, inputId, validator) {
  const slider = document.getElementById(sliderId);
  const input = document.getElementById(inputId);

  slider.addEventListener('input', () => {
    input.value = slider.value;
  });

  input.addEventListener('change', () => {
    const result = validator(parseFloat(input.value));
    if (result.valid) {
      slider.value = input.value;
    } else {
      // 범위 클리핑
      input.value = Math.max(parseFloat(slider.min), Math.min(parseFloat(slider.max), parseFloat(input.value)));
      slider.value = input.value;
    }
  });
}

// ─── 파일 업로드 핸들러 ──────────────────────────────────────

/**
 * 파일 업로드 change 이벤트 핸들러.
 * .txt 파일만 허용하고 FileReader로 UTF-8 읽기 후 텍스트 입력에 반영한다.
 * @param {Event} event - change 이벤트
 */
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const result = validateFileType(file.name);
  if (!result.valid) {
    showStatus(result.error, 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    dom.textInput.value = e.target.result;
    updateCharCount();
  };
  reader.onerror = function () {
    showStatus('파일 읽기 오류가 발생했습니다', 'error');
  };
  reader.readAsText(file, 'UTF-8');
}

// ─── 글자 수 업데이트 ────────────────────────────────────────

/**
 * #char-count 요소를 현재 텍스트 입력 길이로 업데이트한다.
 */
function updateCharCount() {
  dom.charCount.textContent = dom.textInput.value.length;
}

// ─── 초기화 ──────────────────────────────────────────────────

/**
 * DOMContentLoaded 시 엔진 초기화 및 이벤트 바인딩
 */
document.addEventListener('DOMContentLoaded', async function () {
  // 초기 상태 설정
  setAppState(AppState.LOADING);

  // 이벤트 바인딩
  dom.synthesizeBtn.addEventListener('click', synthesize);
  dom.downloadBtn.addEventListener('click', downloadMp3);

  // 슬라이더 ↔ 숫자 필드 양방향 동기화
  syncControls('speed-slider', 'speed-input', validateSpeed);
  if (document.getElementById('pitch-slider') && document.getElementById('pitch-input')) {
    syncControls('pitch-slider', 'pitch-input', validatePitch);
  }

  // 슬라이더 값 표시 동기화
  dom.speedSlider.addEventListener('input', function() {
    if (dom.speedValue) dom.speedValue.textContent = dom.speedSlider.value;
  });
  if (dom.pitchSlider) {
    dom.pitchSlider.addEventListener('input', function() {
      if (dom.pitchValue) dom.pitchValue.textContent = dom.pitchSlider.value;
    });
  }

  // 파일 업로드 이벤트
  dom.fileUpload.addEventListener('change', handleFileUpload);

  // 텍스트 입력 시 글자 수 업데이트
  dom.textInput.addEventListener('input', updateCharCount);

  // TTS 엔진 초기화
  try {
    await ttsEngine.init(function onProgress(msg) {
      showStatus(msg, 'info');
    });
    setAppState(AppState.READY);
    showStatus('준비 완료', 'success');
  } catch (err) {
    showStatus('엔진 오류: ' + err.message, 'error');
    setAppState(AppState.ERROR);
  }
});

// ─── Export for Node.js/Jest testing ─────────────────────────
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AppState,
    setAppState,
    showStatus,
    getDownloadFilename,
    setupPlayback,
    synthesize,
    downloadMp3,
    syncControls,
    handleFileUpload,
    updateCharCount,
  };
}
