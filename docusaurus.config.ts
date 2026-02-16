import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Prowl QA Docs',
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

  url: 'https://docs.prowlqa.dev',
  baseUrl: '/',

  organizationName: 'Prowl-qa',
  projectName: 'prowl-docs',

  onBrokenLinks: 'throw',

  customFields: {
    feedbackApiUrl: 'https://prowl-feedback.prowlqa.dev/api/feedback',
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
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/prowl-qa-stickers-1.png',
    announcementBar: {
      id: 'quickstart-banner',
      content:
        'Made for agents, controlled by humans. <a href="/agents">See how AI agents use ProwlQA \u2192</a>',
      isCloseable: true,
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Prowl QA Docs',
      logo: {
        alt: 'Prowl QA',
        src: 'img/prowl-qa-logo.png',
      },
      items: [
        {
          href: 'https://prowlqa.dev',
          label: 'Home',
          position: 'right',
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
            {label: 'prowlqa.dev', href: 'https://prowlqa.dev'},
            {label: 'GitHub', href: 'https://github.com/Prowl-qa/prowl'},
            {label: 'npm', href: 'https://www.npmjs.com/package/prowlqa'},
            {label: 'Community Hub', href: 'https://github.com/Prowl-qa/prowl-hub'},
          ],
        },
        {
          title: 'Get in Touch',
          items: [
            {label: 'Email', href: 'mailto:info@prowlqa.dev'},
            {label: 'Visit us on X', href: 'https://x.com/prowlqa'},
          ],
        },
      ],
      copyright: `Copyright \u00a9 ${new Date().getFullYear()} Prowl QA. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'yaml', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
