@echo off
cd server
start cmd /k "node server.js"
cd ../frontend
start cmd /k "npm start"