import { api } from "@/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type Props = {
  id: string;
};

export function TrayManagment() {
  const navigate = useNavigate();
  const [trays, setTray] = useState<Props[]>([]);

  async function handleCreateTray() {
    const data: Props = { id: uuidv4().toString() };

    try {
      const { status } = await api.post("/tray-managment", data);

      if (status === 201) {
        setTray([...trays, data]);
      }
    } catch (error) {
      alert(error);
    }
  }

  async function handleDeleteTray(id: string) {
    try {
      const { status } = await api.delete(`/tray-managment/${id}`);

      if (status === 201) {
        setTray(trays.filter(({ id }) => id));
      }
    } catch (error) {
      alert(error);
    }
  }

  async function getAlltrays() {
    try {
      const { data } = await api.get("/tray-managment");
      setTray(data);
    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    getAlltrays();
  }, [trays]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-slate-100">
      <div className="flex flex-col w-2/3 max-h-[75vh] bg-slate-200 gap-2 items-center justify-center px-2 border-2 rounded-lg">
        <div className="flex w-full items-center justify-between border-b-2 border-slate-300 py-2">
          <Button variant={"outline"} onClick={() => navigate("/home")}>
            Back
          </Button>
          <Button variant={"submit"} onClick={handleCreateTray}>
            Gerar Bandeja
          </Button>
        </div>
        <Table>
          <TableCaption>Total: {trays.length}</TableCaption>
          <TableHeader>
            <TableRow className="child:font-bold bg-slate-600 child:text-slate-200">
              <TableHead>Bandeja Id</TableHead>
              <TableHead>Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trays.map(({ id }, i) => (
              <TableRow className={`${i % 2 === 0 && "bg-slate-300"}`} key={id}>
                <TableCell className="font-medium">{id}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant={"destructive"}
                    onClick={() => handleDeleteTray(id)}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
