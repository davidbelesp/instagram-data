@echo off
cd server
start cmd /k "node server.js"
cd ../frontend
start index.html