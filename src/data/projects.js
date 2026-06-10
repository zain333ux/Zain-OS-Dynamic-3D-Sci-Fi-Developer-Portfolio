export const projects = [
  {
    id: "economic-network-dynamics",
    title: "Economic Network Topology & CPI Dynamics",
    category: "Data & Optimization",
    categories: ["Data & Optimization", "Academic CS Projects"],
    summary: "A graph analysis project mapping price co-movements among 51 essential commodities using Pakistan's CPI data.",
    tech: ["Python", "NetworkX", "Pandas", "NumPy", "Graph Theory"],
    highlights: [
      "Processed 30,000+ monthly CPI records spanning 2023 to 2026.",
      "Applied graph centrality measures to locate economically influential commodities.",
      "Analyzed network structures across three yearly windows to study temporal shifts."
    ],
    overview: "An academic data science study using Network Science to map and analyze price co-movement patterns.",
    whatIBuilt: "A Python preprocessing and analysis script that calculates cosine similarity between commodity price change vectors and builds network graphs.",
    whatILearned: "How to handle real-world economic datasets, construct graphs using NetworkX, and apply centrality measures (degree, closeness, and betweenness).",
    links: {
      github: { type: "active", url: "https://github.com/zain333ux/Commodity-Price-Network-Analysis-A-Graph-Theoretic-Study-of-Pakistan-s-CPI-Data-2023-2026-.git" },
      demo: { type: "active", url: "https://youtu.be/oSyzBJYUyX4?si=PLs-qvFq3l8KhTuE" },
      report: { type: "active", url: "https://www.linkedin.com/posts/zain-ul-abideen-392623353_discrete-structures-project-activity-7469695081013403648-UgPC?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFgw8F4BwPgTeWLJ4dE-iEJpXOsF_IcWf6Y" }
    }
  },
  {
    id: "metal-slug-2d-engine",
    title: "Metal Slug Inspired 2D Action Game",
    category: "Game Development",
    categories: ["Game Development", "Software Development", "Academic CS Projects"],
    summary: "A 2D side-scrolling action game built in C++ and SFML as an OOP semester project focusing on modular class architectures.",
    tech: ["C++", "SFML", "OOP", "Design Patterns"],
    highlights: [
      "Designed a modular engine from scratch separating update and render loops.",
      "Applied the State Pattern to organize complex player movements and animation states.",
      "Implemented the Factory Pattern for modular entity and projectile spawning."
    ],
    overview: "An OOP semester project focused on applying theoretical software architectures to a real-time game system.",
    whatIBuilt: "A modular C++ game structure managing character states, enemy behavior, weapon fires, and bounding-box collision grids.",
    whatILearned: "How to design scalable class hierarchies, handle polymorphism and dynamic binding, and separate system responsibilities.",
    links: {
      github: { type: "active", url: "https://github.com/zain333ux/Metal-Slug.git" },
      demo: { type: "active", url: "https://www.linkedin.com/posts/zain-ul-abideen-392623353_oop-cpp-sfml-activity-7468751086338863104-h78d?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFgw8F4BwPgTeWLJ4dE-iEJpXOsF_IcWf6Y" }
    }
  },
  {
    id: "student-performance-prediction",
    title: "Student Performance Prediction Optimizer",
    category: "Data & Optimization",
    categories: ["Data & Optimization", "Academic CS Projects"],
    summary: "A linear regression model built from scratch in Python to predict student marks using gradient descent optimization.",
    tech: ["Python", "NumPy", "Pandas", "Gradient Descent", "Calculus"],
    highlights: [
      "Wrote the cost function and gradient descent training loops from scratch without ML packages.",
      "Vectorized mathematical formulas using NumPy for faster model convergence.",
      "Evaluated model performance by comparing different learning rates."
    ],
    overview: "A mathematical optimization model built to understand the numerical principles behind machine learning training.",
    whatIBuilt: "A multivariable linear model that parses academic marks, calculates gradient steps, and updates weights to minimize prediction errors.",
    whatILearned: "How multivariable calculus drives model optimization, how learning rates impact convergence stability, and how to write vectorized code.",
    links: {
      github: { type: "active", url: "https://github.com/zain333ux/Student-Performance-Prediction-using-Gradient-Descent.git" },
      report: { type: "active", url: "https://www.linkedin.com/posts/muhammad-khubaib-khalil-7405b7395_multivariable-calculus-project-ugcPost-7469682558486818817-r-A0?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFgw8F4BwPgTeWLJ4dE-iEJpXOsF_IcWf6Y" }
    }
  },
  {
    id: "tumble-pop-2d-platformer",
    title: "Tumble Pop Inspired 2D Platformer",
    category: "Game Development",
    categories: ["Game Development", "Academic CS Projects"],
    summary: "A 2D arcade platformer built in C++ and SFML as a Programming Fundamentals semester project focused on core programming logic.",
    tech: ["C++", "SFML", "Collision Loops", "File I/O"],
    highlights: [
      "Coded keyboard input controls, basic player actions, and enemy behaviors.",
      "Wrote platform collision checks and map boundaries.",
      "Implemented save/load states and leaderboard tracking using file streams."
    ],
    overview: "A Programming Fundamentals semester project focused on core C++ syntax, conditional logic, loops, and basic game loops.",
    whatIBuilt: "A classic arcade game featuring basic player movement, vacuum logic, projectile physics, score updates, and file-based state saves.",
    whatILearned: "How to implement keyboard input loops, handle spatial collisions, manage game assets, write data to files, and systematically debug logical errors.",
    links: {
      github: { type: "active", url: "https://github.com/zain333ux/Tumble-Pop-Inspired-2D-Platformer-in-SFML.git" },
      demo: { type: "active", url: "https://www.linkedin.com/posts/zain-ul-abideen-392623353_firstsemester-sfml-gamedevelopment-activity-7417497463818928128-J_vJ?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFgw8F4BwPgTeWLJ4dE-iEJpXOsF_IcWf6Y" }
    }
  },
  {
    id: "network-latency-optimization",
    title: "Network Latency Optimization Model",
    category: "Data & Optimization",
    categories: ["Data & Optimization", "Academic CS Projects"],
    summary: "An optimization project using calculus derivations and Python simulations to find the optimal number of routing nodes.",
    tech: ["Python", "Calculus", "Simulation", "Matplotlib"],
    highlights: [
      "Modeled processing and propagation delays as a single latency function.",
      "Derived the optimal node configuration using analytical calculus derivatives.",
      "Validated the theoretical minimum by running Python simulations and plotting curves."
    ],
    overview: "A systems optimization study applying multivariable calculus to minimize latency in a linear network topology.",
    whatIBuilt: "An analytical optimization formula verified by a Python simulator that models routing delays.",
    whatILearned: "How to apply derivative optimizations to engineering problems and verify mathematical proofs through code.",
    links: {}
  }
];
