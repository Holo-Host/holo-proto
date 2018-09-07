rm -rf build/*
tsc && parcel build \
  -d build \
  -o server.js \
  --no-minify \
  build/out/index.js \
&& rm -rf build/out