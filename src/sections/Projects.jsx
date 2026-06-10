import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Reveal from '../components/ui/Reveal';
import CodeBackdrop from '../components/ui/CodeBackdrop';
import ProjectCardVisualizer from '../components/ui/ProjectCardVisualizer';
import { projects } from '../data/projects';

const filters = [
  "All",
  "Data & Optimization",
  "Game Development",
  "Academic CS Projects",
  "Software Development"
];

const Projects = ({ isDeckView = false }) => {
  const [activeFilter, setActiveFilter] = useState("All");

  // Filter projects by checking the categories array
  const filteredProjects = activeFilter === "All"
    ? projects
    : projects.filter(project => project.categories.includes(activeFilter));

  const renderLinkButton = (key, link) => {
    const isComingSoon = link.type === 'coming-soon';
    
    const labels = {
      github: { active: "View GitHub ↗", placeholder: "GitHub Coming Soon" },
      report: { active: "Open Report ↗", placeholder: "Report Coming Soon" },
      notebook: { active: "Open Notebook ↗", placeholder: "Notebook Coming Soon" },
      demo: { active: "View Demo ↗", placeholder: "Demo Coming Soon" }
    };

    const displayLabel = isComingSoon 
      ? labels[key]?.placeholder || "Coming Soon" 
      : labels[key]?.active || "Open Asset ↗";

    if (isComingSoon) {
      return (
        <Button 
          key={key} 
          variant="placeholder" 
          title="This resource is being finalized and will be uploaded soon."
          className="text-[9px] py-1.5 px-3"
        >
          {displayLabel}
        </Button>
      );
    }

    return (
      <Button 
        key={key} 
        variant="secondary" 
        isExternal
        href={link.url}
        onClick={(e) => e.stopPropagation()} // Prevent card overlay click
        className="text-[9px] py-1.5 px-3"
      >
        {displayLabel.replace(" ↗", "")}
      </Button>
    );
  };

  const content = (
    <div className="space-y-6">
      {/* Categories Horizontal Tabs */}
      <div className="flex flex-wrap gap-1.5 bg-cardBg border border-cardBorder p-1 rounded max-w-full w-max">
        {filters.map((f, idx) => {
          const isActive = activeFilter === f;
          return (
            <button
              key={idx}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider transition-all duration-200 rounded-sm
                ${isActive 
                  ? "bg-accentPurple/20 text-textPrimary border border-accentPurple/50 shadow-glowPurple" 
                  : "text-textMuted hover:text-textPrimary border border-transparent"
                }`}
            >
              {f === "Academic CS Projects" ? "Academic CS" : f === "Software Development" ? "Software Dev" : f}
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isDeckView ? 'max-h-[46vh] overflow-y-auto pr-3 scrollbar-sleek py-2' : ''}`}>
        {filteredProjects.map((project, idx) => (
          isDeckView ? (
            <Card 
              key={project.id}
              className="flex flex-col justify-between h-full space-y-6 group relative overflow-hidden"
            >
              <ProjectCardVisualizer projectId={project.id} />
              <div className="relative z-10 flex flex-col justify-between h-full space-y-6 flex-1">
                <div className="space-y-4">
                  {/* Title and Badge */}
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-base md:text-lg font-bold text-textPrimary leading-snug group-hover:text-accentPurple transition-colors">
                      {project.title}
                    </h3>
                    <span className="text-[9px] font-mono py-0.5 px-2 bg-cardBg border border-cardBorder text-accentCyan uppercase rounded select-none shrink-0">
                      {project.category}
                    </span>
                  </div>

                  {/* 1-Line Summary */}
                  <p className="text-xs md:text-sm text-textMuted leading-relaxed">
                    {project.summary}
                  </p>

                  {/* Technology Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t, idx) => (
                      <Badge key={idx} name={t} className="px-2 py-0.5" />
                    ))}
                  </div>

                  {/* Highlights List */}
                  <div className="pt-2">
                    <ul className="text-xs text-textMuted font-mono space-y-1.5 list-disc list-inside">
                      {project.highlights.map((hl, idx) => (
                        <li key={idx} className="leading-relaxed">{hl}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Block */}
                {Object.keys(project.links).length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-cardBorder/30">
                    {/* Resource Links */}
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(project.links).map(([key, link]) => renderLinkButton(key, link))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Reveal key={project.id} delay={idx * 0.05} className="h-full">
              <Card 
                className="flex flex-col justify-between h-full space-y-6 group relative overflow-hidden"
              >
                <ProjectCardVisualizer projectId={project.id} />
                <div className="relative z-10 flex flex-col justify-between h-full space-y-6 flex-1">
                  <div className="space-y-4">
                    {/* Title and Badge */}
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-base md:text-lg font-bold text-textPrimary leading-snug group-hover:text-accentPurple transition-colors">
                        {project.title}
                      </h3>
                      <span className="text-[9px] font-mono py-0.5 px-2 bg-cardBg border border-cardBorder text-accentCyan uppercase rounded select-none shrink-0">
                        {project.category}
                      </span>
                    </div>

                    {/* 1-Line Summary */}
                    <p className="text-xs md:text-sm text-textMuted leading-relaxed">
                      {project.summary}
                    </p>

                    {/* Technology Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((t, idx) => (
                        <Badge key={idx} name={t} className="px-2 py-0.5" />
                      ))}
                    </div>

                    {/* Highlights List */}
                    <div className="pt-2">
                      <ul className="text-xs text-textMuted font-mono space-y-1.5 list-disc list-inside">
                        {project.highlights.map((hl, idx) => (
                          <li key={idx} className="leading-relaxed">{hl}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Footer Block */}
                  {Object.keys(project.links).length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-cardBorder/30">
                      {/* Resource Links */}
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(project.links).map(([key, link]) => renderLinkButton(key, link))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </Reveal>
          )
        ))}
      </div>

      {/* Empty Search Fallback */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-16 border border-dashed border-cardBorder rounded-md">
          <p className="font-mono text-sm text-textMuted">// NO COMPATIBLE MODULES FOUND FOR SELECTED FILTER</p>
        </div>
      )}
    </div>
  );

  if (isDeckView) {
    return content;
  }

  return (
    <section id="projects" className="section-pad relative overflow-hidden border-t border-cardBorder">
      <CodeBackdrop type="projects" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-textPrimary tracking-wide">// Projects</h2>
            <p className="text-xs text-textMuted font-mono mt-1 uppercase">// DYNAMIC COMPILER PIPELINE</p>
          </Reveal>
        </div>

        {content}
      </div>
    </section>
  );
};

export default Projects;
