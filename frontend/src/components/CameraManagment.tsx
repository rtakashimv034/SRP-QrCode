import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

type Camera = {
  id: string;
  stadionId: string;
};

export function CameraManagment() {
  const navigate = useNavigate();
  const [cameras, setCameras] = useState<Camera[]>([]);

  useEffect(() => {
    // fetch all cameras
  }, [cameras]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-slate-100">
      <div className="flex flex-col w-1/2 max-h-[75vh] bg-slate-200 gap-2 items-center justify-center px-2 border-2 rounded-lg">
        <div className="flex w-full items-center justify-between border-b-2 border-slate-300 py-2">
          <Button variant={"outline"} onClick={() => navigate("/home")}>
            Back
          </Button>
          <Dialog>
            <DialogTrigger>
              <Button variant={"submit"}>Cadastrar Câmera</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Camera</DialogTitle>
                <DialogDescription>
                  Make sure you of the existing stations.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Station
                  </Label>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <Table className="">
          <TableCaption>Total: 5</TableCaption>
          <TableHeader>
            <TableRow className="child:w-1/3 child:justify-center child:font-bold child:text-slate-800">
              <TableHead>Câmeras</TableHead>
              <TableHead>Estações</TableHead>
              <TableHead>Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5, 6].map((_, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">João</TableCell>
                <TableCell>12</TableCell>
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
