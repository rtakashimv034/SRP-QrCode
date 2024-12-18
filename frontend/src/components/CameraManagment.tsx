import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Button } from "./ui/button";

import { api } from "@/api";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
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
  type: string;
  stadionId?: string;
};

const CAMERAS = [
  "Logitech C920",
  "Razer Kiyo",
  "Microsoft LifeCam HD-3000",
  "Logitech StreamCam",
  "Elgato Cam Link 4K",
];

export function CameraManagment() {
  const navigate = useNavigate();
  const [cameras, setCameras] = useState<Props[]>([]);
  const [cameraType, setCameraType] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function handleCreateCamera(type: string) {
    const data: Props = { id: uuidv4().toString(), type };

    try {
      const { status } = await api.post("/camera-managment", data);

      if (status === 201) {
        setCameras([...cameras, data]);
      }
    } catch (error) {
      alert(error);
    } finally {
      setIsModalOpen(false);
    }
  }

  async function handleDeleteCamera(id: string) {
    try {
      const { status } = await api.delete(`/camera-managment/${id}`);

      if (status === 201) {
        setCameras(cameras.filter(({ id }) => id));
      }
    } catch (error) {
      alert(error);
    }
  }

  async function getAllcameras() {
    try {
      const { data } = await api.get("/camera-managment");
      setCameras(data);
    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    getAllcameras();
  }, [cameras]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="flex flex-col w-2/3 max-h-[75vh] bg-slate-200 gap-2 items-center justify-center px-2 border-2 rounded-lg">
        <div className="flex w-full items-center justify-between border-b-2 border-slate-300 py-2">
          <Button variant={"outline"} onClick={() => navigate("/home")}>
            Back
          </Button>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger>
              <Button variant={"submit"} onClick={() => setIsModalOpen(true)}>
                Cadastrar Câmera
              </Button>
            </DialogTrigger>
            <DialogContent className="flex-row items-center justify-center sm:max-w-[425px]">
              <DialogHeader className="flex items-center">
                <DialogTitle>Create Camera</DialogTitle>
              </DialogHeader>
              <Select onValueChange={(type) => setCameraType(type)}>
                <SelectTrigger className="w-[300px] bg-slate-100">
                  <SelectValue
                    placeholder={cameraType ? cameraType : "Select camera..."}
                  />
                </SelectTrigger>
                <SelectContent>
                  {CAMERAS.map((type, i) => (
                    <SelectItem key={i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DialogFooter className="flex-row justify-center">
                <Button
                  disabled={!cameraType}
                  type="submit"
                  variant={"submit"}
                  onClick={() => handleCreateCamera(cameraType)}
                >
                  Cadastrar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableCaption>Total: {cameras.length}</TableCaption>
          <TableHeader>
            <TableRow className="child:w-1/3 child:justify-center child:font-bold child:text-slate-800">
              <TableHead>CameraID</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estações</TableHead>
              <TableHead>Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cameras.map(({ id, stadionId, type }, i) => (
              <TableRow key={i} className={`${i % 2 === 0 && "bg-slate-300"}`}>
                <TableCell className="font-medium">{id}</TableCell>
                <TableCell>{type}</TableCell>
                <TableCell>
                  {!stadionId ? (
                    "[undefined]"
                  ) : (
                    <div className="flex items-center justify-between">
                      <p>123</p>
                      <Button variant={"associated"}>Desassociar</Button>
                    </div>
                  )}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button variant={"generate"}>Associar Estação</Button>
                  <Button
                    variant={"destructive"}
                    onClick={() => handleDeleteCamera(id)}
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
