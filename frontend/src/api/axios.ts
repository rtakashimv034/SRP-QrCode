import axios from "axios";
import { baseURL } from ".";

const api = axios.create({ baseURL });

export { api };
