const path = require('path')

/** @type {import('next-i18next').UserConfig} */
module.exports = {
    i18n: {
      defaultLocale: 'en',
      locales: ['en', 'fr'],
      localePath: path.resolve('./public/locales'),
      reloadOnPrerender: process.env.NODE_ENV == 'development'
    },
  }