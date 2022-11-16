FROM golang:1.18-alpine3.16 as builder
WORKDIR /docker
COPY backend/go.* ./
COPY backend .
COPY backend/config ./config
RUN go mod download
RUN go build -o back cmd/main.go

FROM alpine:3.16
WORKDIR /docker
COPY --from=builder /docker/back .
CMD ["./back"]