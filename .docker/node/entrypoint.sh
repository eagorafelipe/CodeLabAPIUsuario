#!/bin/bash

echo "CodeLabApiUsuario iniciado"

npm install
npm run migration:run

npm run start:debug

# tail -f /dev/null