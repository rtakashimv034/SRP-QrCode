import axios from "axios";

const domain = import.meta.env.VITE_DOMAIN;
const PORT = 3333;

const api = axios.create({
  baseURL: `http://${domain}:${PORT}/api/v1`,
});

export { api };
