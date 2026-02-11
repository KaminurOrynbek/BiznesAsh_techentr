package mapper

import (
	"time"

	pb "github.com/KaminurOrynbek/BiznesAsh/auto-proto/content"
	"github.com/KaminurOrynbek/BiznesAsh/internal/entity"
)

func ConvertPostToPB(p *entity.Post) *pb.Post {
	pbComments := make([]*pb.Comment, 0, len(p.Comments))
	for _, c := range p.Comments {
		pbComments = append(pbComments, ConvertCommentToPB(c))
	}

	return &pb.Post{
		Id:            p.ID,
		Title:         p.Title,
		Content:       p.Content,
		Type:          pb.PostType(pb.PostType_value[string(p.Type)]),
		AuthorId:      p.AuthorID,
		Published:     p.Published,
		LikesCount:    p.LikesCount,
		DislikesCount: p.DislikesCount,
		CreatedAt:     p.CreatedAt.Format(time.RFC3339),
		UpdatedAt:     p.UpdatedAt.Format(time.RFC3339),
		CommentsCount: p.CommentsCount,
		Comments:      pbComments,
		Liked:         p.Liked,
		Images:        p.Images,
		Files:         p.Files,
		Poll:          ConvertPollToPB(p.Poll),
	}
}

func ConvertPollToPB(p *entity.Poll) *pb.Poll {
	if p == nil {
		return nil
	}
	options := make([]*pb.PollOption, 0, len(p.Options))
	for _, opt := range p.Options {
		options = append(options, ConvertPollOptionToPB(opt))
	}
	return &pb.Poll{
		Id:                p.ID,
		Question:          p.Question,
		Options:           options,
		ExpiresAt:         p.ExpiresAt.Format(time.RFC3339),
		TotalVotes:        p.TotalVotes,
		UserVotedOptionId: p.UserVotedOptionID,
	}
}

func ConvertPollOptionToPB(o *entity.PollOption) *pb.PollOption {
	if o == nil {
		return nil
	}
	return &pb.PollOption{
		Id:         o.ID,
		Text:       o.Text,
		VotesCount: o.VotesCount,
	}
}
