FROM golang:1.24-alpine AS build

WORKDIR /app
COPY go.mod ./
RUN go mod download
COPY . .
RUN go build -o subscriptionservice ./cmd/main.go

FROM alpine:latest
WORKDIR /root/
COPY --from=build /app/subscriptionservice .
EXPOSE 8083
CMD ["./subscriptionservice"]
