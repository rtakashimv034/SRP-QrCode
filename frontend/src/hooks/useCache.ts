import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECRET_CACHE_KEY;

type CacheOptions = {
  expirationTime?: number; // tempo em minutos
  key: string;
};

export function useCache<T>({ expirationTime = 5, key }: CacheOptions) {
  const encryptData = (data: T): string => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  };

  const decryptData = (encodedData: string): T | null => {
    try {
      const bytes = CryptoJS.AES.decrypt(encodedData, SECRET_KEY);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error("Error while decoding from cache", error);
      return null;
    }
  };

  const getCache = (): T | null => {
    const cachedData = sessionStorage.getItem(key);
    const cacheTimestamp = sessionStorage.getItem(`${key}-timestamp`);

    if (cachedData && cacheTimestamp) {
      const isValid =
        Date.now() - Number(cacheTimestamp) < expirationTime * 60 * 1000;
      if (isValid) {
        return decryptData(cachedData);
      }
    }
    return null;
  };

  const setCache = (data: T) => {
    const encryptedData = encryptData(data);
    sessionStorage.setItem(key, encryptedData);
    sessionStorage.setItem(`${key}-timestamp`, Date.now().toString());
  };

  const clearCache = () => {
    sessionStorage.removeItem(key);
    sessionStorage.removeItem(`${key}-timestamp`);
  };

  return { getCache, setCache, clearCache };
}
