# syntax=docker/dockerfile:1
# Must match the final runtime stage's base image (glibc, via Dockerfile.base -> node:22-bookworm-
# slim) — npm install here resolves native addons (better-sqlite3) to prebuilt binaries for
# whatever libc this stage runs on, and a node_modules built against musl (Alpine) segfaults/fails
# to load when copied into a glibc runtime (or vice versa). This stage used to be node:22-alpine,
# matching an all-Alpine runtime; when the final stage switched to bookworm-slim for PaddlePaddle's
# glibc requirement, this one had to switch too — confirmed by an actual production outage (silent
# crash, zero log output, since require('better-sqlite3') fails before any of the app's own logging
# runs) caused by exactly this mismatch. Reuses the same base image as the final stage (rather than
# plain node:22-bookworm-slim) purely so there's one glibc version to keep in sync, not two — the
# extra Python/PaddleOCR weight in this intermediate stage costs nothing in the final image, since
# multi-stage builds only ship the layers actually copied out of it.
FROM ghcr.io/thaihoang987/gym-note-base:latest AS deps
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
# for why. The Python/PaddleOCR runtime itself (apt packages, pip packages, pre-downloaded OCR
# models) lives in Dockerfile.base, built and pushed separately (see .github/workflows/
# docker-base.yml) — routine app-code commits like this Dockerfile's own COPY layers below never
# touch those hundred-plus-MB layers, so a normal deploy only pulls the thin app-code diff instead
# of re-downloading PaddlePaddle every time.
FROM ghcr.io/thaihoang987/gym-note-base:latest
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

LABEL net.unraid.docker.icon="https://raw.githubusercontent.com/thaihoang987/Gym-Note/main/public/pwa-512.png"
LABEL org.opencontainers.image.source="https://github.com/thaihoang987/Gym-Note"
LABEL org.opencontainers.image.description="Gym App - self-hosted workout tracker"
LABEL org.opencontainers.image.licenses="MIT"

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/shared ./shared
COPY --from=dataset /app/hasaneyldrm-exercises-dataset ./hasaneyldrm-exercises-dataset

RUN mkdir -p /app/data /app/uploads
VOLUME ["/app/data"]
EXPOSE 3001
CMD ["node", "server/index.js"]
