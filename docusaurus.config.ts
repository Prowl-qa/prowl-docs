import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Prowl Docs',
  tagline: 'CLI-first QA testing — made for agents, controlled by humans',
  favicon: 'img/favicon.ico',

  headTags: [
    {tagName: 'link', attributes: {rel: 'icon', type: 'image/png', sizes: '32x32', href: '/img/favicon-32x32.png'}},
    {tagName: 'link', attributes: {rel: 'icon', type: 'image/png', sizes: '16x16', href: '/img/favicon-16x16.png'}},
    {tagName: 'link', attributes: {rel: 'apple-touch-icon', sizes: '180x180', href: '/img/apple-touch-icon.png'}},
  ],

  future: {
    v4: true,
  },

  url: 'https://docs.prowl.tools',
  baseUrl: '/',

  organizationName: 'prowl-tools',
  projectName: 'prowl-docs',

  onBrokenLinks: 'throw',

  customFields: {
    feedbackApiUrl: 'https://prowl-feedback.prowl.tools/api/feedback',
  },

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          // Internal project-management files kept in-repo for backlog tooling,
          // not published as site pages.
          exclude: ['backlog.md', 'resolved.md', 'research/**'],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/prowl-stickers-1.png',
    announcementBar: {
      id: 'quickstart-banner',
      content:
        'Made for agents, controlled by humans. <a href="/agents">See how AI agents use Prowl \u2192</a>',
      isCloseable: true,
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Prowl Docs',
      logo: {
        alt: 'Prowl',
        src: 'img/prowl-logo.png',
      },
      items: [
        {
          href: 'https://prowl.tools/blog',
          label: 'Blog',
          position: 'right',
        },
        {
          href: 'https://prowl.tools',
          label: 'Home',
          position: 'right',
        },
        {
          href: 'https://hub.prowl.tools',
          label: 'Hub',
          position: 'right',
        },
        {
          href: 'https://github.com/prowl-tools/prowl',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://www.npmjs.com/package/prowl-tools',
          label: 'npm',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Getting Started', to: '/'},
            {label: 'Step Types', to: '/step-types'},
            {label: 'Configuration', to: '/configuration'},
          ],
        },
        {
          title: 'Resources',
          items: [
            {label: 'Blog', href: 'https://prowl.tools/blog'},
            {label: 'prowl.tools', href: 'https://prowl.tools'},
            {label: 'GitHub', href: 'https://github.com/prowl-tools/prowl'},
            {label: 'npm', href: 'https://www.npmjs.com/package/prowl-tools'},
            {label: 'Community Hub', href: 'https://hub.prowl.tools'},
          ],
        },
        {
          title: 'Get in Touch',
          items: [
            {label: 'Email', href: 'mailto:info@prowl.tools'},
            {label: 'Visit us on X', href: 'https://x.com/prowlqa'},
          ],
        },
      ],
      copyright: `Copyright \u00a9 ${new Date().getFullYear()} Prowl. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'yaml', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
