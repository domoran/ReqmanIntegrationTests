start C:\ReqMan\ReqMan_v2.1.1283.27b72c39c7\ReqMan.exe
timeout /T 5
start java -jar C:\SeleniumServer\selenium-server-standalone-3.2.0.jar -role hub -port 4445
timeout /T 3
start java -Dwebdriver.chrome.driver=C:\SeleniumServer\chromedriver.exe -jar selenium-server-standalone-3.2.0.jar -role node -host localhost -hubHost localhost -hubPort 4445