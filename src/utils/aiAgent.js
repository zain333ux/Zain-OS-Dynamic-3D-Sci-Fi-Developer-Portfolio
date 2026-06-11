// Modular AI Offline Knowledge Agent for Zain's Portfolio
const KNOWLEDGE_BASE = [
  {
    keys: ["about", "bio", "who are you", "zain", "profile", "narrative", "student", "fast"],
    response: "Zain Ul Abideen is a Computer Science student at FAST-NUCES Islamabad (timeline: 2025–2029) with a current GPA of 3.02. He is passionate about building clean, practical, and intelligent software systems from first principles. His work merges software programming, data analysis, and mathematical modeling with Generative AI and Machine Learning."
  },
  {
    keys: ["project", "projects", "cpi", "descent", "predictive", "slug", "tumble", "regression", "performance"],
    response: "Zain has developed several technical systems:\n1. Student Performance Prediction Model (ACHV_03): A multivariable linear regression model built completely from scratch in Python (cost functions, derivatives, gradient descent optimized manually).\n2. CPI Dynamics: A math-driven vector similarity graph analyzing Pakistan's inflation networks.\n3. Latency Optimizer: A calculus-based network routing optimization graph.\n4. Metal Slug Engine: A C++/SFML game engine utilizing custom character state machines and bounding colliders."
  },
  {
    keys: ["skill", "skills", "matrix", "python", "c++", "react", "agent", "model", "langchain", "programming", "languages"],
    response: "Zain's core skills are divided into three focus zones:\n- Generative AI: Large Language Models, prompt engineering, Retrieval-Augmented Generation (RAG), and LangChain agent frameworks.\n- Machine Learning: Regression math, cost functions, training optimization, and gradient descent algorithms.\n- Automation & Dev: Custom system scripts, web scraping, full-stack React development, C++, and Python."
  },
  {
    keys: ["education", "degree", "university", "nuces", "college", "school", "matric", "fsc", "intermediate"],
    response: "Zain's academic timeline:\n- BS Computer Science (BSCS) at FAST-NUCES Islamabad (2025–2029) | GPA: 3.02. Focuses on applying academic math to practical code.\n- FSc Pre-Engineering at Army Public College, Jhelum Cantt (2023–2025) | 89.7%. Strengthened foundations in calculus.\n- Matriculation in Science (Biology) at Army Public School, Jhelum Cantt (2021–2023) | 92.5%. Developed core self-learning discipline."
  },
  {
    keys: ["volunteering", "volunteer", "khidmat", "certificate", "community"],
    response: "Zain volunteered with the Al-Khidmat Foundation in Islamabad, contributing to community welfare activities. This helped him understand the value of service, responsibility, and teamwork. You can view his full Appreciation Certificate directly in the Volunteering section on the website."
  },
  {
    keys: ["contact", "email", "github", "linkedin", "hire", "gmail", "connect"],
    response: "You can connect with Zain directly via:\n- Email: uzain6268@gmail.com\n- GitHub: github.com/zain333ux\n- LinkedIn: linkedin.com/in/zain-ul-abideen-392623353\nFeel free to copy his email or open links in the footer connect hub!"
  },
  {
    keys: ["cv", "resume", "download"],
    response: "Zain's complete CV asset is fully integrated. You can download it instantly by clicking the 'Download Resume' button inside the Hero section at the top of the page."
  },
  {
    keys: ["help", "commands", "cmd", "what can I ask"],
    response: "You can ask me about Zain's background, education, projects, skills, volunteering, or contact details. Try queries like: 'tell me about your projects', 'where do you study', 'what are your skills', or 'how do I contact you'."
  }
];

export const getAiResponse = (query) => {
  const normalized = query.toLowerCase().trim();
  if (!normalized) {
    return "[-] SYSTEM ACCESS LOG: Input query is empty. Type 'help' to see what you can ask.";
  }

  // Look for key overlaps
  for (const entry of KNOWLEDGE_BASE) {
    for (const key of entry.keys) {
      if (normalized.includes(key)) {
        return entry.response;
      }
    }
  }

  // Dynamic fallback persona response
  return `[+] QUERY SECURED. ANALYZING COGNITIVE DATABASE...
No exact matches found for: "${query}".
My records show Zain is a Computer Science student at FAST-NUCES Islamabad specializing in Generative AI, Machine Learning, and Automation.
Try asking about his 'skills', 'predictive model' project, 'education', or 'contact'.`;
};
