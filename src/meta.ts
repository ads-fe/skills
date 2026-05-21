export interface VendorSkillMeta {
  official?: boolean
  source: string
  skills: Record<string, string> // sourceSkillName -> outputSkillName
}

/**
 * Repositories to clone as submodules and generate skills from source
 */
export const submodules: Record<string, string> = {
  // vue: 'https://github.com/vuejs/docs',
  // nuxt: 'https://github.com/nuxt/nuxt',
  // vite: 'https://github.com/vitejs/vite',
  // unocss: 'https://github.com/unocss/unocss',
  // pnpm: 'https://github.com/pnpm/pnpm.io',
  // pinia: 'https://github.com/vuejs/pinia',
  // vitest: 'https://github.com/vitest-dev/vitest',
  // vitepress: 'https://github.com/vuejs/vitepress',
  // nitro: 'https://github.com/nitrojs/nitro',
}

/**
 * Already generated skills, sync with their `skills/` directory
 */
export const vendors: Record<string, VendorSkillMeta> = {
  'vue': {
    official: false,
    source: 'https://github.com/antfu/skills',
    skills: {
      vue: 'vue',
      nuxt: 'nuxt',
      vite: 'vite',
      pnpm: 'pnpm',
      pinia: 'pinia',
      vitest: 'vitest',
      vitepress: 'vitepress',
      // nitro: 'nitro',
    },
  },
  'slidev': {
    official: true,
    source: 'https://github.com/slidevjs/slidev',
    skills: {
      slidev: 'slidev',
    },
  },
  'vueuse': {
    official: true,
    source: 'https://github.com/vueuse/vueuse',
    skills: {
      'vueuse-functions': 'vueuse-functions',
    },
  },
  'tsdown': {
    official: true,
    source: 'https://github.com/rolldown/tsdown',
    skills: {
      tsdown: 'tsdown',
    },
  },
  'vuejs-ai': {
    source: 'https://github.com/vuejs-ai/skills',
    skills: {
      'vue-best-practices': 'vue-best-practices',
      'vue-router-best-practices': 'vue-router-best-practices',
      'vue-testing-best-practices': 'vue-testing-best-practices',
    },
  },
  'turborepo': {
    official: true,
    source: 'https://github.com/vercel/turborepo',
    skills: {
      turborepo: 'turborepo',
    },
  },
  'web-design-guidelines': {
    source: 'https://github.com/vercel-labs/agent-skills',
    skills: {
      'web-design-guidelines': 'web-design-guidelines',
    },
  },
  'partme-ai': {
    source: 'https://github.com/partme-ai/full-stack-skills',
    skills: {
      'vue-ui-skills/element-plus-vue3': 'element-plus-vue3',
    },
  },
  'mcollina': {
    source: 'https://github.com/mcollina/skills',
    skills: {
      'node': 'node',
    },
  },

}

/**
 * Hand-written skills with AdsPower FE preferences/tastes/recommendations
 */
export const manual = [
  'core',
]
