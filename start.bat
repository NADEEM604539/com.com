@echo off
echo Starting E-Commerce Application...

echo Starting Backend Server on port 5000...
start cmd /k "cd /d %~dp0 && node server.js"

echo Starting Frontend Server on port 3000...
start cmd /k "cd /d %~dp0frontend && npm start"

echo Both servers are starting. Please wait for a moment.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000 