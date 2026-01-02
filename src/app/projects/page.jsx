'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserProjects, deleteProject, duplicateProject, searchProjects } from '@/lib/project-manager';
import { Toast } from '@/components/Toast';

/**
 * My Projects - Dashboard to view, load, and manage saved projects
 */
export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await getUserProjects(12, page * 12);
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
      setToast({ type: 'error', message: 'Failed to load projects' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return;

    try {
      await deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
      setToast({ type: 'success', message: 'Project deleted' });
    } catch (error) {
      console.error('Delete failed:', error);
      setToast({ type: 'error', message: 'Failed to delete project' });
    }
  };

  const handleDuplicateProject = async (id, name) => {
    try {
      const newProject = await duplicateProject(id, `${name} (Copy)`);
      setProjects([newProject, ...projects]);
      setToast({ type: 'success', message: 'Project duplicated' });
    } catch (error) {
      console.error('Duplicate failed:', error);
      setToast({ type: 'error', message: 'Failed to duplicate project' });
    }
  };

  const handleLoadProject = (id) => {
    // Store project ID in session and redirect to editor
    sessionStorage.setItem('projectId', id);
    router.push('/editor');
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadProjects();
      return;
    }

    setLoading(true);
    try {
      const results = await searchProjects(searchTerm);
      setProjects(results);
    } catch (error) {
      console.error('Search failed:', error);
      setToast({ type: 'error', message: 'Search failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && <Toast type={toast.type} message={toast.message} onDismiss={() => setToast(null)} />}

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">My Projects</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8 bg-white rounded-lg p-4 shadow">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-2 border rounded"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Search
            </button>
            <button
              onClick={() => {
                setSearchTerm('');
                loadProjects();
              }}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-500 mb-4">No projects yet</p>
            <button
              onClick={() => router.push('/editor')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create New Design
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                {/* Project Image */}
                <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-center">
                      <p className="text-4xl mb-2">🎨</p>
                      <p>No preview</p>
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 truncate">{project.name}</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    {new Date(project.updated_at).toLocaleDateString()}
                  </p>
                  {project.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLoadProject(project.id)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 font-semibold"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDuplicateProject(project.id, project.name)}
                      className="flex-1 px-3 py-2 bg-green-600 text-white text-xs rounded hover:bg-green-700 font-semibold"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="flex-1 px-3 py-2 bg-red-600 text-white text-xs rounded hover:bg-red-700 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {projects.length > 0 && !searchTerm && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">Page {page + 1}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={projects.length < 12}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
