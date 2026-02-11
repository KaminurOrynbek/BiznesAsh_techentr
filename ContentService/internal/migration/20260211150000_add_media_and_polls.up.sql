-- Add images and files columns to posts table
ALTER TABLE posts ADD COLUMN images TEXT[] DEFAULT '{}';
ALTER TABLE posts ADD COLUMN files TEXT[] DEFAULT '{}';

-- Create polls table
CREATE TABLE polls (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create poll_options table
CREATE TABLE poll_options (
    id TEXT PRIMARY KEY,
    poll_id TEXT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    votes_count INT NOT NULL DEFAULT 0
);

-- Create poll_votes table
CREATE TABLE poll_votes (
    poll_id TEXT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    option_id TEXT NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    PRIMARY KEY (poll_id, user_id)
);
