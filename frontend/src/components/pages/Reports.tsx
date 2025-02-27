import { DefaultLayout } from "../layouts/DefaultLayout";

// type Props = {
//   tray: number;
//   stations: number;
//   cameras: number;
// };

export function Reports() {
  // const navigate = useNavigate();
  // const [registered, setRegistered] = useState<Props>({
  //   tray: 0,
  //   stations: 0,
  //   cameras: 0,
  // });
  // const [periodo, setPeriodo] = useState("mensal");

  // async function fetchQuantity() {
  //   try {
  //     const cameras = await api.get<[]>("/camera-managment");
  //     const stations = await api.get<[]>("/station-managment");
  //     const trays = await api.get<[]>("/tray-managment");

  //     setRegistered({
  //       tray: trays.data.length,
  //       stations: stations.data.length,
  //       cameras: cameras.data.length,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // useEffect(() => {
  //   fetchQuantity();
  // }, [registered]);

  return (
    <DefaultLayout>
      <div className="">content</div>
    </DefaultLayout>
  );
}
