@echo off
echo ===================================================
echo   PharmaCode Android APK Builder (Low-RAM 2GB Mode)
echo ===================================================
echo.
echo Setting memory JVM flags (-Xmx2048m -XX:MaxMetaspaceSize=512m)...
set _JAVA_OPTIONS=-Xmx2048m -XX:MaxMetaspaceSize=512m
set GRADLE_OPTS=-Xmx2048m -XX:MaxMetaspaceSize=512m
set GRADLE_USER_HOME=C:\Users\DELL\.gradle



echo Building Release Split APKs to minimize memory usage...
call "C:\flutter\bin\flutter.bat" build apk --split-per-abi --release

echo.
if %ERRORLEVEL% EQU 0 (
    echo ===================================================
    echo  BUILD SUCCESSFUL!
    echo  APKs are located at:
    echo  pharmacode_app\build\app\outputs\flutter-apk\
    echo ===================================================
) else (
    echo [!] Build had issues. Check logs above.
)
pause
