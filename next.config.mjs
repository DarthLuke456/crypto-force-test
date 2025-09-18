/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deshabilitar Fast Refresh temporalmente para estabilizar autenticación
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Deshabilitar Hot Module Replacement
      config.plugins = config.plugins.filter(plugin => 
        plugin.constructor.name !== 'HotModuleReplacementPlugin'
      );
    }
    return config;
  },
  // Configuración adicional para estabilizar el desarrollo
  experimental: {
    // Deshabilitar optimizaciones que pueden causar re-renders
    optimizePackageImports: false,
  }
};

export default nextConfig;
