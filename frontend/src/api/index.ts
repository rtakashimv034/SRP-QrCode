const domain = import.meta.env.VITE_DOMAIN;
const PORT = 3333;

const baseURL = `http://${domain}:${PORT}/api/v1`;

export { baseURL, domain, PORT };
