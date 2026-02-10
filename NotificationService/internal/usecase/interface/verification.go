package _interface

import (
	"context"
	"github.com/KaminurOrynbek/BiznesAsh/internal/entity"
)

type VerificationUsecase interface {
	SendVerificationEmail(ctx context.Context, email *entity.Email) error
	VerifyCode(ctx context.Context, email, code string) error
	ResendCode(ctx context.Context, email string) error
}
