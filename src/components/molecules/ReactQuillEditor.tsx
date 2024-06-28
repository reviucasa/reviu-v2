import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useMemo } from "react";

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className: string;
}

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "indent",
  "link",
  "image",
];

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
  ],
};

const ReactQuillEditor: React.FC<QuillEditorProps> = ({
  value = "",
  onChange,
  placeholder,
  className,
}) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  );

  return (
    <ReactQuill
      onChange={onChange}
      value={value}
      className={className}
      placeholder={placeholder}
      modules={modules}
      formats={formats}
    />
  );
};

export default ReactQuillEditor;
