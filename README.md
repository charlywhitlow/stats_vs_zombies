# Stats vs Zombies

The game can be played at: https://stats-vs-zombies.herokuapp.com

It works best in Chrome, and you will need to view in a mobile browser (or on desktop using an emulator e.g. https://developers.google.com/web/tools/chrome-devtools/device-mode)

This project was created as part of a final year project to create a mobile game to teach statistics to undergraduates, using node.js and the excellent JavaScript HTML5 game framework Phaser3 https://phaser.io/phaser3

________________

## API

### status

    curl -X GET \
    http://localhost:3000/scores \
    -H 'Content-Type: application/json'

### check-username

    curl -X POST \
    http://localhost:3000/check-username \
    -H 'Content-Type: application/json' \
    -d '{ "username": "john" }'

### signup

    curl -X POST \
    http://localhost:3000/signup \
    -H 'Content-Type: application/json' \
    -d '{ "username": "john", "email": "john@test.com", "password": "1234" }'

### login (with username)
    curl -X POST \
    http://localhost:3000/login \
    -H 'Content-Type: application/json' \
    -d '{ "username": "john", "password": "1234" }'

### login (with email)

    curl -X POST \
    http://localhost:3000/login \
    -H 'Content-Type: application/json' \
    -d '{ "username": "john@test.com", "password": "1234" }'
