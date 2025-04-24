import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  /** Fix prisma client issue when deploying to Vercel */
  webpack: (config, { isServer }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    if (isServer) config.plugins = [...config.plugins, new PrismaPlugin()]
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return config
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
