export default function PersonalProjects() {
  const projects = [
    {
      name: 'Energy-Efficient Stable Diffusion Framework',
      description:
        'Investigated the impact of energy consumption on image quality in Stable Diffusion models using Genetic Algorithms (NSGA2 and NSGA3) and CodeCarbon. Analyzed how CPU, GPU, RAM, and runtime affect image quality, optimizing heuristics to balance energy efficiency and output quality effectively.',
      github:
        'https://github.com/tosinfad/fyp-fairness-and-energy-text2img-optimization/tree/jay/energy',
      demo: null,
    },
    {
      name: 'Bias Mitigation in AI-Generated STEM Images',
      description:
        'Optimized Stable Diffusion using Genetic Algorithms to improve representation, achieving a 20% increase in female representation and balanced skin tone distribution.',
      github: 'https://github.com/ZJay07/COMP0031',
      demo: null,
    },
    {
      name: 'Personal Linter',
      description:
        'Developed a custom linter using Abstract Syntax Trees (AST) to enhance code quality, shared for peer use.',
      github: 'https://github.com/ZJay07/jay_lint',
      demo: null,
    },
    {
      name: 'Cascading Vulnerabilities in Python Package Ecosystem',
      description:
        'Conducted a network analysis of the Python Package Index (PyPI) to study its scale-free properties and vulnerability to cascading failures. Explored structural patterns, rich club formation, and degree correlations to identify critical packages and propose strategies to enhance the ecosystem’s resilience.',
      github: 'https://github.com/ZJay07/complex_networks',
      demo: null,
    },
  ];

  return (
    <section id="projects" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-purple-600 dark:text-purple-400">
          Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {project.description}
              </p>
              <div className="flex space-x-4">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    GitHub
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
