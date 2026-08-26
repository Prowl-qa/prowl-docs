import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'getting-started',
    {
      type: 'category',
      label: 'Reference',
      collapsed: false,
      items: [
        'step-types',
        'assertions',
        'configuration',
        'variables',
        'selectors',
      ],
    },
    {
      type: 'category',
      label: 'Targets',
      collapsed: false,
      items: [
        'macos-target',
        'android',
        'ios',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      collapsed: false,
      items: [
        'auth',
        'watch-mode',
        'agents',
        'mcp',
        'starter-templates',
      ],
    },
    'troubleshooting',
  ],
};

export default sidebars;
