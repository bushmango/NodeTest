REM see https://github.com/foreverjs/forever 
REM release is | forever -w restart app.js -o out.txt -e err.txt -l log.txt
forever -w -m 100 -f app.js