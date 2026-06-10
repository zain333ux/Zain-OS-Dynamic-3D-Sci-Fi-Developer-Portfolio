import React, { useState } from 'react';
import Button from '../ui/Button';
import Reveal from '../ui/Reveal';
import CodeBackdrop from '../ui/CodeBackdrop';
import { contact } from '../../data/contact';
import { Mail, Clipboard, ClipboardCheck } from 'lucide-react';

const Footer = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer id="contact" className="section-pad relative overflow-hidden border-t border-cardBorder bg-bgDark/40">
      <CodeBackdrop type="contact" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Contact Console Panel */}
        <Reveal className="max-w-3xl mx-auto text-center space-y-6">
          <div className="font-mono text-xs text-accentPurple">// COMMUNICATIONS HUB</div>
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-textPrimary tracking-wide">
            Let's Connect
          </h2>
          <p className="text-sm md:text-base text-textMuted leading-relaxed max-w-xl mx-auto">
            {contact.tagline} Reach out to discuss software engineering, machine learning pipelines, or AI integrations.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            {/* Copier Button */}
            <Button 
              variant="primary" 
              onClick={copyEmail}
              className="flex items-center gap-2 min-w-[200px] justify-center"
            >
              {copied ? (
                <>
                  <ClipboardCheck className="w-4 h-4 text-accentCyan" />
                  <span>Copied Address!</span>
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  <span>Copy Gmail</span>
                </>
              )}
            </Button>
            
            <Button 
              variant="secondary" 
              isExternal 
              onClick={() => window.open(contact.github, '_blank')}
              className="flex items-center gap-2 min-w-[150px] justify-center"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span>GitHub</span>
            </Button>
            
            <Button 
              variant="secondary" 
              isExternal 
              onClick={() => window.open(contact.linkedin, '_blank')}
              className="flex items-center gap-2 min-w-[150px] justify-center"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
              <span>LinkedIn</span>
            </Button>
          </div>
        </Reveal>

        {/* Footnotes */}
        <div className="pt-8 border-t border-cardBorder text-center font-mono text-[10px] text-textMuted tracking-wider space-y-2">
          <div>// ACCESS ENCRYPTED PORT TERMINATED</div>
          <div>&copy; {new Date().getFullYear()} Zain Ul Abideen. Designed with structural focus and clean components.</div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
