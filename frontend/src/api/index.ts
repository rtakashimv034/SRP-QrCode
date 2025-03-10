import axios from "axios";

const domain = import.meta.env.VITE_CALLIDUS;
const PORT = 3333;

const api = axios.create({
  baseURL: `http://10.10.51.105:${PORT}/api/v1`,
});

export { api };
