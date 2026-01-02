import { supabase } from '@/lib/supabase';

/**
 * GET /api/projects/[id]
 * Get project details - enhanced with auth check
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return Response.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { data: project, error } = await supabase
      .from('design_projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !project) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    return Response.json({ success: true, data: project });
  } catch (error) {
    console.error('Get project error:', error);
    return Response.json(
      { error: error.message || 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/projects/[id]
 * Update project - enhanced with auth check
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updates = await request.json();

    if (!id) {
      return Response.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { data: project, error } = await supabase
      .from('design_projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return Response.json({ success: true, data: project });
  } catch (error) {
    console.error('Update project error:', error);
    return Response.json(
      { error: error.message || 'Failed to update project' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/projects/[id]
 * Delete project - enhanced with auth check
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return Response.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { error } = await supabase
      .from('design_projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return Response.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    console.error('Delete project error:', error);
    return Response.json(
      { error: error.message || 'Failed to delete project' },
      { status: 500 }
    );
  }
}
