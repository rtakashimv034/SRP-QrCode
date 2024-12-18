import { api } from "@/api";
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
  const [isQROpen, setIsQROpen] = useState<string | null>(null);

  const svgRefs = useRef<{ [key: string]: SVGSVGElement | null }>({});

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
                          )
                        </DialogTitle>
                      </DialogHeader>
                      <div className="flex-row justify-center">
                        <QRCode
                          id={`qrcode-${id}`}
                          value={id}
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
