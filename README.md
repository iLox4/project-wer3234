# Workbook translate tool

## Before deploying:
- run **npm run build** in the wb-tr-fe and move **dist** folder to the **approuter/resources** folder  

## Setup to run localy:
- deploy xsuaa app to sap cloud foundry using xs-security.json
- go to CF dashboard -> assign user to scope
- deploy app to cf using manifest.yml file
- get VCAP_SERVICES and VCAP_APPLICATION from env variables from cf for backend app and approuter
- paste them into the default-env.json in the wb-tr-be and approuter
- start wb-tr-be and approuter