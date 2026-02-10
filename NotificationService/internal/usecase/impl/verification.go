package impl

import (
	"context"
	"fmt"
	"math/rand"
	"time"

	"github.com/KaminurOrynbek/BiznesAsh/internal/entity"
	repo "github.com/KaminurOrynbek/BiznesAsh/internal/repository/interface"
	usecase "github.com/KaminurOrynbek/BiznesAsh/internal/usecase/interface"
)

type verificationUsecaseImpl struct {
	repo        repo.VerificationRepository
	emailSender usecase.EmailSender
}

func NewVerificationUsecase(repo repo.VerificationRepository, sender usecase.EmailSender) usecase.VerificationUsecase {
	return &verificationUsecaseImpl{
		repo:        repo,
		emailSender: sender,
	}
}

func (u *verificationUsecaseImpl) SendVerificationEmail(ctx context.Context, email *entity.Email) error {
	code := generateVerificationCode()
	verification := &entity.Verification{
		UserID:    email.To,
		Email:     email.To,
		Code:      code,
		ExpiresAt: time.Now().Add(10 * time.Minute),
		IsUsed:    false,
	}

	if err := u.repo.SaveVerificationCode(ctx, verification); err != nil {
		return err
	}

	email.Body = "Please verify your account with this code: " + code
	return u.emailSender.SendEmail(ctx, email)
}

func (u *verificationUsecaseImpl) VerifyCode(ctx context.Context, email, code string) error {
	isValid, err := u.repo.VerifyCode(ctx, email, code)
	if err != nil {
		return err
	}
	if !isValid {
		return fmt.Errorf("invalid or expired verification code")
	}

	return u.repo.UpdateVerificationStatus(ctx, email)
}

func (u *verificationUsecaseImpl) ResendCode(ctx context.Context, email string) error {
	code := generateVerificationCode()
	verification := &entity.Verification{
		UserID:    email,
		Email:     email,
		Code:      code,
		ExpiresAt: time.Now().Add(10 * time.Minute),
		IsUsed:    false,
	}

	if err := u.repo.SaveVerificationCode(ctx, verification); err != nil {
		return err
	}

	return u.emailSender.SendEmail(ctx, &entity.Email{
		To:      email,
		Subject: "Please verify your email",
		Body:    "Please verify your account with this code: " + code,
	})
}

func generateVerificationCode() string {
	rand.Seed(time.Now().UnixNano())
	return fmt.Sprintf("%06d", rand.Intn(1000000))
}
