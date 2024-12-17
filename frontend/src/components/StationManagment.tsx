import { api } from "@/api";
import { Label } from "@radix-ui/react-label";
import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
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
  const [isQROpen, setIsQROpen] = useState<string | null>(null);

  const svgRefs = useRef<{ [key: string]: SVGSVGElement | null }>({});

  async function handleCreateStation(sector: string) {
    const data: Props = { id: uuidv4().toString(), sector };

    try {
      const { status } = await api.post("/station-managment", data);

      if (status === 201) {
        setStations([...stations, data]);
      }
    } catch (error) {
      alert(error);
    } finally {
      setIsModalOpen(false);
    }
  }

  async function handleDeleteStation(id: string) {
    try {
      const { status } = await api.delete(`/station-managment/${id}`);

      if (status === 201) {
        setStations(stations.filter(({ id }) => id));
      }
    } catch (error) {
      alert(error);
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

  async function downloadQRCode(id: string) {
    const qrCodeElement = svgRefs.current[id];

    if (qrCodeElement) {
      const svgData = new XMLSerializer().serializeToString(qrCodeElement);
      const img = new Image();
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 256;
        canvas.height = 256;

        ctx!.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = `qrcode-${id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      };

      img.src = url;
    }
  }

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
                    Setor
                  </Label>
                  <Input
                    id="name"
                    onChange={(e) => setSector(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleCreateStation(sector);
                      }
                    }}
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
        <Table>
          <TableCaption>Total: {stations.length}</TableCaption>
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
                  <Dialog
                    open={isQROpen === id}
                    onOpenChange={() => setIsQROpen(isQROpen ? null : id)}
                  >
                    <DialogTrigger>
                      <Button variant={"generate"}>Gerar QRcode</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] gap-5 flex-row justify-center">
                      <DialogHeader>
                        <DialogTitle className="flex justify-center">
                          QRcode (
                          <span className="font-bold">
                            {id.substring(0, 5).trimEnd()}
                          </span>
                          ) - {sector}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="flex-row justify-center">
                        <QRCode
                          id={`qrcode-${id}`}
                          value={id + sector}
                          viewBox="0 0 256 256"
                          ref={(el: never) => (svgRefs.current[id] = el)}
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          variant={"destructive"}
                          onClick={() => setIsQROpen(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant={"submit"}
                          onClick={() => downloadQRCode(id)}
                        >
                          Download
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant={"destructive"}
                    onClick={() => handleDeleteStation(id)}
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
