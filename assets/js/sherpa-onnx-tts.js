/**
 * sherpa-onnx-tts.js
 * JavaScript wrapper for sherpa-onnx WASM TTS C API
 * Adapted from https://github.com/k2-fsa/sherpa-onnx/blob/master/wasm/tts/sherpa-onnx-tts.js
 */

function freeConfig(config, Module) {
  if ('buffer' in config) Module._free(config.buffer);
  if ('config' in config) freeConfig(config.config, Module);
  if ('matcha' in config) freeConfig(config.matcha, Module);
  if ('kokoro' in config) freeConfig(config.kokoro, Module);
  if ('kitten' in config) freeConfig(config.kitten, Module);
  if ('zipvoice' in config) freeConfig(config.zipvoice, Module);
  if ('pocket' in config) freeConfig(config.pocket, Module);
  if ('supertonic' in config) freeConfig(config.supertonic, Module);
  if (config.ptr) Module._free(config.ptr);
}

function initSherpaOnnxOfflineTtsVitsModelConfig(config, Module) {
  const modelLen = Module.lengthBytesUTF8(config.model || '') + 1;
  const lexiconLen = Module.lengthBytesUTF8(config.lexicon || '') + 1;
  const tokensLen = Module.lengthBytesUTF8(config.tokens || '') + 1;
  const dataDirLen = Module.lengthBytesUTF8(config.dataDir || '') + 1;
  const dictDir = '';
  const dictDirLen = Module.lengthBytesUTF8(dictDir) + 1;

  const n = modelLen + lexiconLen + tokensLen + dataDirLen + dictDirLen;
  const buffer = Module._malloc(n);
  const len = 8 * 4;
  const ptr = Module._malloc(len);

  let offset = 0;
  Module.stringToUTF8(config.model || '', buffer + offset, modelLen);
  offset += modelLen;
  Module.stringToUTF8(config.lexicon || '', buffer + offset, lexiconLen);
  offset += lexiconLen;
  Module.stringToUTF8(config.tokens || '', buffer + offset, tokensLen);
  offset += tokensLen;
  Module.stringToUTF8(config.dataDir || '', buffer + offset, dataDirLen);
  offset += dataDirLen;
  Module.stringToUTF8(dictDir, buffer + offset, dictDirLen);
  offset += dictDirLen;

  offset = 0;
  Module.setValue(ptr, buffer + offset, 'i8*');
  offset += modelLen;
  Module.setValue(ptr + 4, buffer + offset, 'i8*');
  offset += lexiconLen;
  Module.setValue(ptr + 8, buffer + offset, 'i8*');
  offset += tokensLen;
  Module.setValue(ptr + 12, buffer + offset, 'i8*');
  offset += dataDirLen;
  Module.setValue(ptr + 16, config.noiseScale || 0.667, 'float');
  Module.setValue(ptr + 20, config.noiseScaleW || 0.8, 'float');
  Module.setValue(ptr + 24, config.lengthScale || 1.0, 'float');
  Module.setValue(ptr + 28, buffer + offset, 'i8*');
  offset += dictDirLen;

  return { buffer, ptr, len };
}

function initSherpaOnnxOfflineTtsMatchaModelConfig(config, Module) {
  const acousticModelLen = Module.lengthBytesUTF8(config.acousticModel || '') + 1;
  const vocoderLen = Module.lengthBytesUTF8(config.vocoder || '') + 1;
  const lexiconLen = Module.lengthBytesUTF8(config.lexicon || '') + 1;
  const tokensLen = Module.lengthBytesUTF8(config.tokens || '') + 1;
  const dataDirLen = Module.lengthBytesUTF8(config.dataDir || '') + 1;
  const dictDir = '';
  const dictDirLen = Module.lengthBytesUTF8(dictDir) + 1;

  const n = acousticModelLen + vocoderLen + lexiconLen + tokensLen + dataDirLen + dictDirLen;
  const buffer = Module._malloc(n);
  const len = 8 * 4;
  const ptr = Module._malloc(len);

  let offset = 0;
  Module.stringToUTF8(config.acousticModel || '', buffer + offset, acousticModelLen); offset += acousticModelLen;
  Module.stringToUTF8(config.vocoder || '', buffer + offset, vocoderLen); offset += vocoderLen;
  Module.stringToUTF8(config.lexicon || '', buffer + offset, lexiconLen); offset += lexiconLen;
  Module.stringToUTF8(config.tokens || '', buffer + offset, tokensLen); offset += tokensLen;
  Module.stringToUTF8(config.dataDir || '', buffer + offset, dataDirLen); offset += dataDirLen;
  Module.stringToUTF8(dictDir, buffer + offset, dictDirLen); offset += dictDirLen;

  offset = 0;
  Module.setValue(ptr, buffer + offset, 'i8*'); offset += acousticModelLen;
  Module.setValue(ptr + 4, buffer + offset, 'i8*'); offset += vocoderLen;
  Module.setValue(ptr + 8, buffer + offset, 'i8*'); offset += lexiconLen;
  Module.setValue(ptr + 12, buffer + offset, 'i8*'); offset += tokensLen;
  Module.setValue(ptr + 16, buffer + offset, 'i8*'); offset += dataDirLen;
  Module.setValue(ptr + 20, config.noiseScale || 0.667, 'float');
  Module.setValue(ptr + 24, config.lengthScale || 1.0, 'float');
  Module.setValue(ptr + 28, buffer + offset, 'i8*'); offset += dictDirLen;

  return { buffer, ptr, len };
}

function initSherpaOnnxOfflineTtsKokoroModelConfig(config, Module) {
  const modelLen = Module.lengthBytesUTF8(config.model || '') + 1;
  const voicesLen = Module.lengthBytesUTF8(config.voices || '') + 1;
  const tokensLen = Module.lengthBytesUTF8(config.tokens || '') + 1;
  const dataDirLen = Module.lengthBytesUTF8(config.dataDir || '') + 1;
  const dictDir = '';
  const dictDirLen = Module.lengthBytesUTF8(dictDir) + 1;
  const lexiconLen = Module.lengthBytesUTF8(config.lexicon || '') + 1;
  const langLen = Module.lengthBytesUTF8(config.lang || '') + 1;

  const n = modelLen + voicesLen + tokensLen + dataDirLen + dictDirLen + lexiconLen + langLen;
  const buffer = Module._malloc(n);
  const len = 8 * 4;
  const ptr = Module._malloc(len);

  let offset = 0;
  Module.stringToUTF8(config.model || '', buffer + offset, modelLen); offset += modelLen;
  Module.stringToUTF8(config.voices || '', buffer + offset, voicesLen); offset += voicesLen;
  Module.stringToUTF8(config.tokens || '', buffer + offset, tokensLen); offset += tokensLen;
  Module.stringToUTF8(config.dataDir || '', buffer + offset, dataDirLen); offset += dataDirLen;
  Module.stringToUTF8(dictDir, buffer + offset, dictDirLen); offset += dictDirLen;
  Module.stringToUTF8(config.lexicon || '', buffer + offset, lexiconLen); offset += lexiconLen;
  Module.stringToUTF8(config.lang || '', buffer + offset, langLen); offset += langLen;

  offset = 0;
  Module.setValue(ptr, buffer + offset, 'i8*'); offset += modelLen;
  Module.setValue(ptr + 4, buffer + offset, 'i8*'); offset += voicesLen;
  Module.setValue(ptr + 8, buffer + offset, 'i8*'); offset += tokensLen;
  Module.setValue(ptr + 12, buffer + offset, 'i8*'); offset += dataDirLen;
  Module.setValue(ptr + 16, config.lengthScale || 1.0, 'float');
  Module.setValue(ptr + 20, buffer + offset, 'i8*'); offset += dictDirLen;
  Module.setValue(ptr + 24, buffer + offset, 'i8*'); offset += lexiconLen;
  Module.setValue(ptr + 28, buffer + offset, 'i8*'); offset += langLen;

  return { buffer, ptr, len };
}

function initSherpaOnnxOfflineTtsKittenModelConfig(config, Module) {
  const modelLen = Module.lengthBytesUTF8(config.model || '') + 1;
  const voicesLen = Module.lengthBytesUTF8(config.voices || '') + 1;
  const tokensLen = Module.lengthBytesUTF8(config.tokens || '') + 1;
  const dataDirLen = Module.lengthBytesUTF8(config.dataDir || '') + 1;
  const n = modelLen + voicesLen + tokensLen + dataDirLen;
  const buffer = Module._malloc(n);
  const len = 5 * 4;
  const ptr = Module._malloc(len);
  let offset = 0;
  Module.stringToUTF8(config.model || '', buffer + offset, modelLen); offset += modelLen;
  Module.stringToUTF8(config.voices || '', buffer + offset, voicesLen); offset += voicesLen;
  Module.stringToUTF8(config.tokens || '', buffer + offset, tokensLen); offset += tokensLen;
  Module.stringToUTF8(config.dataDir || '', buffer + offset, dataDirLen); offset += dataDirLen;
  offset = 0;
  Module.setValue(ptr, buffer + offset, 'i8*'); offset += modelLen;
  Module.setValue(ptr + 4, buffer + offset, 'i8*'); offset += voicesLen;
  Module.setValue(ptr + 8, buffer + offset, 'i8*'); offset += tokensLen;
  Module.setValue(ptr + 12, buffer + offset, 'i8*'); offset += dataDirLen;
  Module.setValue(ptr + 16, config.lengthScale || 1.0, 'float');
  return { buffer, ptr, len };
}

function initSherpaOnnxOfflineTtsZipVoiceModelConfig(config, Module) {
  const tokensLen = Module.lengthBytesUTF8(config.tokens || '') + 1;
  const encoderLen = Module.lengthBytesUTF8(config.encoder || '') + 1;
  const decoderLen = Module.lengthBytesUTF8(config.decoder || '') + 1;
  const vocoderLen = Module.lengthBytesUTF8(config.vocoder || '') + 1;
  const dataDirLen = Module.lengthBytesUTF8(config.dataDir || '') + 1;
  const lexiconLen = Module.lengthBytesUTF8(config.lexicon || '') + 1;
  const n = tokensLen + encoderLen + decoderLen + vocoderLen + dataDirLen + lexiconLen;
  const buffer = Module._malloc(n);
  const len = 10 * 4;
  const ptr = Module._malloc(len);
  let offset = 0;
  Module.stringToUTF8(config.tokens || '', buffer + offset, tokensLen); offset += tokensLen;
  Module.stringToUTF8(config.encoder || '', buffer + offset, encoderLen); offset += encoderLen;
  Module.stringToUTF8(config.decoder || '', buffer + offset, decoderLen); offset += decoderLen;
  Module.stringToUTF8(config.vocoder || '', buffer + offset, vocoderLen); offset += vocoderLen;
  Module.stringToUTF8(config.dataDir || '', buffer + offset, dataDirLen); offset += dataDirLen;
  Module.stringToUTF8(config.lexicon || '', buffer + offset, lexiconLen); offset += lexiconLen;
  offset = 0;
  Module.setValue(ptr, buffer + offset, 'i8*'); offset += tokensLen;
  Module.setValue(ptr + 4, buffer + offset, 'i8*'); offset += encoderLen;
  Module.setValue(ptr + 8, buffer + offset, 'i8*'); offset += decoderLen;
  Module.setValue(ptr + 12, buffer + offset, 'i8*'); offset += vocoderLen;
  Module.setValue(ptr + 16, buffer + offset, 'i8*'); offset += dataDirLen;
  Module.setValue(ptr + 20, buffer + offset, 'i8*'); offset += lexiconLen;
  Module.setValue(ptr + 24, config.featScale || 0.1, 'float');
  Module.setValue(ptr + 28, config.tShift || 0.5, 'float');
  Module.setValue(ptr + 32, config.targetRMS || 0.1, 'float');
  Module.setValue(ptr + 36, config.guidanceScale || 1.0, 'float');
  return { buffer, ptr, len };
}

function initSherpaOnnxOfflineTtsPocketModelConfig(config, Module) {
  const lmFlowLen = Module.lengthBytesUTF8(config.lmFlow || '') + 1;
  const lmMainLen = Module.lengthBytesUTF8(config.lmMain || '') + 1;
  const encoderLen = Module.lengthBytesUTF8(config.encoder || '') + 1;
  const decoderLen = Module.lengthBytesUTF8(config.decoder || '') + 1;
  const textConditionerLen = Module.lengthBytesUTF8(config.textConditioner || '') + 1;
  const vocabJsonLen = Module.lengthBytesUTF8(config.vocabJson || '') + 1;
  const tokenScoresJsonLen = Module.lengthBytesUTF8(config.tokenScoresJson || '') + 1;
  const n = lmFlowLen + lmMainLen + encoderLen + decoderLen + textConditionerLen + vocabJsonLen + tokenScoresJsonLen;
  const buffer = Module._malloc(n);
  const len = 8 * 4;
  const ptr = Module._malloc(len);
  let offset = 0;
  Module.stringToUTF8(config.lmFlow || '', buffer + offset, lmFlowLen); offset += lmFlowLen;
  Module.stringToUTF8(config.lmMain || '', buffer + offset, lmMainLen); offset += lmMainLen;
  Module.stringToUTF8(config.encoder || '', buffer + offset, encoderLen); offset += encoderLen;
  Module.stringToUTF8(config.decoder || '', buffer + offset, decoderLen); offset += decoderLen;
  Module.stringToUTF8(config.textConditioner || '', buffer + offset, textConditionerLen); offset += textConditionerLen;
  Module.stringToUTF8(config.vocabJson || '', buffer + offset, vocabJsonLen); offset += vocabJsonLen;
  Module.stringToUTF8(config.tokenScoresJson || '', buffer + offset, tokenScoresJsonLen); offset += tokenScoresJsonLen;
  offset = 0;
  Module.setValue(ptr + 0*4, buffer + offset, 'i8*'); offset += lmFlowLen;
  Module.setValue(ptr + 1*4, buffer + offset, 'i8*'); offset += lmMainLen;
  Module.setValue(ptr + 2*4, buffer + offset, 'i8*'); offset += encoderLen;
  Module.setValue(ptr + 3*4, buffer + offset, 'i8*'); offset += decoderLen;
  Module.setValue(ptr + 4*4, buffer + offset, 'i8*'); offset += textConditionerLen;
  Module.setValue(ptr + 5*4, buffer + offset, 'i8*'); offset += vocabJsonLen;
  Module.setValue(ptr + 6*4, buffer + offset, 'i8*'); offset += tokenScoresJsonLen;
  Module.setValue(ptr + 7*4, config.voiceEmbeddingCacheCapacity || 50, 'i32');
  return { buffer, ptr, len };
}

function initSherpaOnnxOfflineTtsSupertonicModelConfig(config, Module) {
  const durationPredictorLen = Module.lengthBytesUTF8(config.durationPredictor || '') + 1;
  const textEncoderLen = Module.lengthBytesUTF8(config.textEncoder || '') + 1;
  const vectorEstimatorLen = Module.lengthBytesUTF8(config.vectorEstimator || '') + 1;
  const vocoderLen = Module.lengthBytesUTF8(config.vocoder || '') + 1;
  const ttsJsonLen = Module.lengthBytesUTF8(config.ttsJson || '') + 1;
  const unicodeIndexerLen = Module.lengthBytesUTF8(config.unicodeIndexer || '') + 1;
  const voiceStyleLen = Module.lengthBytesUTF8(config.voiceStyle || '') + 1;
  const n = durationPredictorLen + textEncoderLen + vectorEstimatorLen + vocoderLen + ttsJsonLen + unicodeIndexerLen + voiceStyleLen;
  const buffer = Module._malloc(n);
  const len = 7 * 4;
  const ptr = Module._malloc(len);
  let offset = 0;
  Module.stringToUTF8(config.durationPredictor || '', buffer + offset, durationPredictorLen); offset += durationPredictorLen;
  Module.stringToUTF8(config.textEncoder || '', buffer + offset, textEncoderLen); offset += textEncoderLen;
  Module.stringToUTF8(config.vectorEstimator || '', buffer + offset, vectorEstimatorLen); offset += vectorEstimatorLen;
  Module.stringToUTF8(config.vocoder || '', buffer + offset, vocoderLen); offset += vocoderLen;
  Module.stringToUTF8(config.ttsJson || '', buffer + offset, ttsJsonLen); offset += ttsJsonLen;
  Module.stringToUTF8(config.unicodeIndexer || '', buffer + offset, unicodeIndexerLen); offset += unicodeIndexerLen;
  Module.stringToUTF8(config.voiceStyle || '', buffer + offset, voiceStyleLen); offset += voiceStyleLen;
  offset = 0;
  Module.setValue(ptr + 0*4, buffer + offset, 'i8*'); offset += durationPredictorLen;
  Module.setValue(ptr + 1*4, buffer + offset, 'i8*'); offset += textEncoderLen;
  Module.setValue(ptr + 2*4, buffer + offset, 'i8*'); offset += vectorEstimatorLen;
  Module.setValue(ptr + 3*4, buffer + offset, 'i8*'); offset += vocoderLen;
  Module.setValue(ptr + 4*4, buffer + offset, 'i8*'); offset += ttsJsonLen;
  Module.setValue(ptr + 5*4, buffer + offset, 'i8*'); offset += unicodeIndexerLen;
  Module.setValue(ptr + 6*4, buffer + offset, 'i8*'); offset += voiceStyleLen;
  return { buffer, ptr, len };
}

function initSherpaOnnxOfflineTtsModelConfig(config, Module) {
  if (!('offlineTtsVitsModelConfig' in config)) config.offlineTtsVitsModelConfig = { model: '', lexicon: '', tokens: '', noiseScale: 0.667, noiseScaleW: 0.8, lengthScale: 1.0, dataDir: '' };
  if (!('offlineTtsMatchaModelConfig' in config)) config.offlineTtsMatchaModelConfig = { acousticModel: '', vocoder: '', lexicon: '', tokens: '', noiseScale: 0.667, lengthScale: 1.0, dataDir: '' };
  if (!('offlineTtsKokoroModelConfig' in config)) config.offlineTtsKokoroModelConfig = { model: '', voices: '', tokens: '', lengthScale: 1.0, dataDir: '', lexicon: '', lang: '' };
  if (!('offlineTtsKittenModelConfig' in config)) config.offlineTtsKittenModelConfig = { model: '', voices: '', tokens: '', lengthScale: 1.0, dataDir: '' };
  if (!('offlineTtsZipVoiceModelConfig' in config)) config.offlineTtsZipVoiceModelConfig = { tokens: '', encoder: '', decoder: '', vocoder: '', dataDir: '', lexicon: '', featScale: 0.1, tShift: 0.5, targetRMS: 0.1, guidanceScale: 1.0 };
  if (!('offlineTtsPocketModelConfig' in config)) config.offlineTtsPocketModelConfig = { lmFlow: '', lmMain: '', encoder: '', decoder: '', textConditioner: '', vocabJson: '', tokenScoresJson: '', voiceEmbeddingCacheCapacity: 50 };
  if (!('offlineTtsSupertonicModelConfig' in config)) config.offlineTtsSupertonicModelConfig = { durationPredictor: '', textEncoder: '', vectorEstimator: '', vocoder: '', ttsJson: '', unicodeIndexer: '', voiceStyle: '' };

  const vitsModelConfig = initSherpaOnnxOfflineTtsVitsModelConfig(config.offlineTtsVitsModelConfig, Module);
  const matchaModelConfig = initSherpaOnnxOfflineTtsMatchaModelConfig(config.offlineTtsMatchaModelConfig, Module);
  const kokoroModelConfig = initSherpaOnnxOfflineTtsKokoroModelConfig(config.offlineTtsKokoroModelConfig, Module);
  const kittenModelConfig = initSherpaOnnxOfflineTtsKittenModelConfig(config.offlineTtsKittenModelConfig, Module);
  const zipVoiceModelConfig = initSherpaOnnxOfflineTtsZipVoiceModelConfig(config.offlineTtsZipVoiceModelConfig, Module);
  const pocketModelConfig = initSherpaOnnxOfflineTtsPocketModelConfig(config.offlineTtsPocketModelConfig, Module);
  const supertonicModelConfig = initSherpaOnnxOfflineTtsSupertonicModelConfig(config.offlineTtsSupertonicModelConfig, Module);

  const len = vitsModelConfig.len + matchaModelConfig.len + kokoroModelConfig.len + kittenModelConfig.len + zipVoiceModelConfig.len + pocketModelConfig.len + supertonicModelConfig.len + 3 * 4;
  const ptr = Module._malloc(len);

  let offset = 0;
  Module._CopyHeap(vitsModelConfig.ptr, vitsModelConfig.len, ptr + offset); offset += vitsModelConfig.len;
  Module.setValue(ptr + offset, config.numThreads || 1, 'i32'); offset += 4;
  Module.setValue(ptr + offset, config.debug || 0, 'i32'); offset += 4;
  const providerLen = Module.lengthBytesUTF8(config.provider || 'cpu') + 1;
  const buffer = Module._malloc(providerLen);
  Module.stringToUTF8(config.provider || 'cpu', buffer, providerLen);
  Module.setValue(ptr + offset, buffer, 'i8*'); offset += 4;
  Module._CopyHeap(matchaModelConfig.ptr, matchaModelConfig.len, ptr + offset); offset += matchaModelConfig.len;
  Module._CopyHeap(kokoroModelConfig.ptr, kokoroModelConfig.len, ptr + offset); offset += kokoroModelConfig.len;
  Module._CopyHeap(kittenModelConfig.ptr, kittenModelConfig.len, ptr + offset); offset += kittenModelConfig.len;
  Module._CopyHeap(zipVoiceModelConfig.ptr, zipVoiceModelConfig.len, ptr + offset); offset += zipVoiceModelConfig.len;
  Module._CopyHeap(pocketModelConfig.ptr, pocketModelConfig.len, ptr + offset); offset += pocketModelConfig.len;
  Module._CopyHeap(supertonicModelConfig.ptr, supertonicModelConfig.len, ptr + offset); offset += supertonicModelConfig.len;

  return { buffer, ptr, len, config: vitsModelConfig, matcha: matchaModelConfig, kokoro: kokoroModelConfig, kitten: kittenModelConfig, zipvoice: zipVoiceModelConfig, pocket: pocketModelConfig, supertonic: supertonicModelConfig };
}

function initSherpaOnnxOfflineTtsConfig(config, Module) {
  const modelConfig = initSherpaOnnxOfflineTtsModelConfig(config.offlineTtsModelConfig, Module);
  const len = modelConfig.len + 4 * 4;
  const ptr = Module._malloc(len);

  let offset = 0;
  Module._CopyHeap(modelConfig.ptr, modelConfig.len, ptr + offset); offset += modelConfig.len;

  const ruleFstsLen = Module.lengthBytesUTF8(config.ruleFsts || '') + 1;
  const ruleFarsLen = Module.lengthBytesUTF8(config.ruleFars || '') + 1;
  const buffer = Module._malloc(ruleFstsLen + ruleFarsLen);
  Module.stringToUTF8(config.ruleFsts || '', buffer, ruleFstsLen);
  Module.stringToUTF8(config.ruleFars || '', buffer + ruleFstsLen, ruleFarsLen);

  Module.setValue(ptr + offset, buffer, 'i8*'); offset += 4;
  Module.setValue(ptr + offset, config.maxNumSentences || 1, 'i32'); offset += 4;
  Module.setValue(ptr + offset, buffer + ruleFstsLen, 'i8*'); offset += 4;
  Module.setValue(ptr + offset, config.silenceScale || 0.2, 'float'); offset += 4;

  return { buffer, ptr, len, config: modelConfig };
}

function initSherpaOnnxGenerationConfig(config, Module) {
  const len = 9 * 4;
  const ptr = Module._malloc(len);
  Module.setValue(ptr + 0*4, config.silenceScale || 0.2, 'float');
  Module.setValue(ptr + 1*4, config.speed || 1.0, 'float');
  Module.setValue(ptr + 2*4, config.sid || 0, 'i32');
  Module.setValue(ptr + 3*4, 0, 'i8*'); // referenceAudio
  Module.setValue(ptr + 4*4, 0, 'i32'); // referenceAudioLen
  Module.setValue(ptr + 5*4, 0, 'i32'); // referenceSampleRate
  Module.setValue(ptr + 6*4, 0, 'i8*'); // referenceText
  Module.setValue(ptr + 7*4, 5, 'i32'); // numSteps
  Module.setValue(ptr + 8*4, 0, 'i8*'); // extra
  return { ptr };
}

function freeSherpaOnnxGenerationConfig(cfg, Module) {
  if (!cfg) return;
  if (cfg.ptr) Module._free(cfg.ptr);
}

class SherpaOnnxOfflineTts {
  constructor(configObj, Module) {
    const config = initSherpaOnnxOfflineTtsConfig(configObj, Module);
    const handle = Module._SherpaOnnxCreateOfflineTts(config.ptr);
    freeConfig(config, Module);
    this.handle = handle;
    this.sampleRate = Module._SherpaOnnxOfflineTtsSampleRate(this.handle);
    this.numSpeakers = Module._SherpaOnnxOfflineTtsNumSpeakers(this.handle);
    this.Module = Module;
  }

  free() {
    if (!this.handle) return;
    this.Module._SherpaOnnxDestroyOfflineTts(this.handle);
    this.handle = 0;
  }

  generate(config) {
    if (!this.handle) throw new Error('OfflineTts has been freed');
    if (!config || !config.text) throw new Error('config.text is required');

    const textLen = this.Module.lengthBytesUTF8(config.text) + 1;
    const textPtr = this.Module._malloc(textLen);
    this.Module.stringToUTF8(config.text, textPtr, textLen);

    const genConfig = { sid: config.sid ?? 0, speed: config.speed ?? 1.0 };
    const cfgWasm = initSherpaOnnxGenerationConfig(genConfig, this.Module);

    const h = this.Module._SherpaOnnxOfflineTtsGenerateWithConfig(this.handle, textPtr, cfgWasm.ptr, 0, 0);
    freeSherpaOnnxGenerationConfig(cfgWasm, this.Module);
    this.Module._free(textPtr);

    if (!h) throw new Error('TTS generation failed');

    const base = h / 4;
    const samplesPtr = this.Module.HEAPU32[base];
    const numSamples = this.Module.HEAP32[base + 1];
    const sampleRate = this.Module.HEAP32[base + 2];
    const heapSamples = this.Module.HEAPF32.subarray(samplesPtr / 4, samplesPtr / 4 + numSamples);
    const samples = new Float32Array(heapSamples);
    this.Module._SherpaOnnxDestroyOfflineTtsGeneratedAudio(h);

    return { samples, sampleRate };
  }
}
