/** @type {import('next').NextConfig} */
const nextConfig = {
    images : {
        domains : ["t4.ftcdn.net","lh3.googleusercontent.com"]
    },
    outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/.prisma/client/*.node'],
  },
    
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  
}

export default nextConfig