import { Button } from "@/components/atoms/Button";
import { Dialog } from "@/components/atoms/Dialog";

type DialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  description: string;
  title?: string;
  onAccept?: () => void;
  acceptText: string;
};

export const CookiesDialog = ({
  isOpen,
  setIsOpen,
  description,
  title,
  onAccept,
  acceptText,
}: DialogProps) => {
  const onClickAccept = () => {
    if (onAccept) onAccept();
    setIsOpen(false);
  };
  return (
    <Dialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={title}
      description={description}
      className="text-center max-w-[500px]"
      onClose={onAccept}
    >
      <div className="w-full flex flex-col items-center space-y-10 justify-center mt-10">
        <Button buttonClassName="btn-primary-500" onClick={onClickAccept}>
          {acceptText}
        </Button>
      </div>
    </Dialog>
  );
};
