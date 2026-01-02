/**
 * Project Manager
 * Save, load, and manage design projects in Supabase
 */

import { supabase } from '@/lib/supabase';

const PROJECTS_TABLE = 'design_projects';

/**
 * Save project to Supabase
 * @param {Object} projectData - Project data to save
 * @returns {Promise<Object>} Saved project data with ID
 */
export async function saveProject(projectData) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const projectToSave = {
      user_id: user.id,
      name: projectData.name || 'Untitled Design',
      description: projectData.description || '',
      canvas_json: projectData.canvasJson,
      brand_data: projectData.brandData,
      image_url: projectData.imageUrl,
      metadata: projectData.metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // If updating existing project
    if (projectData.id) {
      const { data, error } = await supabase
        .from(PROJECTS_TABLE)
        .update(projectToSave)
        .eq('id', projectData.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    // Create new project
    const { data, error } = await supabase
      .from(PROJECTS_TABLE)
      .insert([projectToSave])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to save project:', error);
    throw new Error(`Failed to save project: ${error.message}`);
  }
}

/**
 * Load project from Supabase
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Project data
 */
export async function loadProject(projectId) {
  try {
    const { data, error } = await supabase
      .from(PROJECTS_TABLE)
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Project not found');

    return data;
  } catch (error) {
    console.error('Failed to load project:', error);
    throw new Error(`Failed to load project: ${error.message}`);
  }
}

/**
 * Get all projects for current user
 * @param {number} limit - Max number of projects to return
 * @param {number} offset - Pagination offset
 * @returns {Promise<Array>} Array of projects
 */
export async function getUserProjects(limit = 20, offset = 0) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from(PROJECTS_TABLE)
      .select('id, name, description, image_url, updated_at, created_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to get projects:', error);
    throw new Error(`Failed to get projects: ${error.message}`);
  }
}

/**
 * Delete project from Supabase
 * @param {string} projectId - Project ID to delete
 * @returns {Promise<void>}
 */
export async function deleteProject(projectId) {
  try {
    const { error } = await supabase
      .from(PROJECTS_TABLE)
      .delete()
      .eq('id', projectId);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to delete project:', error);
    throw new Error(`Failed to delete project: ${error.message}`);
  }
}

/**
 * Duplicate project
 * @param {string} projectId - Project to duplicate
 * @param {string} newName - Name for duplicated project
 * @returns {Promise<Object>} New project data
 */
export async function duplicateProject(projectId, newName) {
  try {
    const original = await loadProject(projectId);
    
    const newProject = {
      ...original,
      name: newName || `${original.name} (Copy)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    delete newProject.id;

    const { data, error } = await supabase
      .from(PROJECTS_TABLE)
      .insert([newProject])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to duplicate project:', error);
    throw new Error(`Failed to duplicate project: ${error.message}`);
  }
}

/**
 * Export project as JSON file
 * @param {string} projectId - Project ID
 * @returns {Promise<void>}
 */
export async function exportProjectFile(projectId) {
  try {
    const project = await loadProject(projectId);
    
    const exportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      project: {
        name: project.name,
        description: project.description,
        canvas_json: project.canvas_json,
        brand_data: project.brand_data,
        metadata: project.metadata,
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name || 'project'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export project:', error);
    throw new Error(`Failed to export project: ${error.message}`);
  }
}

/**
 * Import and save project from JSON file
 * @param {File} file - JSON project file
 * @returns {Promise<Object>} Saved project data
 */
export async function importProjectFile(file) {
  try {
    const text = await file.text();
    const importData = JSON.parse(text);

    if (!importData.project) {
      throw new Error('Invalid project file format');
    }

    const projectData = {
      name: importData.project.name,
      description: importData.project.description,
      canvasJson: importData.project.canvas_json,
      brandData: importData.project.brand_data,
      metadata: importData.project.metadata,
    };

    return await saveProject(projectData);
  } catch (error) {
    console.error('Failed to import project:', error);
    throw new Error(`Failed to import project: ${error.message}`);
  }
}

/**
 * Search projects by name
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} Matching projects
 */
export async function searchProjects(searchTerm) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from(PROJECTS_TABLE)
      .select('id, name, description, image_url, updated_at')
      .eq('user_id', user.id)
      .ilike('name', `%${searchTerm}%`)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to search projects:', error);
    throw new Error(`Failed to search projects: ${error.message}`);
  }
}

/**
 * Get project statistics
 * @returns {Promise<Object>} Project stats
 */
export async function getProjectStats() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from(PROJECTS_TABLE)
      .select('id', { count: 'exact' })
      .eq('user_id', user.id);

    if (error) throw error;

    return {
      totalProjects: data?.length || 0,
      lastModified: data && data.length > 0 ? data[0].updated_at : null,
    };
  } catch (error) {
    console.error('Failed to get project stats:', error);
    throw new Error(`Failed to get project stats: ${error.message}`);
  }
}

/**
 * Update project metadata
 * @param {string} projectId - Project ID
 * @param {Object} metadata - Metadata to update
 * @returns {Promise<Object>} Updated project
 */
export async function updateProjectMetadata(projectId, metadata) {
  try {
    const project = await loadProject(projectId);
    
    const updated = {
      ...project,
      metadata: {
        ...project.metadata,
        ...metadata,
      },
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from(PROJECTS_TABLE)
      .update(updated)
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to update metadata:', error);
    throw new Error(`Failed to update metadata: ${error.message}`);
  }
}
