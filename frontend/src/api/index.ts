import axios from "axios";

const domain = import.meta.env.VITE_LOCAL;
const PORT = 3333;

export const baseURL = `http://${domain}:${PORT}/api/v1`;

const api = axios.create({
  baseURL,
});

export { api };
