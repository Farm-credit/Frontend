'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { mockProjects } from '@/lib/mock-projects';
import { ProjectFilters } from '@/types';
import ProjectCard from '@/components/project-card';
import ProjectFiltersComponent from '@/components/project-filters';

export default function ProjectsPage() {
  const PROJECTS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<ProjectFilters>({
    regions: [],
    treeTypes: [],
    priceRange: { min: 0, max: 999 },
  });

  // Filter projects based on current filter state
  const filteredProjects = useMemo(() => {
    return mockProjects.filter((project) => {
      if (filters.regions.length > 0 && !filters.regions.includes(project.country)) {
        return false;
      }

      if (filters.treeTypes.length > 0) {
        const hasMatchingType = project.treeTypes.some(type => 
          filters.treeTypes.includes(type)
        );
        if (!hasMatchingType) return false;
      }

      if (project.costPerTree < filters.priceRange.min || 
          project.costPerTree > filters.priceRange.max) {
        return false;
      }

      return true;
    });
  }, [filters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const endIndex = startIndex + PROJECTS_PER_PAGE;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  const handleFilterChange = useCallback((newFilters: ProjectFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-lime-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-orange-100 hover:text-white mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Tree Planting Projects
          </h1>
          <p className="text-lg md:text-xl text-orange-100 max-w-3xl">
            Browse our global reforestation initiatives and contribute to a greener planet. 
            Every tree you support helps combat climate change and restore vital ecosystems.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <ProjectFiltersComponent onFilterChange={handleFilterChange} />
          </aside>

          {/* Projects Grid */}
          <main className="flex-1">
            {/* Results Count */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'} Available
              </h2>
              <p className="text-gray-600 mt-1">
                {filteredProjects.length > 0 
                  ? `Showing ${startIndex + 1}-${Math.min(endIndex, filteredProjects.length)} of ${filteredProjects.length} projects`
                  : filters.regions.length > 0 || filters.treeTypes.length > 0 
                    ? 'No projects match your filters' 
                    : 'No projects available'}
              </p>
            </div>

            {/* Projects Grid */}
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {currentProjects.length > 0 && (
                  currentProjects.map((project) => (
                    <motion.div
                      layout
                      key={project.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ProjectCard project={project} />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </motion.div>

            {/* No Results State */}
            <AnimatePresence>
              {currentProjects.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
                >
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No projects found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your filters to see more projects
                    </p>
                    <button
                      onClick={() => {
                        setFilters({ regions: [], treeTypes: [], priceRange: { min: 0, max: 999 } });
                        setCurrentPage(1);
                      }}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                      Clear all filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination Controls */}
            {totalPages > 1 && currentProjects.length > 0 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-orange-600 hover:bg-orange-50 shadow-sm hover:shadow-md border border-orange-200'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    const showPage = page === 1 || 
                                    page === totalPages || 
                                    Math.abs(page - currentPage) <= 1;
                    
                    const showEllipsis = (page === currentPage - 2 && currentPage > 3) ||
                                        (page === currentPage + 2 && currentPage < totalPages - 2);

                    if (showEllipsis) {
                      return <span key={page} className="text-gray-400 px-2">...</span>;
                    }

                    if (!showPage) return null;

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? "page" : undefined}
                        className={`min-w-[40px] h-10 rounded-lg font-semibold transition-all ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                            : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-orange-600 hover:bg-orange-50 shadow-sm hover:shadow-md border border-orange-200'
                  }`}
                >
                  Next
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
