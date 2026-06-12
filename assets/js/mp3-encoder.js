/**
 * mp3-encoder.js
 * MP3_Encoder - lamejs를 사용하여 PCM Float32Array를 MP3 Blob으로 변환한다.
 * Requirements: 3.1, 3.4, 5.8
 */

/**
 * PCM Float32Array를 MP3 Blob으로 인코딩한다.
 * @param {{ samples: Float32Array, sampleRate: number, bitrate?: number }} params
 * @returns {Blob} audio/mpeg Blob
 */
function encode({ samples, sampleRate, bitrate = 128 }) {
  // 1. Float32 → Int16 변환 (스케일링)
  const int16 = new Int16Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    let s = samples[i];
    // NaN/Infinity 처리: 유한하지 않은 값은 0으로 처리
    if (!isFinite(s) || isNaN(s)) {
      s = 0;
    } else {
      // 클리핑 처리
      s = Math.max(-1, Math.min(1, s));
    }
    // 스케일링: 음수는 0x8000, 양수는 0x7FFF
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }

  // 2. lamejs 인코더 초기화 (모노, sampleRate, bitrate)
  const encoder = new lamejs.Mp3Encoder(1, sampleRate, bitrate);
  const mp3Data = [];

  // 3. 1152 샘플씩 청크 처리 (lamejs 권장 크기)
  const CHUNK_SIZE = 1152;
  for (let offset = 0; offset < int16.length; offset += CHUNK_SIZE) {
    const chunk = int16.subarray(offset, offset + CHUNK_SIZE);
    const encoded = encoder.encodeBuffer(chunk);
    if (encoded.length > 0) mp3Data.push(encoded);
  }

  // 4. 플러시 및 Blob 생성
  const flushed = encoder.flush();
  if (flushed.length > 0) mp3Data.push(flushed);

  return new Blob(mp3Data, { type: 'audio/mpeg' });
}

// Export for Node.js/Jest testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { encode };
}
