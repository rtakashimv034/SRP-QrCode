// const domain = import.meta.env.VITE_CALLIDUS;
const domain = "192.169.149.38";
const PORT = 3333;

const baseURL = `http://${domain}:${PORT}/api/v1`;

export { baseURL, domain, PORT };
