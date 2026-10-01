# syntax=docker/dockerfile:1
# Must match the final runtime stage's base image (bookworm, glibc) — npm install here resolves
# native addons (better-sqlite3) to prebuilt binaries for whatever libc this stage runs on, and a
# node_modules built against musl (Alpine) segfaults/fails to load when copied into a glibc runtime
# (or vice versa). This stage used to be node:22-alpine, matching an all-Alpine runtime; when the
# final stage below switched to bookworm-slim for PaddlePaddle's glibc requirement, this one had to
# switch too — confirmed by an actual production outage (silent crash, zero log output, since
# require('better-sqlite3') fails before any of the app's own logging runs) caused by exactly this
# mismatch.
FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run build

# Download exercise dataset from GitHub (only if not already present in build context)
FROM node:22-alpine AS dataset
RUN apk add --no-cache git
WORKDIR /app
RUN git clone --depth 1 https://github.com/hasaneyldrm/exercises-dataset.git hasaneyldrm-exercises-dataset \
    && rm -rf hasaneyldrm-exercises-dataset/.git

# Body-composition scan OCR runs on PaddleOCR (Python), not Tesseract — see server/ocr/paddleWorker.py
# for why. PaddlePaddle's official CPU wheel is a manylinux (glibc) build with no musl/Alpine
# support, so the final runtime image can't be Alpine-based like the build stages above; bookworm
# (Debian 12) is the smallest official Node image with glibc.
FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
# libgl1/libglib2.0-0: not used directly, but opencv-python (a paddleocr dependency) dlopens
# libGL.so.1 at import time and fails immediately without it — a well-known opencv-in-a-slim-image
# gap, not something paddleocr documents up front.
# libgomp1: PaddlePaddle's compiled libpaddle.so links against libgomp (GNU OpenMP, used for its
# CPU-parallel kernels) — bookworm-slim doesn't ship it by default, so without this package the
# `import paddleocr` below fails immediately with "ImportError: libgomp.so.1: cannot open shared
# object file", confirmed by an actual CI build failure on this exact image.
# Cache-mounted (not a --no-cache-dir install): apt's package cache and pip's wheel cache persist
# in BuildKit's cache store (exported/imported via the workflow's `cache-to/from: type=gha`)
# independently of the image layer graph. A plain layer-cached RUN only helps when this exact
# instruction and everything before it is byte-for-byte unchanged from a previous build — any
# earlier line changing (as happened twice in a row fixing unrelated things) busts it and forces a
# full re-download of paddlepaddle/paddleocr (several hundred MB) from PyPI. The cache mounts let a
# layer-cache miss still reuse already-downloaded packages instead of re-fetching them.
# Versions pinned to what was verified locally (paddlepaddle 3.3.1, paddleocr 3.7.0) rather than
# left floating, so a new upstream release can't silently change build/runtime behavior again.
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
    apt-get update && apt-get install -y --no-install-recommends \
      python3 python3-pip libgl1 libglib2.0-0 libgomp1
RUN --mount=type=cache,target=/root/.cache/pip \
    pip3 install --break-system-packages paddlepaddle==3.3.1 paddleocr==3.7.0

LABEL net.unraid.docker.icon="https://raw.githubusercontent.com/thaihoang987/Gym-Note/main/public/pwa-512.png"
LABEL org.opencontainers.image.source="https://github.com/thaihoang987/Gym-Note"
LABEL org.opencontainers.image.description="Gym Note - self-hosted workout tracker"
LABEL org.opencontainers.image.licenses="MIT"

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/shared ./shared
COPY --from=dataset /app/hasaneyldrm-exercises-dataset ./hasaneyldrm-exercises-dataset

# Pre-downloads PaddleOCR's detection/recognition model files into this layer at build time (same
# config as server/ocr/paddleWorker.py) so the container never needs internet access at runtime and
# the first real scan doesn't silently eat a ~1 minute model-download delay.
RUN python3 -c "from paddleocr import PaddleOCR; PaddleOCR(use_doc_orientation_classify=False, use_doc_unwarping=False, use_textline_orientation=False, enable_mkldnn=False, text_detection_model_name='PP-OCRv6_small_det', text_recognition_model_name='PP-OCRv6_small_rec')"

RUN mkdir -p /app/data /app/uploads
VOLUME ["/app/data"]
EXPOSE 3001
CMD ["node", "server/index.js"]
