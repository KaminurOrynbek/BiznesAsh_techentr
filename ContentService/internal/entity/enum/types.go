package enum

type PostType string

const (
	PostTypeLegalInfo PostType = "LEGAL_INFO"
	PostTypeGuide     PostType = "GUIDE"
)

type ReactionType int32

const (
	ReactionTypeLike  ReactionType = 0
	ReactionTypeLove  ReactionType = 1
	ReactionTypeHaha  ReactionType = 2
	ReactionTypeWow   ReactionType = 3
	ReactionTypeSad   ReactionType = 4
	ReactionTypeAngry ReactionType = 5
)
