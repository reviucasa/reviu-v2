"use client";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { BiChevronUp } from "react-icons/bi";

interface PropsFaq {
  question: string;
  answer: string;
}

export const FaqUnit = ({ question, answer }: PropsFaq) => {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <DisclosureButton className="flex justify-between text-left bg-white w-full border-solid border rounded-md font-bold mt-2 py-4 px-6">
            {question}
            <BiChevronUp
              size={22}
              className={`${
                open ? "" : "rotate-180 transform"
              } text-primary-300`}
            />
          </DisclosureButton>
          <DisclosurePanel className="bg-gray-100 w-full py-2 px-4 rounded-md mt-1 mb-3 font-normal">
            {answer}
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};
