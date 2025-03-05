type CacheOptions = {
  expirationTime?: number; // tempo em minutos
  key: string;
};

export function useCache<T>({ expirationTime = 5, key }: CacheOptions) {
  const getCache = (): T | null => {
    const cachedData = localStorage.getItem(key);
    const cacheTimestamp = localStorage.getItem(`${key}-timestamp`);

    if (cachedData && cacheTimestamp) {
      const isValid =
        Date.now() - Number(cacheTimestamp) < expirationTime * 60 * 1000;
      if (isValid) {
        return JSON.parse(cachedData);
      }
    }
    return null;
  };

  const setCache = (data: T) => {
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(`${key}-timestamp`, Date.now().toString());
  };

  const clearCache = () => {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}-timestamp`);
  };

  return { getCache, setCache, clearCache };
}
