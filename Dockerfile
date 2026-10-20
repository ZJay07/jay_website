# Linux environment for running Please (`plz`) against this repo, so ESLint and
# friends load Linux native bindings instead of the Windows ones in node_modules.
# Usage: docker compose run --rm plz lint --fix   (see README)
FROM node:20-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends git curl xz-utils ca-certificates \
       python3 python3-pip \
    && rm -rf /var/lib/apt/lists/*

# jlint is part of `npm run check`. --break-system-packages is fine here: this
# container only exists to run the linters.
RUN pip install --no-cache-dir --break-system-packages jay_lint==0.1.0

WORKDIR /app
COPY scripts/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["bash", "/usr/local/bin/docker-entrypoint.sh"]
CMD ["check"]
