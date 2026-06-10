import React from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Reveal from '../components/ui/Reveal';
import CodeBackdrop from '../components/ui/CodeBackdrop';
import { education } from '../data/education';

const Education = () => {
  return (
    <section className="section-pad relative overflow-hidden">
      <CodeBackdrop type="education" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        <Reveal>
          <h2 className="font-heading text-3xl font-bold text-textPrimary tracking-wide">// Education</h2>
          <p className="text-xs text-textMuted font-mono mt-1 uppercase">// ACADEMIC TIMELINE &amp; METHODOLOGY</p>
        </Reveal>

        <div className="max-w-4xl relative border-l border-cardBorder pl-6 md:pl-8 ml-3 space-y-8">
          {/* Timeline Node Point Indicator */}
          <div className="absolute w-3.5 h-3.5 bg-accentPurple rounded-full -left-[8px] top-6 shadow-glowPurple border-2 border-bgDark" />

          <Reveal delay={0.1}>
            <Card className="space-y-6">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-textPrimary">{education.institution}</h3>
                  <p className="text-xs font-mono text-accentCyan mt-1">{education.degree}</p>
                </div>
                <span className="font-mono text-xs text-textMuted py-1 px-2.5 bg-cardBg border border-cardBorder rounded select-none">
                  {education.timeline}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-mono text-textPrimary uppercase tracking-widest mb-3">// Core Coursework</h4>
                  <div className="flex flex-wrap gap-2">
                    {education.courses.map((course, idx) => (
                      <Badge key={idx} name={course} />
                    ))}
                  </div>
                </div>

                <div className="border-t border-cardBorder pt-4">
                  <h4 className="text-xs font-mono text-textPrimary uppercase tracking-widest mb-2">// Learning Approach</h4>
                  <p className="text-sm text-textMuted leading-relaxed">
                    {education.approach}
                  </p>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Education;
