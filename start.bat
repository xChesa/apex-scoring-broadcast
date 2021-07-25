@echo off
set /p endpoint="Enter private match API endpoint: "
cd frontend
call npm install
call npm run build
robocopy dist ..\server\dist /MOVE /E

cd ..\server
call npm install
cls
node index.js %endpoint%
