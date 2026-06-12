@echo off
chcp 65001 > nul
echo 오프라인 한국어 TTS 서버를 시작합니다...

:: 1순위: 내장 Python Embeddable
if exist "%~dp0python\python.exe" (
    echo 내장 Python 사용 중...
    start http://localhost:8080
    "%~dp0python\python.exe" "%~dp0server.py"
    goto :end
)

:: 2순위: 시스템 Python
python --version > nul 2>&1
if %errorlevel% == 0 (
    echo 시스템 Python 감지됨. server.py를 실행합니다...
    start http://localhost:8080
    python server.py
    goto :end
)

:: 3순위: Node.js
node --version > nul 2>&1
if %errorlevel% == 0 (
    echo Node.js 감지됨. npx serve를 실행합니다...
    start http://localhost:8080
    npx serve -p 8080 --no-clipboard
    goto :end
)

:: 모두 없는 경우 (정상적으로는 발생하지 않음 - python/ 폴더가 내장되어 있음)
echo [오류] python/ 폴더가 손상되었거나 삭제되었습니다.
echo 패키지를 다시 배포하거나 python/ 폴더를 복원하세요.
pause
:end
