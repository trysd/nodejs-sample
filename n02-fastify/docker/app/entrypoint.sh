#!/bin/bash

# -- case prod
node dist/index.js

# -- case dev
# npm install -g ts-node-dev
# ts-node-dev --poll --respawn src/index.ts
