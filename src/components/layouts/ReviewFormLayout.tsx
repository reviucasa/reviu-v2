import { Comment } from "@/components/atoms/Comment";
import Stepper from "@/components/atoms/Stepper";
import { StaticImageData } from "next/image";
import { NavbarHome } from "../sectionHome/navbarHome";
import { steps } from "@/staticData";
import StepperHorizontal from "../atoms/StepperHorizontal";

export const ReviewFormLayout = ({
  title,
  children,
  comment,
  commentTitle,
  image,
  imageAlt,
}: {
  title?: string;
  children: React.ReactNode;
  comment?: string;
  commentTitle?: string;
  image?: StaticImageData;
  imageAlt?: string;
}) => {
  return (
    <div>
      <NavbarHome search={false} />
      <div className="grid p-4 lg:gap-14 lg:px-14 pb-20 lg:grid-rows-1 lg:grid-cols-[3fr_6fr_3fr]">
        {/* desktop component */}
        <div className="hidden lg:block">
          <div className="h-full fixed">
            <div className="flex flex-col justify-between h-full pb-28">
              <div>
                <Stepper steps={steps} />
              </div>
            </div>
          </div>
        </div>
        {/* mobile component */}
        <div className="lg:hidden block">
          <StepperHorizontal steps={steps} />
        </div>
        {/* mobile on top / desktop to right */}
        <div className="lg:order-3">
          {/* mobile title */}
          <h3 className="lg:hidden pb-6 mt-8">{title}</h3>
          {(comment || commentTitle) && (
            <Comment
              className="mb-8"
              image={image}
              imageAlt={imageAlt}
              comment={comment}
              commentTitle={commentTitle}
            />
          )}
        </div>
        {/* mobile below / desktop center */}
        <div className="lg:order-2">
          {/* desktop title */}
          <h3 className="hidden lg:block">{title}</h3>
          <div className="mt-6 lg:w-100 lg:p-8 lg:bg-white lg:rounded-2xl lg:my-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
