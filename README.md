# ko-offline-tts
An offline, high-quality Korean Text-to-Speech (TTS) application using VITS-Mimic3

# 🔊 Sherpa-Onnx Supertonic Korean TTS (All-in-One Portable)

![License](https://img.shields.io/badge/license-Apache--2.0-blue)
![Platform](https://img.shields.io/badge/platform-Windows%20x64-lightgrey)
![Environment](https://img.shields.io/badge/environment-100%25%20Offline-success)
![Engine](https://img.shields.io/badge/engine-Sherpa--Onnx--Supertonic-orange)

인터넷 연결이 전혀 불가능한 폐쇄망, 보안 환경, 연구소 등에서도 **다운로드나 파이썬 설치 과정 없이 압축만 풀면 즉시 실행 가능한** 독립 패키지형 한국어 오프라인 TTS(Text-to-Speech) 프로그램입니다.

Next-Gen Kaldi의 최신 `sherpa-onnx` 엔진과 **차세대 고성능 모델인 `Supertonic-int8` 한국어 음성 모델**을 완벽하게 내장하고 있습니다. 실행 즉시 로컬 웹 서버가 구동되며, 직관적인 웹 UI를 통해 마우스 클릭 몇 번으로 부드럽고 자연스러운 한국어 음성을 생성할 수 있습니다.

---

## ✨ 주요 특징 (Key Features)

* **🚀 무설치 원클릭 실행 (`Start.bat`):** 사용자의 컴퓨터에 파이썬(Python)이 설치되어 있지 않아도 괜찮습니다. 내장된 임베디드 파이썬 런타임 환경으로 독립 구동됩니다.
* **🔒 100% 완전 오프라인:** 모델 파싱 및 라이브러리가 모두 패키지 내에 사전 빌드되어 있어, 실행 시 어떠한 외부 다운로드나 네트워크 연결도 요구하지 않습니다.
* **⚡ 최신 Supertonic int8 모델 내장:** 기존 VITS 모델 대비 더욱 인간에 가까운 자연스러운 한국어 억양을 제공하며, INT8 양자화 적용으로 저사양 로컬 PC에서도 딜레이 없이 가볍고 빠르게 음성을 합성합니다.
* **🌐 편리한 웹 인터페이스 (Web UI):** 배치를 실행하면 자동으로 로컬 웹 서버가 켜지며 익숙한 웹 브라우저 창에서 간편하게 텍스트를 음성으로 변환할 수 있습니다.

---

## 🛠️ 폴더 구조 (Project Structure)

배포 파일은 군더더기 없이 최적의 런타임 파일로만 압축되어 있습니다.

```text
├── assets/                     # 웹 UI(인터페이스) 구성에 필요한 리소스 파일
├── models/                     # 완전히 내장된 최신 Supertonic-int8 한국어 TTS 모델 파일
├── python/                     # 무설치 구동을 위한 임베디드 파이썬(python-3.14.5) 런타임
├── index.html                  # 사용자가 접속하여 TTS를 조작하는 로컬 웹 화면
├── server.py                   # sherpa-onnx 엔진을 구동하고 API를 제공하는 백엔드 서버
├── start.bat                   # 🚀 로컬 웹 서버 구동 및 웹 브라우저 자동 실행 배치 파일
├── README.txt                  # 오프라인 사용자를 위한 텍스트 가이드 설명서
└── tts-icon.ico                # 프로그램 및 웹 타이틀에 사용되는 아이콘 파일
