import { api } from "@/api";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
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
  sector: string;
};

export function StationManagment() {
  const navigate = useNavigate();
  const [stations, setStations] = useState<Props[]>([]);
  const [sector, setSector] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function handleCreateStation(sector: string) {
    const data: Props = { id: uuidv4().toString(), sector };

    try {
      const { status } = await api.post("/station-managment", data);

      if (status === 201) {
        setStations([...stations, { id: uuidv4().toString(), sector }]);
      }
    } catch (error) {
      alert(error);
    } finally {
      setIsModalOpen(false);
    }
  }

  async function getAllStations() {
    try {
      const { data } = await api.get("/station-managment");
      setStations(data);
    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    getAllStations();
  }, [stations]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-slate-100">
      <div className="flex flex-col w-2/3 max-h-[75vh] bg-slate-200 gap-2 items-center justify-center px-2 border-2 rounded-lg">
        <div className="flex w-full items-center justify-between border-b-2 border-slate-300 py-2">
          <Button variant={"outline"} onClick={() => navigate("/home")}>
            Back
          </Button>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger>
              <Button variant={"submit"} onClick={() => setIsModalOpen(true)}>
                Cadastrar Estação
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Criar Estação</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Sector
                  </Label>
                  <Input
                    id="name"
                    onChange={(e) => setSector(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={() => handleCreateStation(sector)}
                >
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <Table className="">
          <TableCaption>Total: 5</TableCaption>
          <TableHeader>
            <TableRow className="child:w-1/3 child:justify-center child:font-bold child:text-slate-800">
              <TableHead>Id</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stations.map(({ id, sector }, i) => (
              <TableRow className={`${i % 2 === 0 && "bg-slate-300"}`} key={id}>
                <TableCell className="font-medium">{id}</TableCell>
                <TableCell>{sector}</TableCell>
                <TableCell className="flex gap-2">
                  <Button variant={"secondary"}>Desassociar Estação</Button>
                  <Button variant={"destructive"}>Excluir</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
