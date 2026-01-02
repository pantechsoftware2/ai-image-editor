'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

/**
 * Dashboard - Projects management page
 */
export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const userId = 'demo-user';
      const response = await fetch(`/api/projects?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to load projects');
      const data = await response.json();
      setProjects(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (!confirm('Delete this project?')) return;

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete project');
      setProjects(projects.filter((p) => p.id !== projectId));
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete project');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">My Projects</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create New
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No projects yet</p>
            <Link href="/" className="text-blue-600 hover:underline">
              Create your first project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                {project.thumbnail_url && (
                  <img
                    src={project.thumbnail_url}
                    alt={project.name}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{project.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {new Date(project.created_at).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/editor?project=${project.id}`}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 text-center"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="px-3 py-2 border border-red-300 text-red-600 text-sm rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
