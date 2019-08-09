#!/bin/bash

API="http://localhost:4741"
URL_PATH="/patients"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "patient": {
      "site": "'"${SITE}"'",
      "studyId": "'"${STUDY}"'",
      "birthDate": "'"${BD}"'",
      "consentDate": "'"${CD}"'"
    }
  }'

echo
