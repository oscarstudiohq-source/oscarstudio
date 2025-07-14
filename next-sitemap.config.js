/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://www.tuesdaytrim.com',
    generateRobotsTxt: true,
    additionalPaths: async (config) => [
        await config.transform(config, '/contact'),
        await config.transform(config, '/terms'),
        await config.transform(config, '/privacy-policy'),
        await config.transform(config, '/refund-policy'),
    ],
};
