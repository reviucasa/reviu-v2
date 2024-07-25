"use client";
import React, { useState } from "react";

interface CopyToClipboardProps {
  children: React.ReactNode;
  textToCopy: string;
}

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  children,
  textToCopy,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    });
  };

  return (
    <div
      onClick={handleCopy}
      className="inline-block cursor-pointer relative hover:text-secondary-500 active:text-secondary-300"
    >
      <span className="">{children}</span>
      {copied && (
        <span className="absolute top-[0px] right-[-40px] bg-secondary-300 text-white px-1 leading-3 rounded text-[7px]">
          Copied!
        </span>
      )}
    </div>
  );
};

export default CopyToClipboard;
