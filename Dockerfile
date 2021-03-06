# Code generated by Netspective IGS. DO NOT EDIT.

FROM debian:stable-slim as build
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get -qqq update && apt-get install -qqq curl unzip
RUN curl -L https://deno.land/x/install/install.sh | sh
COPY deps.ts .
RUN /root/.deno/bin/deno cache --unstable deps.ts
RUN /root/.deno/bin/deno cache --unstable https://denopkg.com/medigy/governance@v0.8.11/mgctl.ts
FROM gcr.io/distroless/cc-debian10
COPY --from=build /root/.deno/bin/deno /
COPY --from=build /root/.cache/deno /root/.cache/deno
COPY . .
EXPOSE 8159
ENTRYPOINT ["/deno","run","-A","--unstable","https://denopkg.com/medigy/governance@v0.8.11/mgctl.ts","server","--verbose"]