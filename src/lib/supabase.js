import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
}

/**
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

/**
 * Create or update user profile after signup
 * @param {string} userId
 * @param {Object} userData
 * @returns {Promise<Object>}
 */
export const createUserProfile = async (userId, userData = {}) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        email: userData.email,
        full_name: userData.full_name || '',
        ...userData,
      },
      { onConflict: 'id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Get user profile
 * @param {string} userId
 * @returns {Promise<Object|null>}
 */
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
};

/**
 * Update user profile
 * @param {string} userId
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Get user projects
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export const getUserProjects = async (userId) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Create project
 * @param {string} userId
 * @param {Object} project
 * @returns {Promise<Object>}
 */
export const createProject = async (userId, project) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([{ ...project, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Get project details
 * @param {string} projectId
 * @returns {Promise<Object|null>}
 */
export const getProjectDetails = async (projectId) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
};

/**
 * Update project
 * @param {string} projectId
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
export const updateProject = async (projectId, updates) => {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Delete project
 * @param {string} projectId
 * @returns {Promise<void>}
 */
export const deleteProject = async (projectId) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) throw error;
};

/**
 * Save brand extraction
 * @param {string} userId
 * @param {string} url
 * @param {Object} brandData
 * @returns {Promise<Object>}
 */
export const saveBrandExtraction = async (userId, url, brandData) => {
  const { data, error } = await supabase
    .from('brand_extractions')
    .upsert(
      {
        user_id: userId,
        url,
        brand_data: brandData,
      },
      { onConflict: 'user_id,url' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Get brand extraction
 * @param {string} userId
 * @param {string} url
 * @returns {Promise<Object|null>}
 */
export const getBrandExtraction = async (userId, url) => {
  const { data, error } = await supabase
    .from('brand_extractions')
    .select('*')
    .eq('user_id', userId)
    .eq('url', url)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
};

/**
 * Save generation
 * @param {Object} generation
 * @returns {Promise<Object>}
 */
export const saveGeneration = async (generation) => {
  const { data, error } = await supabase
    .from('generations')
    .insert([generation])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Get project generations
 * @param {string} projectId
 * @returns {Promise<Array>}
 */
export const getProjectGenerations = async (projectId) => {
  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Save canvas history
 * @param {string} projectId
 * @param {Object} canvasState
 * @param {number} version
 * @returns {Promise<Object>}
 */
export const saveCanvasHistory = async (projectId, canvasState, version) => {
  const { data, error } = await supabase
    .from('canvas_history')
    .insert([
      {
        project_id: projectId,
        canvas_state: canvasState,
        version,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Get canvas history
 * @param {string} projectId
 * @returns {Promise<Array>}
 */
export const getCanvasHistory = async (projectId) => {
  const { data, error } = await supabase
    .from('canvas_history')
    .select('*')
    .eq('project_id', projectId)
    .order('version', { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Upload image to storage
 * @param {string} bucket
 * @param {string} path
 * @param {File} file
 * @returns {Promise<Object>}
 */
export const uploadImage = async (bucket, path, file) => {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw error;
  return data;
};

/**
 * Get public URL for storage file
 * @param {string} bucket
 * @param {string} path
 * @returns {string}
 */
export const getPublicUrl = (bucket, path) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl || '';
};

/**
 * Delete image from storage
 * @param {string} bucket
 * @param {string} path
 * @returns {Promise<void>}
 */
export const deleteImage = async (bucket, path) => {
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) throw error;
};

