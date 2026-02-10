# Project Setup Guide 🚀

If you have just pulled the latest code (`git pull origin main`), you need to update your local environment to match the recent changes.

## Why just `git pull` isn't enough?
1.  **New Services**: We added `ConsultationService`, `PaymentService`, and `SubscriptionService`. These need to be running for the app to work.
2.  **Dependencies**: The frontend might have new libraries.
3.  **Database/Env**: New services might need new environment variables (though mostly handled by defaults or docker).

---

## Option 1: The Easy Way (Docker) 🐳
If you have Docker installed, this is the recommended way. It verifies everything matches.

1.  **Rebuild and Start Backend**:
    Open a terminal in the project root and run:
    ```bash
    docker-compose up --build
    ```
    *This starts all services (User, Content, Notification, Subscription, Payment, Consultation + Gateway) and databases.*

2.  **Start Frontend**:
    Open a separate terminal:
    ```bash
    cd Frontend
    npm install
    npm run dev
    ```

---

## Option 2: Manual Setup (No Docker) 🛠️
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
    cd SubscriptionService && go run cmd/subscription/main.go
    ```
5.  **Payment Service** (NEW!):
    ```bash
    cd PaymentService && go run cmd/payment/main.go
    ```
6.  **Consultation Service** (NEW!):
    ```bash
    cd ConsultationService && go run cmd/consultation/main.go
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

## Troubleshooting 🔧
-   **Method 404 / 502 Errors**: Ensure the **ConsultationService** is running and the **API Gateway** was restarted *after* pulling.
-   **Frontend White Screen**: Check console for errors. Usually due to `npm install` missing.
-   **Database Errors**: If strict schema changes happened, you might need to drop your local DB volumes (for Docker) or run migrations (manual).
