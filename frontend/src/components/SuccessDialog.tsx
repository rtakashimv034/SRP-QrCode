import { CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface SuccessDialogProps {
  title: string;
  message: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onClose?: () => void;
}

export function SuccessDialog({
  title,
  message,
  isOpen,
  setIsOpen,
  onClose,
}: SuccessDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-green-600">{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onClose?.();
            }}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
