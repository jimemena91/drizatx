import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer, dev }) => {
    // Optimizaciones para desarrollo
    if (dev) {
      config.cache = false;
      config.parallelism = 1;
    }

    // Evitar carga de módulos innecesarios
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Optimizar manejo de fuentes
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'static/fonts/',
          publicPath: '/_next/static/fonts/',
        },
      },
    });

    return config;
  },
  experimental: {
    workerThreads: false,
    cpus: 1,
    optimizeCss: true,
    scrollRestoration: true,
  },
  compress: true,
  onDemandEntries: {
    maxInactiveAge: 1000 * 60 * 60, // 1 hora
    pagesBufferLength: 5,
  },
  // Configuración para manejar rutas estáticas y dinámicas
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  // Para evitar problemas de memoria con Tailwind
  productionBrowserSourceMaps: false,
};

export default nextConfig;