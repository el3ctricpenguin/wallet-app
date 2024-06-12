/** @type {import('next').NextConfig} */
const nextConfig = {
    i18n: {
        locales: ["en", "ja"],
        defaultLocale: "en",
        localeDetection: false,
    },
};

module.exports = nextConfig;
