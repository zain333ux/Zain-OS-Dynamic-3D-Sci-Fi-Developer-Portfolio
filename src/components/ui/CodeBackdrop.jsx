import React, { useEffect, useRef } from 'react';

const snippets = {
  hero: [
    "// BOOTING CORE_SYSTEM_RESOURCES",
    "import React, { useRef } from 'react';",
    "import { Canvas } from '@react-three/fiber';",
    "const LatticeMesh = ({ nodes }) => {",
    "  const groupRef = useRef();",
    "  useFrame((state) => {",
    "    groupRef.current.rotation.y += 0.005;",
    "  });",
    "  return <points ref={groupRef} />;",
    "};",
    "export default LatticeMesh;",
    "// PARALLAX SHIFTS ACTIVE",
    "const scaleX = useSpring(scrollYProgress);"
  ],
  about: [
    "// OBJECT-ORIENTED ENGINE SYSTEM",
    "class Entity {",
    "private:",
    "    sf::Vector2f position;",
    "    State* currentState;",
    "public:",
    "    Entity(float x, float y);",
    "    virtual void update(float dt) = 0;",
    "    virtual void draw(sf::RenderWindow& w) = 0;",
    "    void setState(State* newState) {",
    "        currentState = newState;",
    "    }",
    "};",
    "// FACTORY ENTITY SPAWNER ACTIVATED"
  ],
  education: [
    "// GRAPH SCIENCE & CPI DYNAMICS",
    "import networkx as nx",
    "import numpy as np",
    "def calculate_similarity_matrix(cpi_data):",
    "    matrix = np.zeros((51, 51))",
    "    for i in range(51):",
    "        for j in range(i+1, 51):",
    "            sim = cosine_similarity(cpi_data[i], cpi_data[j])",
    "            matrix[i][j] = sim",
    "    return nx.from_numpy_array(matrix)",
    "// CALCULATING BETWEENNESS CENTRALITY"
  ],
  skills: [
    "// CALCULUS LATENCY OPTIMIZATION",
    "def optimize_network_nodes(d_prop, d_proc):",
    "    # f(n) = (n * d_proc) + (d_prop / n)",
    "    # df/dn = d_proc - (d_prop / n^2) = 0",
    "    # n = sqrt(d_prop / d_proc)",
    "    optimal_n = np.sqrt(d_prop / d_proc)",
    "    return int(np.round(optimal_n))",
    "// GRADIENT DESCENT OPTIMIZATION STEP",
    "dm = (-2/n) * sum(x * (y - y_pred))"
  ],
  projects: [
    "// DYNAMIC PIPELINE INVOCATION",
    "const [activeFilter, setActiveFilter] = useState('All');",
    "const filtered = activeFilter === 'All'",
    "  ? projects",
    "  : projects.filter(p => p.categories.includes(activeFilter));",
    "const openDrawer = (project) => {",
    "  setSelectedProject(project);",
    "  setIsDrawerOpen(true);",
    "};",
    "// SYSTEM COMPILATION SUCCESSFUL"
  ],
  contact: [
    "// TERMINAL COMMUNICATIONS LOG",
    "zain@portfolio:~# connect --target linkedin",
    "Connecting to link: /in/zain-ul-abideen-392623353...",
    "Connection status: SECURE",
    "zain@portfolio:~# connect --target github",
    "Exposing repository endpoints: github.com/zain333ux",
    "zain@portfolio:~# mailto:uzain6268@gmail.com",
    "Copying email to clipboard buffers... [DONE]"
  ],
  learning: [
    "// LLM ORCHESTRATION PIPELINE",
    "from langchain_openai import ChatOpenAI",
    "from langchain.agents import AgentExecutor",
    "model = ChatOpenAI(model='gpt-4o-mini')",
    "agent = create_openai_tools_agent(model, tools)",
    "executor = AgentExecutor(agent=agent, tools=tools)",
    "response = executor.invoke({'input': query})",
    "// VECTOR DATABASE SEMANTIC SEARCH",
    "db.similarity_search(query, k=3)"
  ],
  volunteering: [
    "// EVENT COORDINATION LOGGER",
    "#!/bin/bash",
    "echo 'Initializing volunteer database sync...'",
    "db_host='alkhidmat.org/volunteers'",
    "sync_status=$(curl -s -o /dev/null -w '%{http_code}' $db_host)",
    "if [ $sync_status -eq 200 ]; then",
    "    echo 'STATUS: STABLE. COORDINATES ACTIVE.'",
    "else",
    "    echo 'WARN: CONNECTION OFFLINE. RETRYING...'",
    "fi"
  ],
  achievements: [
    "// VERIFIED SYSTEM CHECKPOINT",
    "{",
    "  \"system_milestones\": {",
    "    \"ACHV_01\": { \"status\": \"VERIFIED\", \"type\": \"OOP_ENGINE\" },",
    "    \"ACHV_02\": { \"status\": \"VERIFIED\", \"type\": \"DATA_GRAPH\" },",
    "    \"ACHV_03\": { \"status\": \"VERIFIED\", \"type\": \"OPTIMIZER\" }",
    "  },",
    "  \"compilation\": \"SUCCESS\"",
    "}"
  ]
};

const CodeBackdrop = ({ type = 'hero' }) => {
  const containerRef = useRef(null);
  const codeLines = snippets[type] || snippets.hero;
  
  // Duplicate array to enable seamless marquee scrolling
  const scrollLines = [...codeLines, ...codeLines, ...codeLines];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Track coordinates relative to parent container bounds
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      container.style.setProperty('--mouse-x', `${x}px`);
      container.style.setProperty('--mouse-y', `${y}px`);
    };

    const parent = container.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none opacity-[0.05] md:opacity-[0.035]"
      style={{
        maskImage: `radial-gradient(160px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.12) 100%)`,
        WebkitMaskImage: `radial-gradient(160px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.12) 100%)`,
      }}
      aria-hidden="true"
    >
      <div className="w-full h-full font-mono text-[10px] md:text-xs text-accentCyan leading-relaxed whitespace-pre pl-8 pt-8 flex flex-col justify-start">
        <div className="animate-marquee-scroll space-y-2 flex flex-col">
          {scrollLines.map((line, idx) => (
            <div 
              key={idx} 
              className={line.startsWith('//') ? 'text-accentPurple font-semibold' : ''}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeBackdrop;
