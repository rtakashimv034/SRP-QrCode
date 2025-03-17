const domain = import.meta.env.VITE_LOCAL;
const PORT = 3333;

const baseURL = `http://${domain}:${PORT}/api/v1`;

export { baseURL, domain, PORT };
