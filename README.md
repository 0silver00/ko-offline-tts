# ko-offline-tts
An offline, high-quality Korean Text-to-Speech (TTS) application using VITS-Mimic3

# 🔊 TTS Generator - 오프라인 한국어 음성 생성기

![Platform](https://img.shields.io/badge/platform-Windows%20x64-lightgrey)
![Environment](https://img.shields.io/badge/environment-100%25%20Offline%20(WASM)-success)
![License](https://img.shields.io/badge/license-Apache%202.0%20%2F%20CC%20BY--SA%204.0-blue)

인터넷 연결이 전혀 없는 환경(폐쇄망, 보안 환경 등)에서도 **추가 다운로드나 파이썬 설치 과정 없이** 압축만 풀면 브라우저 내에서 즉시 고품질 한국어 음성을 생성할 수 있는 완벽한 독립형(Portable) 웹 애플리케이션입니다.

`python/` 폴더 내에 Python 3.14 Embeddable 버전이 내장되어 있어 환경 변수 설정이나 패키지 설치가 필요 없으며, **sherpa-onnx WASM** 기술을 이용해 모든 음성 합성 연산이 서버가 아닌 사용자의 브라우저 내부에서 안전하고 빠르게 처리됩니다. USB에 복사하여 다른 PC로 이동해도 즉시 실행 가능합니다.

---

## ✨ 주요 특징 (Key Features)

* **🚀 무설치 원클릭 구동:** 사용자 PC에 파이썬이 없어도 작동합니다. 배치 파일 실행 시 내장 런타임으로 로컬 서버를 가볍게 구동합니다.
* **🌐 100% 브라우저 로컬 연산 (WASM):** `sherpa-onnx WASM` 엔진을 채택하여, 서버 측 부하 없이 브라우저 자체의 자원으로 완벽한 오프라인 음성 합성을 수행합니다.
* **🎵 내장 MP3 다운로드:** `lamejs` 인코더가 브라우저 내에 빌트인되어 있어, 생성된 한국어 음성을 즉시 재생하고 고음질 MP3 파일로 안전하게 저장할 수 있습니다.
* **🔒 완벽한 오프라인 & 포터블:** 외부 네트워크 연결이나 API 호출이 일절 없어 데이터 유출 우려가 없으며, 보안이 중요한 환경에 최적화되어 있습니다.

---

## 🛠️ 배포 및 폴더 구조 (Project Structure)

배포 패키지(`offline-korean-tts/`)는 개발용 파일(`node_modules/`, `__tests__/`, `package.json` 등)을 제외하고 오직 실행에 필수적인 최적의 핵심 파일들로만 컴팩트하게 구성되어 있습니다.

```text
offline-korean-tts/
├── assets/                     # 🌐 핵심 엔진 (JS/CSS 및 sherpa-onnx WASM 라이브러리)
├── models/                     # 🗣️ 한국어 음성 합성 모델 (ko_KO-kss_low)
├── python/                     # 🐍 무설치 구동용 Python 3.14 Embeddable 내장 런타임
├── index.html                  # 🖥️ 사용자 친화적인 TTS 조작 웹 애플리케이션 화면
├── server.py                   # 📡 정적 파일 서빙 및 로컬 웹 서버 구동 스크립트
├── start.bat                   # 🚀 메인 실행 파일
├── tts-icon.ico                # 🎨 바로가기 생성용 마이크 아이콘 파일
└── README.txt                  # 📄 오프라인 사용자를 위한 텍스트 설명서
