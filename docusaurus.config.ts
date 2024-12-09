import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Atelier",
  tagline: "",
  url: "https://fgarnadi.github.io",
  baseUrl: "/",
  organizationName: "fgarnadi", // Usually your GitHub org/user name.
  projectName: "fgarnadi.github.io", // Usually your repo name.

  favicon: "img/favicon.ico",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  headTags: [
    {
      tagName: "meta",
      attributes: {
        name: "referrer",
        content: "no-referrer",
      },
    },
  ],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          routeBasePath: "perpus",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",

          postsPerPage: 10,
          blogSidebarCount: 0,
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
        gtag: {
          trackingID: "G-HGT1X9L5SW",
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    navbar: {
      title: "Atelier",
      hideOnScroll: true,
      items: [
        {
          to: "/blog",
          label: "Blog",
          position: "right",
        },
        {
          type: "docSidebar",
          sidebarId: "docsSidebar",
          position: "right",
          label: "Perpus",
        },
        {
          href: "https://github.com/fgarnadi/fgarnadi.github.io",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      defaultLanguage: "python",
      additionalLanguages: ["java", "elixir"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
