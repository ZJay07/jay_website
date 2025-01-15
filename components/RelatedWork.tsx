export default function RelatedWork() {
  return (
    <section id="work" className="py-16 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-purple-600 dark:text-purple-400">
          Related Work
        </h2>
        <div className="space-y-8">
          {/* Ivy Contributions */}
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">
              Open-Source Contributions to Ivy
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Improved the Ivy machine learning framework by fixing test cases,
              implementing new features, and enhancing compatibility across
              various systems. Contributed to the development of Ivy’s unified
              machine learning library to simplify the use of multiple backends
              like TensorFlow and PyTorch.
            </p>
            <a
              href="https://github.com/ivy-llc/ivy/pulls/ZJay07"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              Learn More
            </a>
          </div>

          {/* Complex Networks Analysis */}
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">
              Complex Networks Analysis of PyPI Ecosystem
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Conducted a comprehensive network analysis of the Python Package
              Index (PyPI) to examine its scale-free properties and cascading
              failure vulnerabilities. Proposed strategies for improving
              ecosystem resilience by analyzing rich club formation and
              dependency correlations.
            </p>
            <a
              href="https://github.com/ZJay07/complex_networks"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              Learn More
            </a>
          </div>

          {/* Bias Mitigation in Stable Diffusion */}
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">
              Bias Mitigation in Stable Diffusion
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Investigated bias in AI-generated STEM images by optimizing Stable
              Diffusion models with Genetic Algorithms. Achieved a 20% increase
              in female representation and a balanced skin tone distribution,
              awarded the UCL Computer Science EDI Award.
            </p>
            <a
              href="https://github.com/ZJay07/complex_networks"
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
