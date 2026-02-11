-- Drop TEXT constraints
ALTER TABLE poll_votes DROP CONSTRAINT IF EXISTS poll_votes_poll_id_fkey;
ALTER TABLE poll_votes DROP CONSTRAINT IF EXISTS poll_votes_option_id_fkey;
ALTER TABLE poll_options DROP CONSTRAINT IF EXISTS poll_options_poll_id_fkey;
ALTER TABLE polls DROP CONSTRAINT IF EXISTS polls_post_id_fkey;

-- Revert TEXT columns back to UUID
ALTER TABLE poll_votes ALTER COLUMN user_id TYPE UUID USING user_id::uuid;
ALTER TABLE poll_votes ALTER COLUMN option_id TYPE UUID USING option_id::uuid;
ALTER TABLE poll_votes ALTER COLUMN poll_id TYPE UUID USING poll_id::uuid;

ALTER TABLE poll_options ALTER COLUMN poll_id TYPE UUID USING poll_id::uuid;
ALTER TABLE poll_options ALTER COLUMN id TYPE UUID USING id::uuid;

ALTER TABLE polls ALTER COLUMN post_id TYPE UUID USING post_id::uuid;
ALTER TABLE polls ALTER COLUMN id TYPE UUID USING id::uuid;

-- Re-add UUID constraints
ALTER TABLE polls ADD CONSTRAINT polls_post_id_fkey FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
ALTER TABLE poll_options ADD CONSTRAINT poll_options_poll_id_fkey FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE;
ALTER TABLE poll_votes ADD CONSTRAINT poll_votes_poll_id_fkey FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE;
ALTER TABLE poll_votes ADD CONSTRAINT poll_votes_option_id_fkey FOREIGN KEY (option_id) REFERENCES poll_options(id) ON DELETE CASCADE;
