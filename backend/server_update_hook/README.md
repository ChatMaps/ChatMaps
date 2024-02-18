## Server Update Hook
The purpose of this file is to enable automatic server updates when a pull request to the main branch succeeds. This is accomplished via a workflow sent from Github to the server which then reloads both itself and the frontend.

## API Endpoints
Base Url: ```https://chatmaps.nicholaspease.com/api/v1/```

|Route|Method|Response Type|Use|Responses|
|-----|------|-------------|---|---------|
|```/```    |GET   |Plain Text   |Heartbeat|200 - "OK"|
|```/deploy```|POST|Plain Text   |Server Update Trigger|200 - "OK" - Server Online / Updated

## Files
|File|Purpose|
|----|-------|
|api.js|NodeJS API using Express|
|README.md|API Reference|