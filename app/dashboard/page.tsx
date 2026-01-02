'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

/**
 * Dashboard Page - View and manage saved projects
 */
export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading projects from Supabase
    setTimeout(() => {
      setProjects([]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-950/50 backdrop-blur border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Vizly AI
          </Link>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => router.push('/')}>
              Create New
            </Button>
            <Button variant="ghost" className="text-slate-300">Sign Out</Button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-white mb-2">My Projects</h1>
        <p className="text-slate-400 mb-12">Manage your saved social media content</p>

        {loading ? (
          <div className="text-center text-slate-300">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-12 text-center">
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No projects yet</h3>
            <p className="text-slate-400 mb-6">Create your first AI-powered social media content</p>
            <Button onClick={() => router.push('/')}>
              Create Project
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden hover:border-blue-400 transition cursor-pointer"
                onClick={() => router.push(`/editor?id=${project.id}`)}
              >
                <div className="aspect-video bg-slate-700 flex items-center justify-center">
                  <span className="text-slate-400">Preview</span>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-white">{project.title}</h4>
                  <p className="text-sm text-slate-400">{project.createdAt}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
