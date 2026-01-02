/**
 * Database schema reference and SQL definitions
 */

export const DATABASE_SCHEMA = {
  // Profiles table
  profiles: `
    CREATE TABLE profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id),
      email VARCHAR(255) UNIQUE NOT NULL,
      full_name VARCHAR(255),
      avatar_url TEXT,
      bio TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `,

  // Projects table
  projects: `
    CREATE TABLE projects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      thumbnail_url TEXT,
      canvas_state JSONB,
      brand_data JSONB,
      template_id VARCHAR(50),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, name)
    );
  `,

  // Generations table
  generations: `
    CREATE TABLE generations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      prompt TEXT NOT NULL,
      image_urls TEXT[] NOT NULL,
      selected_image_url TEXT,
      metadata JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `,

  // Brand extractions table
  brand_extractions: `
    CREATE TABLE brand_extractions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      url VARCHAR(512) NOT NULL,
      brand_data JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, url)
    );
  `,

  // Canvas history table
  canvas_history: `
    CREATE TABLE canvas_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      canvas_state JSONB NOT NULL,
      version INT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(project_id, version)
    );
  `,
};

/**
 * Row Level Security (RLS) Policies
 */
export const RLS_POLICIES = [
  {
    table: 'profiles',
    policy: 'Users can view their own profile',
    statement: 'SELECT * FROM profiles WHERE auth.uid() = id',
  },
  {
    table: 'projects',
    policy: 'Users can only view their own projects',
    statement: 'SELECT * FROM projects WHERE auth.uid() = user_id',
  },
  {
    table: 'generations',
    policy: 'Users can only view their own generations',
    statement: 'SELECT * FROM generations WHERE auth.uid() = user_id',
  },
  {
    table: 'brand_extractions',
    policy: 'Users can only view their own extractions',
    statement: 'SELECT * FROM brand_extractions WHERE auth.uid() = user_id',
  },
];

/**
 * Storage buckets
 */
export const STORAGE_BUCKETS = {
  images: {
    name: 'images',
    public: true,
    fileSizeLimit: 52428800, // 50MB
  },
  projects: {
    name: 'projects',
    public: false,
    fileSizeLimit: 104857600, // 100MB
  },
};

/**
 * Get SQL for creating table
 * @param {string} tableName
 * @returns {string}
 */
export const getCreateTableSQL = (tableName) => {
  return DATABASE_SCHEMA[tableName] || '';
};

/**
 * Get RLS policy
 * @param {string} tableName
 * @returns {Array}
 */
export const getRLSPolicies = (tableName) => {
  return RLS_POLICIES.filter((p) => p.table === tableName);
};
