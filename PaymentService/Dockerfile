FROM golang:1.24-alpine AS build

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o paymentservice ./cmd/main.go

FROM alpine:latest
WORKDIR /root/
COPY --from=build /app/paymentservice .
EXPOSE 8084
CMD ["./paymentservice"]
