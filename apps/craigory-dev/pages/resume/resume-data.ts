import { PRESENTATIONS } from '@new-personal-monorepo/presentations';

export interface ExternalLink {
  label: string;
  href: string;
}

export interface BulletGroup {
  heading?: string;
  bullets: string[];
}

export interface Entry {
  id: string;
  name: string;
  href?: string;
  private?: boolean;
  dates?: string;
  roles?: string[];
  lead?: string;
  groups?: BulletGroup[];
  links?: ExternalLink[];
}

export interface Section {
  heading: string;
  entries: Entry[];
  /** Where the full list lives, when the section shows only highlights. */
  more?: ExternalLink;
}

export interface TechnologyGroup {
  category: string;
  items: string[];
}

export interface Talk {
  title: string;
  events: string;
  /** Every presentation of this talk, newest first. Links come from these. */
  slugs: string[];
}

export interface Resume {
  name: string;
  headline: string;
  links: ExternalLink[];
  summary: string;
  sections: Section[];
  technologies: TechnologyGroup[];
  talks: Talk[];
}

export const resume: Resume = {
  name: 'Craigory Coppola',
  headline: 'Senior Software Engineer at Nx',
  links: [
    { label: 'github.com/AgentEnder', href: 'https://github.com/AgentEnder' },
    {
      label: 'linkedin.com/in/craigoryvcoppola',
      href: 'https://www.linkedin.com/in/craigoryvcoppola',
    },
  ],
  summary:
    'Senior software engineer at Nx since 2021. I own the plugin API and .NET support. Outside Nx I build developer tools, agent skills, and a SaaS for wrestling promotions.',
  sections: [
    {
      heading: 'Experience',
      entries: [
        {
          id: 'nx',
          name: 'Nx',
          href: 'https://nx.dev',
          roles: [
            'Senior Software Engineer, November 2021 to present',
            'Software Engineer, June 2021 to November 2021',
          ],
          groups: [
            {
              bullets: [
                'Designed the plugin API behind Project Crystal.',
                'Wrote @nx/dotnet, the first-party .NET plugin.',
                'Led the Rust terminal UI for task runs.',
                'Led SOC 2 compliance since the initial 2024 audit.',
                'Led the public response to the S1ngularity supply-chain attack.',
              ],
            },
          ],
        },
        {
          id: 'twice-baked',
          name: 'Twice Baked Software',
          roles: ['Founder, 2025 to present'],
          groups: [
            {
              bullets: [
                'Sole engineer on Turnbuckle (turnbucklehq.com), a multi-tenant SaaS for running pro wrestling promotions.',
              ],
            },
          ],
        },
        {
          id: 'ups',
          name: 'Universal Plant Services',
          roles: [
            'Software Engineer, March 2020 to May 2021',
            'Software Development Engineer in Test, August 2019 to March 2020',
          ],
          groups: [
            {
              bullets: [
                'Built a task workflow engine with automatic completion and a kanban board.',
                'Built release notes and outage announcements for every product.',
                'Built a shared web and mobile framework in Angular, NativeScript, and Electron.',
              ],
            },
          ],
        },
      ],
    },
    {
      heading: 'Projects',
      more: {
        label: 'craigory.dev/projects',
        href: 'https://craigory.dev/projects',
      },
      entries: [
        {
          id: 'functional-examples',
          name: 'functional-examples',
          href: 'https://craigory.dev/functional-examples',
          lead: 'Runs code examples as tests and generates docs from them.',
        },
        {
          id: 'genealogy-skills',
          name: 'genealogy-skills',
          private: true,
          dates: '2026',
          groups: [
            {
              bullets: [
                '10 agent skills for genealogy research and family tree upkeep.',
                'A CLI with adapters for GEDCOM, MyHeritage, FamilySearch, and Find a Grave.',
              ],
            },
          ],
        },
        {
          id: 'cli-forge',
          name: 'cli-forge',
          href: 'https://craigory.dev/cli-forge',
          lead: 'A TypeScript CLI framework that infers types for every option and argument.',
        },
      ],
    },
    {
      heading: 'Education',
      entries: [
        {
          id: 'morehead-state',
          name: 'Morehead State University',
          dates: '2016 to 2020',
          lead: "Bachelor's degree in Mathematics and Computer Science, 4.0 GPA.",
          groups: [
            {
              heading: 'ACM chapter president, 2017 to 2019',
              bullets: [
                "Led game dev seminars, built the chapter's first site, and set it up to outlast me.",
              ],
            },
            {
              heading: 'Undergraduate research, 2018 to 2019',
              bullets: [
                'First author, "Novel Machine Learning Algorithms for Centrality and Cliques Detection in YouTube Social Networks," IJAIA, 2020.',
              ],
            },
          ],
          links: [
            {
              label: 'doi.org/10.5121/ijaia.2020.11106',
              href: 'https://doi.org/10.5121/ijaia.2020.11106',
            },
          ],
        },
      ],
    },
  ],
  technologies: [
    {
      category: 'Languages',
      items: ['TypeScript', 'Rust', 'C#', 'Python', 'SQL'],
    },
    {
      category: 'Frameworks / Libraries',
      items: [
        'React',
        'Vike',
        'Angular',
        '.NET',
        'Hono',
        'Electron',
        'NativeScript',
        'scikit-learn',
      ],
    },
    {
      category: 'Databases',
      items: ['SQLite', 'Turso', 'MSSQL'],
    },
    {
      category: 'Misc',
      items: [
        'Nx',
        'Node.js',
        'Bun',
        'Cloudflare Workers',
        'GitHub Actions',
        'Playwright',
        'PostHog',
        'Stripe',
      ],
    },
  ],
  talks: [
    {
      title:
        'Smooth Scaling, Happy Coding: Navigating Monorepo Adoption with Nx',
      events: 'KCDC 2025',
      slugs: ['kcdc-2025-monorepo-nx'],
    },
    {
      title: 'Nx Project Crystal + .NET',
      events: 'Launch Nx Conf 2024',
      slugs: ['launch-nx-conf-2024-crystal-dotnet'],
    },
    {
      title: "From Spaghetti to S'mores",
      events: 'THAT Conference Texas and Wisconsin, 2024',
      slugs: [
        'that-conf-wi-2024-spaghetti',
        'that-conf-tx-2024-compartmentalization',
      ],
    },
    {
      title: 'Redefining Projects with Nx: A Dive into the New Inference API',
      events: 'Nx Conf 2023',
      slugs: ['nx-conf-2023-inference'],
    },
    {
      title: 'Benchmarking like a Scientist',
      events: 'THAT Conference Wisconsin and DevUp, 2023',
      slugs: ['devup-2023-benchmarking', 'that-conf-wi-2023-benchmarking'],
    },
    {
      title: 'Full Stack Type Safety Across Languages',
      events: 'THAT Conference Texas and DevUp, 2023',
      slugs: [
        'devup-2023-full-stack-type-safety',
        'that-conf-tx-2023-full-stack-type-safety',
      ],
    },
    {
      title: 'Progressively enhance your DX with Nx',
      events: 'Nx Conf Lite 2022',
      slugs: ['nx-conf-lite-2022-progressive-enhancement'],
    },
    {
      title: 'Nx for your Stack',
      events: 'Nx Conf 2021',
      slugs: ['nx-conf-2021-nx-for-your-stack'],
    },
  ],
};

export function allEntries(data: Resume): Entry[] {
  return data.sections.flatMap((section) => section.entries);
}

/**
 * The slides route only prerenders presentations with markdown slides, so a
 * slides link is offered only for those. Anything else would 404.
 */
export function talkLinks(slugs: string[]): {
  slides: string | undefined;
  recording: string | undefined;
} {
  const presentations = slugs.map((slug) => {
    const presentation = PRESENTATIONS[slug];
    if (!presentation) {
      throw new Error(`Unknown presentation slug: ${slug}`);
    }
    return presentation;
  });
  const withSlides = presentations.find((p) => p.mdUrl);
  return {
    slides: withSlides && `/presentations/view/${withSlides.slug}`,
    recording: presentations.find((p) => p.recordingUrl)?.recordingUrl,
  };
}
