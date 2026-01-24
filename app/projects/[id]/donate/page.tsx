import { mockProjects } from '@/lib/mock-projects';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface DonatePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DonatePage({ params }: DonatePageProps) {
  const { id } = await params;
  const project = mockProjects.find(p => p.id === id);

  if (!project) {
    notFound();
  }

  const progress = (project.treesPlanted / project.treesGoal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/projects"
            className="inline-flex items-center gap-2 text-orange-100 hover:text-white mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Projects
          </Link>
          <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
          <p className="text-orange-100 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {project.location}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="relative h-80 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-lime-500 to-orange-500">
            <Image 
              src={project.imageUrl} 
              alt={project.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Project Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Progress</h3>
              <div className="mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {project.treesPlanted.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-600">
                    of {project.treesGoal.toLocaleString()} trees
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-lime-500 to-green-600 rounded-full"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-lime-600 font-semibold mt-1">
                  {Math.min(progress, 100).toFixed(0)}% Complete
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-md p-6">
                <p className="text-sm text-gray-600 mb-1">CO₂ Offset</p>
                <p className="text-2xl font-bold text-orange-600">{project.co2PerTree} kg</p>
                <p className="text-xs text-gray-500">per tree</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <p className="text-sm text-gray-600 mb-1">Cost</p>
                <p className="text-2xl font-bold text-lime-600">${project.costPerTree.toFixed(2)}</p>
                <p className="text-xs text-gray-500">per tree</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Tree Species</h4>
              <div className="flex flex-wrap gap-2">
                {project.treeTypes.map((type, index) => (
                  <span 
                    key={index}
                    className="bg-lime-100 text-lime-800 text-sm px-3 py-1 rounded-full font-medium"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Project</h2>
          <p className="text-gray-700 leading-relaxed">{project.description}</p>
        </div>

        {/* Donation Form Placeholder */}
        <div className="bg-white rounded-xl shadow-md p-8 border-2 border-dashed border-gray-300">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Donation Form Coming Soon</h3>
            <p className="text-gray-600 mb-6">
              The donation functionality will be implemented in a future update.
            </p>
            <Link
              href="/projects"
              className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200"
            >
              Browse Other Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
