'use client';

import { Project } from '@/types';
import Link from 'next/link';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const progress = (project.treesPlanted / project.treesGoal) * 100;
  const progressClamped = Math.min(progress, 100);

  return (
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      {/* Project Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-200 flex-shrink-0">
        <img 
          src={project.imageUrl} 
          alt={project.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback gradient if image fails to load
            e.currentTarget.style.display = 'none';
          }}
        />
        {/* Fallback gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-lime-500 to-orange-500 -z-10" />
        
        {/* Status Badge */}
        {project.status === 'completed' && (
          <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Completed ✓
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Project Name & Location */}
        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
          {project.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {project.location}
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">
              {project.treesPlanted.toLocaleString()} / {project.treesGoal.toLocaleString()} trees
            </span>
            <span className="text-sm font-bold text-lime-600">
              {progressClamped.toFixed(0)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-lime-500 to-green-600 rounded-full transition-all duration-500"
              style={{ width: `${progressClamped}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-orange-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">CO₂ per tree</p>
            <p className="text-lg font-bold text-orange-600">{project.co2PerTree} kg</p>
          </div>
          <div className="bg-lime-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Cost per tree</p>
            <p className="text-lg font-bold text-lime-600">${project.costPerTree.toFixed(2)}</p>
          </div>
        </div>

        {/* Tree Types */}
        <div className="mb-4">
          <p className="text-xs text-gray-600 mb-2">Tree Types:</p>
          <div className="flex flex-wrap gap-2">
            {project.treeTypes.slice(0, 3).map((type, index) => (
              <span 
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
              >
                {type}
              </span>
            ))}
            {project.treeTypes.length > 3 && (
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                +{project.treeTypes.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <Link 
          href={`/projects/${project.id}/donate`}
          className="block w-full text-center bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md mt-auto"
        >
          Donate to this Project
        </Link>
      </div>
    </div>
  );
}
