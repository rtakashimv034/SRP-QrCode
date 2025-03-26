import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type Props = {
  additionalText?: string;
  action: string;
  isOpen: boolean;
  setIsOpen(isOpen: boolean): void;
};

export function ErrorDialog({
  action,
  additionalText,
  isOpen,
  setIsOpen,
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Falha ao {action}</DialogTitle>
          <DialogDescription>
            {additionalText && (
              <>
                {additionalText} <br />
              </>
            )}
            {additionalText ? "Ou verifique" : "Verifique"} a sua conexão com a
            internet ou tente novamente mais tarde.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant={"destructive"} onClick={() => setIsOpen(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
