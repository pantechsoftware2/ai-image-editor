import { getUserProjects, createProject, getProjectDetails } from '@/lib/supabase';

/**
 * GET /api/projects?userId=...
 * List user projects
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    const projects = await getUserProjects(userId);

    return Response.json(projects || []);
  } catch (error) {
    console.error('Get projects error:', error);
    return Response.json(
      {
        error: error.message || 'Failed to fetch projects',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects
 * Create new project
 */
export async function POST(request) {
  try {
    const { userId, name, description, templateId, brandData } = await request.json();

    if (!userId || !name) {
      return Response.json({ error: 'User ID and project name are required' }, { status: 400 });
    }

    const project = await createProject(userId, {
      name,
      description,
      templateId,
      brandData,
    });

    return Response.json(project);
  } catch (error) {
    console.error('Create project error:', error);
    return Response.json(
      {
        error: error.message || 'Failed to create project',
      },
      { status: 500 }
    );
  }
}
