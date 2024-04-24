import { Button } from "@/components/atoms/Button";
import { Dialog } from "@/components/atoms/Dialog";
import Image, { StaticImageData } from "next/image";

type HowEnvironmentDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  description: string;
  title?: string;
  image?: StaticImageData;
  imageBeforeContent?: boolean;
  onAccept?: () => void;
  acceptText: string;
};

export const AcceptDialog = ({
  isOpen,
  setIsOpen,
  description,
  title,
  image,
  imageBeforeContent = false,
  onAccept,
  acceptText,
}: HowEnvironmentDialogProps) => {
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
      image={imageBeforeContent ? image : undefined}
      className="text-center max-w-[500px]"
      onClose={onAccept}
    >
      <div className="w-full flex flex-col items-center space-y-10 justify-center mt-10">
        {image && !imageBeforeContent && (
          <Image
            src={image}
            alt="dialogImage"
            width={100}
            height={100}
            className="w-12 h-auto"
          />
        )}
        <Button buttonClassName="btn-primary-500" onClick={onClickAccept}>
          {acceptText}
        </Button>
      </div>
    </Dialog>
  );
};
