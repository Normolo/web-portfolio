export interface Skill {
  slug: string;
  name: string;
  description: string;
}

export const skills: Skill[] = [
  {
    slug: 'red-teaming',
    name: 'Red-teaming / Pen testing',
    description:
      'I approach systems as an attacker would, identifying exploitable weaknesses through hands-on penetration testing and CTF participation.',
  },
  {
    slug: 'web-application-security',
    name: 'Web Application Security',
    description:
      'I analyse and harden web applications against injection, traversal, and authentication flaws, applying both defensive controls and offensive testing techniques.',
  },
  {
    slug: 'it-infrastructure',
    name: 'IT Infrastructure & Virtualisation',
    description:
      'I design and manage virtualised environments using hypervisors and container runtimes, handling networking, storage, and service orchestration at a homelab and production scale.',
  },
  {
    slug: 'data-analysis',
    name: 'Data Analysis',
    description:
      'I process and interpret structured and unstructured datasets using Python, turning raw data into actionable insight through statistical analysis and visualisation.',
  },
  {
    slug: 'cryptography',
    name: 'Cryptography',
    description:
      'I study and apply classical and modern cryptographic primitives, with experience breaking weakly implemented schemes and understanding the mathematics behind secure constructions.',
  },
  {
    slug: 'reverse-engineering',
    name: 'Reverse Engineering & Cyber Forensics',
    description:
      'I reverse engineer compiled and interpreted artefacts to recover hidden logic or data, and apply forensic techniques to analyse network captures and encoded evidence.',
  },
];
