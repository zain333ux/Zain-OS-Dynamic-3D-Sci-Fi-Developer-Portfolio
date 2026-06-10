import React from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Reveal from '../components/ui/Reveal';
import CodeBackdrop from '../components/ui/CodeBackdrop';
import { skills } from '../data/skills';

const Skills = ({ isDeckView = false }) => {
  const content = (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isDeckView ? 'max-h-[55vh] overflow-y-auto pr-3 scrollbar-sleek py-2' : ''}`}>
      {/* Card 1: Core Programming */}
      {isDeckView ? (
        <Card className="flex flex-col justify-between h-full space-y-4">
          <h3 className="font-mono text-xs font-bold text-textPrimary uppercase tracking-widest">// Core Programming</h3>
          <div className="flex flex-wrap gap-2">
            {skills.coreProgramming.map((skill, idx) => (
              <Badge key={idx} name={skill.name} level={skill.level} />
            ))}
          </div>
        </Card>
      ) : (
        <Reveal delay={0.05}>
          <Card className="flex flex-col justify-between h-full space-y-4">
            <h3 className="font-mono text-xs font-bold text-textPrimary uppercase tracking-widest">// Core Programming</h3>
            <div className="flex flex-wrap gap-2">
              {skills.coreProgramming.map((skill, idx) => (
                <Badge key={idx} name={skill.name} level={skill.level} />
              ))}
            </div>
          </Card>
        </Reveal>
      )}

      {/* Card 2: Data & Math */}
      {isDeckView ? (
        <Card className="flex flex-col justify-between h-full space-y-4">
          <h3 className="font-mono text-xs font-bold text-textPrimary uppercase tracking-widest">// Data &amp; Mathematics</h3>
          <div className="flex flex-wrap gap-2">
            {skills.dataAndMath.map((skill, idx) => (
              <Badge key={idx} name={skill.name} level={skill.level} />
            ))}
          </div>
        </Card>
      ) : (
        <Reveal delay={0.1}>
          <Card className="flex flex-col justify-between h-full space-y-4">
            <h3 className="font-mono text-xs font-bold text-textPrimary uppercase tracking-widest">// Data &amp; Mathematics</h3>
            <div className="flex flex-wrap gap-2">
              {skills.dataAndMath.map((skill, idx) => (
                <Badge key={idx} name={skill.name} level={skill.level} />
              ))}
            </div>
          </Card>
        </Reveal>
      )}

      {/* Card 3: AI / Automation Direction */}
      {isDeckView ? (
        <Card className="flex flex-col justify-between h-full space-y-4">
          <h3 className="font-mono text-xs font-bold text-textPrimary uppercase tracking-widest">// AI &amp; Automation Direction</h3>
          <div className="flex flex-wrap gap-2">
            {skills.aiAndAutomation.map((skill, idx) => (
              <Badge key={idx} name={skill.name} level={skill.level} />
            ))}
          </div>
        </Card>
      ) : (
        <Reveal delay={0.15}>
          <Card className="flex flex-col justify-between h-full space-y-4">
            <h3 className="font-mono text-xs font-bold text-textPrimary uppercase tracking-widest">// AI &amp; Automation Direction</h3>
            <div className="flex flex-wrap gap-2">
              {skills.aiAndAutomation.map((skill, idx) => (
                <Badge key={idx} name={skill.name} level={skill.level} />
              ))}
            </div>
          </Card>
        </Reveal>
      )}

      {/* Card 4: Tools I Use */}
      {isDeckView ? (
        <Card className="flex flex-col justify-between h-full space-y-4">
          <h3 className="font-mono text-xs font-bold text-textPrimary uppercase tracking-widest">// Tools I Use</h3>
          <div className="flex flex-wrap gap-2">
            {skills.toolsIUse.map((skill, idx) => (
              <Badge key={idx} name={skill.name} level={skill.level} />
            ))}
          </div>
        </Card>
      ) : (
        <Reveal delay={0.2}>
          <Card className="flex flex-col justify-between h-full space-y-4">
            <h3 className="font-mono text-xs font-bold text-textPrimary uppercase tracking-widest">// Tools I Use</h3>
            <div className="flex flex-wrap gap-2">
              {skills.toolsIUse.map((skill, idx) => (
                <Badge key={idx} name={skill.name} level={skill.level} />
              ))}
            </div>
          </Card>
        </Reveal>
      )}
    </div>
  );

  if (isDeckView) {
    return content;
  }

  return (
    <section id="stack" className="section-pad relative overflow-hidden border-t border-cardBorder">
      <CodeBackdrop type="skills" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        <Reveal>
          <h2 className="font-heading text-3xl font-bold text-textPrimary tracking-wide">// Skills &amp; Technology Matrix</h2>
          <p className="text-xs text-textMuted font-mono mt-1 uppercase">// CURRENT DEVELOPMENT VECTORS &amp; PROFICIENCIES</p>
        </Reveal>
        {content}
      </div>
    </section>
  );
};

export default Skills;
