CREATE TABLE users (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password TEXT NOT NULL,
    verification_code_exp_date_time int,
    verification_code int,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE posts (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    user_uuid UUID REFERENCES users(uuid) ON DELETE CASCADE
);


CREATE TABLE comments (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    post_uuid UUID REFERENCES posts(uuid) ON DELETE CASCADE,
    user_uuid UUID REFERENCES users(uuid) ON DELETE SET NULL
);


CREATE TABLE likes (
    user_uuid UUID REFERENCES users(uuid) ON DELETE CASCADE,
    post_uuid UUID REFERENCES posts(uuid) ON DELETE CASCADE,
    PRIMARY KEY (user_uuid, post_uuid)
);
