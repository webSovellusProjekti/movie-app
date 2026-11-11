-- public.movies definition

-- Drop table

-- DROP TABLE public.movies;

CREATE TABLE public.movies (
	id serial4 NOT NULL,
	tmdb_id int4 NOT NULL,
	CONSTRAINT movies_id_not_null NOT NULL id,
	CONSTRAINT movies_pk PRIMARY KEY (id),
	CONSTRAINT movies_tmdb_id_not_null NOT NULL tmdb_id,
	CONSTRAINT movies_tmdb_key UNIQUE (tmdb_id)
);


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id serial4 NOT NULL,
	username varchar(50) NOT NULL,
	email varchar(255) NOT NULL,
	password_hash text NOT NULL,
	"role" varchar(20) DEFAULT 'user'::character varying NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT users_created_at_not_null NOT NULL created_at,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_email_not_null NOT NULL email,
	CONSTRAINT users_id_not_null NOT NULL id,
	CONSTRAINT users_password_hash_not_null NOT NULL password_hash,
	CONSTRAINT users_pk PRIMARY KEY (id),
	CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['user'::character varying, 'moderator'::character varying, 'admin'::character varying])::text[]))),
	CONSTRAINT users_role_not_null NOT NULL role,
	CONSTRAINT users_username_key UNIQUE (username),
	CONSTRAINT users_username_not_null NOT NULL username
);


-- public."groups" definition

-- Drop table

-- DROP TABLE public."groups";

CREATE TABLE public."groups" (
	id serial4 NOT NULL,
	"name" varchar(100) NOT NULL,
	description text NULL,
	visibility varchar(10) DEFAULT 'public'::character varying NOT NULL,
	created_by int4 NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT groups_created_at_not_null NOT NULL created_at,
	CONSTRAINT groups_id_not_null NOT NULL id,
	CONSTRAINT groups_name_not_null NOT NULL name,
	CONSTRAINT groups_pk PRIMARY KEY (id),
	CONSTRAINT groups_visibility_check CHECK (((visibility)::text = ANY ((ARRAY['public'::character varying, 'private'::character varying])::text[]))),
	CONSTRAINT groups_visibility_not_null NOT NULL visibility,
	CONSTRAINT groups_created_by_fk FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL
);


-- public.lists definition

-- Drop table

-- DROP TABLE public.lists;

CREATE TABLE public.lists (
	id serial4 NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" varchar(20) DEFAULT 'custom'::character varying NOT NULL,
	user_id int4 NULL,
	group_id int4 NULL,
	share_token varchar(64) NULL,
	visibility varchar(10) DEFAULT 'private'::character varying NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT lists_check CHECK (((user_id IS NULL) <> (group_id IS NULL))),
	CONSTRAINT lists_created_at_not_null NOT NULL created_at,
	CONSTRAINT lists_id_not_null NOT NULL id,
	CONSTRAINT lists_name_not_null NOT NULL name,
	CONSTRAINT lists_pk PRIMARY KEY (id),
	CONSTRAINT lists_share_token_key UNIQUE (share_token),
	CONSTRAINT lists_type_check CHECK (((type)::text = ANY ((ARRAY['watchlist'::character varying, 'favorites'::character varying, 'custom'::character varying, 'group'::character varying])::text[]))),
	CONSTRAINT lists_type_not_null NOT NULL type,
	CONSTRAINT lists_visibility_check CHECK (((visibility)::text = ANY ((ARRAY['private'::character varying, 'group'::character varying, 'link'::character varying, 'public'::character varying])::text[]))),
	CONSTRAINT lists_visibility_not_null NOT NULL visibility,
	CONSTRAINT lists_group_id_fk FOREIGN KEY (group_id) REFERENCES public."groups"(id) ON DELETE CASCADE,
	CONSTRAINT lists_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);


-- public.reviews definition

-- Drop table

-- DROP TABLE public.reviews;

CREATE TABLE public.reviews (
	id serial4 NOT NULL,
	user_id int4 NOT NULL,
	movie_id int4 NOT NULL,
	rating int2 NOT NULL,
	body text NULL,
	visibility varchar(10) DEFAULT 'public'::character varying NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT reviews_check CHECK (((rating >= 1) AND (rating <= 5))),
	CONSTRAINT reviews_created_at_not_null NOT NULL created_at,
	CONSTRAINT reviews_id_not_null NOT NULL id,
	CONSTRAINT reviews_movie_id_not_null NOT NULL movie_id,
	CONSTRAINT reviews_pk PRIMARY KEY (id),
	CONSTRAINT reviews_rating_not_null NOT NULL rating,
	CONSTRAINT reviews_user_id_not_null NOT NULL user_id,
	CONSTRAINT reviews_user_movie_key UNIQUE (user_id, movie_id),
	CONSTRAINT reviews_visibility_check CHECK (((visibility)::text = ANY ((ARRAY['public'::character varying, 'group'::character varying])::text[]))),
	CONSTRAINT reviews_visibility_not_null NOT NULL visibility,
	CONSTRAINT review_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
	CONSTRAINT reviews_movie_id_fk FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON DELETE CASCADE
);


-- public.watched definition

-- Drop table

-- DROP TABLE public.watched;

CREATE TABLE public.watched (
	id serial4 NOT NULL,
	user_id int4 NOT NULL,
	movie_id int4 NOT NULL,
	watched_on date NULL,
	CONSTRAINT watched_id_not_null NOT NULL id,
	CONSTRAINT watched_movie_id_not_null NOT NULL movie_id,
	CONSTRAINT watched_pk PRIMARY KEY (id),
	CONSTRAINT watched_user_id_not_null NOT NULL user_id,
	CONSTRAINT watched_movie_id_fk FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON DELETE CASCADE,
	CONSTRAINT watched_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);


-- public.group_members definition

-- Drop table

-- DROP TABLE public.group_members;

CREATE TABLE public.group_members (
	group_id int4 NOT NULL,
	user_id int4 NOT NULL,
	"role" varchar(20) DEFAULT 'member'::character varying NOT NULL,
	joined_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT group_members_group_id_not_null NOT NULL group_id,
	CONSTRAINT group_members_joined_at_not_null NOT NULL joined_at,
	CONSTRAINT group_members_pk PRIMARY KEY (group_id, user_id),
	CONSTRAINT group_members_role_check CHECK (((role)::text = ANY ((ARRAY['member'::character varying, 'moderator'::character varying, 'admin'::character varying])::text[]))),
	CONSTRAINT group_members_role_not_null NOT NULL role,
	CONSTRAINT group_members_user_id_not_null NOT NULL user_id,
	CONSTRAINT group_members_group_id_fk FOREIGN KEY (group_id) REFERENCES public."groups"(id) ON DELETE CASCADE,
	CONSTRAINT group_members_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);


-- public.list_items definition

-- Drop table

-- DROP TABLE public.list_items;

CREATE TABLE public.list_items (
	list_id int4 NOT NULL,
	movie_id int4 NOT NULL,
	added_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT list_items_added_at_not_null NOT NULL added_at,
	CONSTRAINT list_items_list_id_not_null NOT NULL list_id,
	CONSTRAINT list_items_movie_id_not_null NOT NULL movie_id,
	CONSTRAINT list_items_pk PRIMARY KEY (list_id, movie_id),
	CONSTRAINT list_items_list_id_fk FOREIGN KEY (list_id) REFERENCES public.lists(id) ON DELETE CASCADE,
	CONSTRAINT list_items_movie_id_fk FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON DELETE CASCADE
);

-- Istuntojen tallentamiseen käytettävä taulu
CREATE TABLE IF NOT EXISTS user_sessions (
    sid VARCHAR NOT NULL PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

-- Indeksi vanhentuneiden istuntojen hakemiseen
CREATE INDEX IF NOT EXISTS "IDX_session_expire"
ON user_sessions (expire);
