/**
 * API Route: Save/Update Project
 * POST /api/projects/save
 */

import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { projectData } = await request.json();

    if (!projectData || !projectData.name) {
      return Response.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const projectToSave = {
      user_id: user.id,
      name: projectData.name,
      description: projectData.description || '',
      canvas_json: projectData.canvasJson,
      brand_data: projectData.brandData,
      image_url: projectData.imageUrl,
      metadata: projectData.metadata || {},
      updated_at: new Date().toISOString(),
    };

    let result;

    if (projectData.id) {
      // Update existing project
      const { data, error } = await supabase
        .from('design_projects')
        .update(projectToSave)
        .eq('id', projectData.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new project
      projectToSave.created_at = new Date().toISOString();
      const { data, error } = await supabase
        .from('design_projects')
        .insert([projectToSave])
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return Response.json({ success: true, data: result });
  } catch (error) {
    console.error('Project save error:', error);
    return Response.json(
      { error: error.message || 'Failed to save project' },
      { status: 500 }
    );
  }
}
