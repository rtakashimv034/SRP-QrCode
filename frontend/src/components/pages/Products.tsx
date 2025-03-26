import { api } from "@/api/axios";
import { socket } from "@/api/socket";
import { PathsProps } from "@/types/paths";
import { ProductProps } from "@/types/products";
import { Box, ChevronDown, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Schedule } from "../cards/OccurrenceCard";
import { ProductCard } from "../cards/ProductCard";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { Input } from "../ui/input";

export const monthNames = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const monthsMap = new Map<string, number>();

monthNames.forEach((month, index) => {
  monthsMap.set(month, index + 1);
});

export function Products() {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductProps[]>([]);
  const [id, setId] = useState<string>("");
  const [schedule, setSchedule] = useState<Schedule>("Diário");
  const [month, setMonth] = useState<string>(monthNames[new Date().getMonth()]);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [day, setDay] = useState<string>("");
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  const fetchProducts = async () => {
    try {
      const { data, status } = await api.get("/products");
      if (status === 200) {
        setProducts(data);
        setFilteredProducts(data);

        // Extrai anos dos produtos
        const productYears = data.map((product: ProductProps) => {
          const date = new Date(product.createdAt);
          return date.getFullYear();
        });

        // Se não houver produtos, usa o ano atual
        const minYear =
          productYears.length > 0
            ? Math.min(...productYears)
            : new Date().getFullYear();
        const maxYear = new Date().getFullYear();

        // Cria array de anos disponíveis
        const years = [];
        for (let y = minYear; y <= maxYear; y++) {
          years.push(y);
        }

        setAvailableYears(years);
        setYear(maxYear); // Define o ano atual como padrão
      }
    } catch (error) {
      console.log(error);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Filtro por ID (SN)
    if (id) {
      filtered = filtered.filter((product) => product.SN.includes(id));
    }

    // Filtro por data (só aplica se não for "Anual")
    if (schedule !== "Anual") {
      filtered = filtered.filter((product) => {
        const productDate = new Date(product.createdAt);
        const productYear = productDate.getFullYear();
        const productMonth = productDate.getMonth() + 1;
        const productDay = productDate.getDate();

        // Para "Mensal" e "Diário", filtra por ano
        if (productYear !== year) return false;

        // Para "Diário", filtra também por mês
        if (schedule === "Diário") {
          const selectedMonth = monthsMap.get(month);
          if (productMonth !== selectedMonth) return false;

          // E por dia se especificado
          if (day) {
            return productDay === parseInt(day);
          }
        }

        return true;
      });
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    socket.on("create-path", (path: PathsProps) => {
      setProducts((prev) => {
        if (path.product) {
          const existingProductIndex = prev.findIndex(
            (p) => p.SN === path.prodSN
          );
          // Se o produto já existe, atualize-o
          if (existingProductIndex !== -1) {
            const updatedProducts = [...prev];
            updatedProducts[existingProductIndex] = path.product;
            return updatedProducts;
          } else {
            return [...prev, path.product];
          }
        } else {
          return [...prev];
        }
      });
    });

    return () => {
      socket.off("create-path");
    };
  }, []);

  useEffect(() => {
    applyFilters();
  }, [id, schedule, month, year, day, products]);

  return (
    <DefaultLayout>
      <header className="grid grid-cols-[40%_60%] pb-3 items-center justify-between">
        <div className="flex flex-row items-center gap-6">
          <div className="flex flex-row items-center gap-2">
            <Box className="size-8 fill-black text-white" />
            <h1 className="text-lg font-bold whitespace-nowrap">
              Painel de Produtos
            </h1>
          </div>
          <p className="text-sm text-gray-500 whitespace-nowrap">
            {filteredProducts.length} produtos{" "}
            {schedule === "Anual" ? "cadastrados" : "filtrados"}.
          </p>
        </div>
        <div className="flex w-full flex-row items-center gap-5 justify-end">
          <div className="flex w-full flex-row items-center gap-2 justify-end">
            {schedule === "Diário" && (
              <>
                <div className="relative w-full max-w-36">
                  <Search
                    className="absolute left-2.5 top-1.5 text-gray-400"
                    size={16}
                  />
                  <Input
                    type="number"
                    placeholder="Buscar por dia"
                    className="pl-8 rounded-xl h-7 no-spinner border border-gray-500"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    min="1"
                    max="31"
                  />
                </div>
                <div className="right-24 child:text-sm child:opacity-70 flex flex-row items-center gap-2 justify-end">
                  <label htmlFor="month-select">Mês: </label>
                  <select
                    id="month-select"
                    value={month}
                    className="rounded-md border border-gray-500 hover:cursor-pointer"
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    {monthNames.map((monthName, index) => (
                      <option key={index} value={monthName}>
                        {monthName}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            {schedule !== "Anual" && (
              <div className="flex flex-row items-center gap-2">
                <div className="right-24 child:text-sm child:opacity-70 flex flex-row items-center gap-2 justify-end">
                  <label htmlFor="month-select">Ano: </label>
                  <select
                    id="year-select"
                    value={year}
                    className="rounded-md border border-gray-500 hover:cursor-pointer"
                    onChange={(e) => setYear(Number(e.target.value))}
                  >
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <div className="flex flex-row items-center gap-2">
              <label className="text-sm font-medium">{schedule}</label>
              <div className="relative flex flex-row items-center">
                <select
                  className="border border-black hover:cursor-pointer hover:brightness-95 transition-all rounded-md size-5 child:text-sm appearance-none p-2"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value as Schedule)}
                >
                  <option value="Diário">Diário</option>
                  <option value="Mensal">Mensal</option>
                  <option value="Anual">Anual</option>
                </select>
                <div className="absolute flex justify-center right-[2px] top-[3px] items-center pointer-events-none">
                  <ChevronDown className="size-4" />
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full max-w-40">
            <Search className="absolute left-3 top-2 text-gray-400" size={20} />
            <span className="text-gray-500 absolute left-10 top-1.5">
              PDT-{" "}
            </span>
            <input
              type="number"
              placeholder=""
              defaultValue={""}
              className="pl-[74px] text-gray-600 h-9 border border-slate-200 w-full text-lg rounded-2xl bg-gray-100 no-spinner"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        <div className=" h-full overflow-y-auto no-scrollbar">
          <div className="flex flex-1 px-10 py-3 flex-col items-center gap-4">
            {filteredProducts.map((data) => (
              <ProductCard schedule={schedule} product={data} key={data.SN} />
            ))}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
