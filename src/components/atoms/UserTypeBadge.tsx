import { UserStatus, UserType } from "@/models/user";

export const UserTypeBadge = ({ type }: { type: UserType }) => {
  const color =
    type == UserType.User
      ? { bg: "bg-blue-100", text: "text-blue-800", fill: "fill-blue-500" }
      : {
          bg: "bg-purple-100",
          text: "text-purple-800",
          fill: "fill-purple-500",
        };

  return (
    <span
      className={`inline-flex items-center gap-x-1.5 rounded-full ${color.bg} px-1.5 py-0.5 text-xs font-medium ${color.text}`}
    >
      <svg
        className={`h-1.5 w-1.5 ${color.fill}`}
        viewBox="0 0 6 6"
        aria-hidden="true"
      >
        <circle cx={3} cy={3} r={3} />
      </svg>
      {type.toLocaleUpperCase()}
    </span>
  );
};
