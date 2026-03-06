import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // required for Docker / Railway (produces .next/standalone)
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
