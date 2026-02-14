import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Prowl Docs',
  tagline: 'CLI-first QA testing tool for deterministic web testing',
  favicon: 'img/prowl-logo.png',

  future: {
    v4: true,
  },

  url: 'https://docs.prowlqa.dev',
  baseUrl: '/',

  organizationName: 'Prowl-qa',
  projectName: 'prowl-docs',

  onBrokenLinks: 'throw',

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
        'New to Prowl? <a href="/">Run your first deterministic smoke test in about a minute.</a>',
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
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/Prowl-qa/prowl',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://www.npmjs.com/package/prowlqa',
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
            {label: 'GitHub', href: 'https://github.com/Prowl-qa/prowl'},
            {label: 'npm', href: 'https://www.npmjs.com/package/prowlqa'},
            {label: 'Community Hub', href: 'https://github.com/Prowl-qa/prowl-hub'},
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
