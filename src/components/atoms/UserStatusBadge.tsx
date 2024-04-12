import { UserStatus } from "@/models/user";

export const UserStatusBadge = ({ status }: { status: UserStatus }) => {
  const color =
    status == UserStatus.Banned
      ? { bg: "bg-red-100", text: "text-red-800", fill: "fill-red-500" }
      : { bg: "bg-green-100", text: "text-green-800", fill: "fill-green-500" };

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
      {status.toLocaleUpperCase()}
    </span>
  );
};
