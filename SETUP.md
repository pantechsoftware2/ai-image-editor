# Database Schema Setup

This file contains the SQL to set up your Vizly database in Supabase.

## Instructions

1. Go to [Supabase Dashboard](https://supabase.com)
2. Select your project
3. Go to SQL Editor
4. Copy and paste the content of `database.sql`
5. Run the SQL

## Tables Created

### profiles
- Stores user brand information and settings
- One profile per authenticated user
- RLS enabled - users can only access their own profile

### projects
- Stores canvas JSON and design projects
- Links to user profiles
- RLS enabled - users can only access their own projects

### generations
- Logs all AI image generations
- Tracks usage and tokens
- RLS enabled - users can only access their own generations

## Security

All tables have Row-Level Security (RLS) enabled with the following policies:

- Users can only view their own data
- Users can only modify their own data
- Users can delete their own generations and projects

## Indexes

Indexes are created for optimal query performance:
- `idx_projects_user_id` on projects table
- `idx_generations_user_id` on generations table
- `idx_generations_project_id` on generations table
