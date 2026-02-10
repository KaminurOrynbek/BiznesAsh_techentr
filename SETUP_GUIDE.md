# Project Setup Guide 🚀

If you have just pulled the latest code (`git pull origin main`), you need to update your local environment to match the recent changes.

If you are running everything manually with `go run`, you verify **ALL** these terminals are open and running:

### 1. Backend Services (Open separate terminals for each)
Order matters slightly (Gateway last).

1.  **User Service**:
    ```bash
    cd UserService && go run cmd/user/main.go
    ```
2.  **Content Service**:
    ```bash
    cd ContentService && go run cmd/content/main.go
    ```
3.  **Notification Service**:
    ```bash
    cd NotificationService && go run cmd/notification/main.go
    ```
4.  **Subscription Service** (NEW!):
    ```bash
    cd SubscriptionService && go run cmd/main.go
    ```
5.  **Payment Service** (NEW!):
    ```bash
    cd PaymentService && go run cmd/main.go
    ```
6.  **Consultation Service** (NEW!):
    ```bash
    cd ConsultationService && go run cmd/main.go
    ```
7.  **API Gateway** (Restart this!):
    ```bash
    cd APIGateway && go run cmd/gateway/main.go
    ```

### 2. Frontend
1.  Update dependencies (Important!):
    ```bash
    cd Frontend
    npm install
    ```
2.  Start the app:
    ```bash
    npm run dev
    ```

---
