# ko-offline-tts
An offline, high-quality Korean Text-to-Speech (TTS) application using VITS-Mimic3

# 🔊 Sherpa-Onnx Korean TTS Portable (Web UI)

![License](https://img.shields.io/badge/license-Apache--2.0%20%2F%20CC--BY--SA--4.0-blue)
![Platform](https://img.shields.io/badge/platform-Windows%20x64-lightgrey)
![Environment](https://img.shields.io/badge/environment-100%25%20Offline-success)

인터넷 연결이 불가능한 폐쇄망, 보안 환경, 야외에서도 **다운로드 및 설치 과정 없이 즉시 실행 가능한** 완벽한 패키지형 한국어 오프라인 TTS(Text-to-Speech) 프로그램입니다. 

Next-Gen Kaldi의 `sherpa-onnx` 엔진과 고품질 VITS 한국어 모델을 내장하고 있으며, 실행 즉시 로컬 웹 서버가 구동되어 직관적인 웹 브라우저 화면에서 음성을 합성할 수 있습니다.

---

## ✨ 주요 특징 (Key Features)

* **🚀 무설치 원클릭 실행:** 파이썬(Python)을 설치할 필요가 없습니다. 내장된 임베디드 파이썬 환경으로 구동됩니다.
* **🔒 100% 완전 오프라인:** 모델 파일, 라이브러리가 모두 패키지화되어 있어 어떠한 외부 다운로드나 네트워크 연결도 요구하지 않습니다.
* **🌐 웹 UI 제공:** 배치 파일 실행 시 로컬 서버가 구동되며, 누구나 쉽게 쓸 수 있는 웹 브라우저 인터페이스가 제공됩니다.
* **🗣️ 자연스러운 한국어:** KSS 데이터셋 기반으로 최적화된 온디바이스(On-device)용 VITS 모델을 활용하여 기계음 같지 않은 자연스러운 발음을 구현합니다.

---

## 🛠️ 폴더 구조 (Project Structure)

본 프로그램은 외부 다운로드나 추가 설치 없이 즉시 실행 가능한 독립형(Portable) 구조로 패키징되어 있습니다.

```text
├── assets/                     # 웹 UI(인터페이스) 구성에 필요한 리소스 파일
├── models/                     # 완전히 내장된 sherpa-onnx 한국어 TTS 모델 파일
├── python/                     # 무설치 구동을 위한 임베디드 파이썬 런타임 환경
├── index.html                  # 사용자가 접속하여 TTS를 조작하는 로컬 웹 화면
├── server.py                   # sherpa-onnx 엔진을 구동하고 API를 제공하는 백엔드 서버
├── start.bat                   # 🚀 로컬 웹 서버 구동 및 웹 브라우저 자동 실행 배치 파일
├── README.txt                  # 오프라인 사용자를 위한 텍스트 설명서
└── tts-icon.ico                # 프로그램 및 웹 타이틀에 사용되는 아이콘 파일
