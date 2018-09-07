rm -rf build/*
tsc -w & sleep 2 && \
parcel watch \
  -d build \
  -o server.js \
  build/out/index.js
