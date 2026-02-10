CREATE TABLE IF NOT EXISTS reactions (
    id UUID PRIMARY KEY,
    post_id TEXT,
    comment_id TEXT,
    user_id TEXT NOT NULL,
    type INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT unique_post_user UNIQUE (post_id, user_id),
    CONSTRAINT unique_comment_user UNIQUE (comment_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_reactions_post_id ON reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_reactions_comment_id ON reactions(comment_id);
