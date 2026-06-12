/**
 * tts-engine.js
 * Wasm_Engine - sherpa-onnx WebAssembly TTS 엔진 래퍼
 * Supertonic 3 한국어 모델을 fetch하여 wasm 가상 파일시스템에 로드
 * Requirements: 1.1, 1.2, 1.3, 1.4, 5.1, 5.6, 5.7
 */

const ttsEngine = (function () {
  let tts = null;
  let wasmModule = null;

  async function init(onProgress) {
    onProgress('모델 로딩 중...');

    // Wait for wasm module to be available (loaded via ES module in index.html)
    if (!window.SherpaOnnxModule) {
      await new Promise(function(resolve) {
        window.addEventListener('sherpa-onnx-ready', resolve, { once: true });
      });
    }

    onProgress('Supertonic 모델 다운로드 중...');

    // Fetch all Supertonic model files from local server
    var modelFiles = [
      { path: 'models/duration_predictor.int8.onnx', name: '/duration_predictor.int8.onnx' },
      { path: 'models/text_encoder.int8.onnx', name: '/text_encoder.int8.onnx' },
      { path: 'models/vector_estimator.int8.onnx', name: '/vector_estimator.int8.onnx' },
      { path: 'models/vocoder.int8.onnx', name: '/vocoder.int8.onnx' },
      { path: 'models/tts.json', name: '/tts.json' },
      { path: 'models/unicode_indexer.bin', name: '/unicode_indexer.bin' },
      { path: 'models/voice.bin', name: '/voice.bin' },
    ];

    var fileDataArray = await Promise.all(modelFiles.map(function(f) {
      return fetch(f.path).then(function(r) {
        if (!r.ok) throw new Error('모델 파일을 찾을 수 없습니다: ' + f.path);
        return r.arrayBuffer();
      });
    }));

    // Convert to Uint8Array
    var fileBuffers = fileDataArray.map(function(buf) {
      return new Uint8Array(buf);
    });

    onProgress('WASM 엔진 초기화 중...');

    // Load the wasm Module, injecting model files via preRun
    const Module = await window.SherpaOnnxModule({
      locateFile: function(file) {
        return 'assets/wasm/' + file;
      },
      preRun: [function(mod) {
        // Write Supertonic model files into the virtual filesystem
        for (var i = 0; i < modelFiles.length; i++) {
          mod['FS_createDataFile']('/', modelFiles[i].name.substring(1), fileBuffers[i], true, true, true);
        }
      }]
    });

    wasmModule = Module;

    onProgress('TTS 엔진 생성 중...');

    // Create OfflineTts with Supertonic config
    var offlineTtsConfig = {
      offlineTtsModelConfig: {
        offlineTtsSupertonicModelConfig: {
          durationPredictor: '/duration_predictor.int8.onnx',
          textEncoder: '/text_encoder.int8.onnx',
          vectorEstimator: '/vector_estimator.int8.onnx',
          vocoder: '/vocoder.int8.onnx',
          ttsJson: '/tts.json',
          unicodeIndexer: '/unicode_indexer.bin',
          voiceStyle: '/voice.bin',
        },
        numThreads: 1,
        debug: 1,
        provider: 'cpu',
      },
      ruleFsts: '',
      ruleFars: '',
      maxNumSentences: 1,
    };

    tts = new SherpaOnnxOfflineTts(offlineTtsConfig, Module);

    if (!tts.handle) {
      throw new Error('TTS 엔진 생성에 실패했습니다. 모델 파일을 확인하세요.');
    }

    console.log('Supertonic 3 TTS 모델 로드 완료 (sampleRate:', tts.sampleRate, ', speakers:', tts.numSpeakers, ')');
    onProgress('준비 완료');
  }

  async function generate(params) {
    var text = params.text;
    var speed = params.speed;
    var sid = params.sid || 0;
    if (!tts) throw new Error('엔진이 초기화되지 않았습니다');
    var result = tts.generate({ text: text, sid: sid, speed: speed || 1.0 });
    return {
      samples: result.samples,
      sampleRate: result.sampleRate
    };
  }

  function isReady() {
    return tts !== null;
  }

  return { init: init, generate: generate, isReady: isReady };
})();

// Export for Node.js/Jest testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ttsEngine;
}
