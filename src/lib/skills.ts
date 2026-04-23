export interface Skill {
  slug: string;
  name: string;
  description: string;
}

export const skills: Skill[] = [
  {
    slug: 'cybersecurity',
    name: 'Cybersecurity',
    description:
      'I focus on secure systems thinking, practical threat modeling, and hardening workflows against real-world attack paths.',
  },
  {
    slug: 'mathematics',
    name: 'Mathematics',
    description:
      'I apply discrete and continuous mathematics to reason about algorithms, cryptography, and performance trade-offs.',
  },
  {
    slug: 'software-engineering',
    name: 'Software Engineering',
    description:
      'I build maintainable software with clear architecture, careful iteration, and an emphasis on reliability over time.',
  },
  {
    slug: 'web-development',
    name: 'Web Development',
    description:
      'I create responsive, fast web interfaces with strong accessibility and clean, reusable frontend structure.',
  },
  {
    slug: 'python',
    name: 'Python',
    description:
      'I use Python for scripting, analysis, and automation where readability and rapid iteration are important.',
  },
  {
    slug: 'java',
    name: 'Java',
    description:
      'I work with Java for strongly typed backend and academic projects where performance and structure matter.',
  },
  {
    slug: 'linux',
    name: 'Linux',
    description:
      'I am comfortable in Linux environments for daily development, tooling, and system-level debugging tasks.',
  },
  {
    slug: 'quantum-security',
    name: 'Quantum Security',
    description:
      'I explore post-quantum risk and cryptographic transition planning to support long-term security resilience.',
  },
];
