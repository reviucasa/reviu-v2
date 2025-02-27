import { Stat } from "../sectionAdmin/reviewsStats";
import { classNames } from "@/helpers/classNames";
import { invert } from "lodash";
import { BiMinus, BiArrowToTop, BiArrowToBottom } from "react-icons/bi";

type StatBoxProps = {
  item: Stat;
};

export const StatBox = ({ item }: StatBoxProps) => (
  <div className="px-4 py-5 sm:p-6">
    <dt className="text-base font-normal text-gray-900">{item.name}</dt>
    <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
      <div className="flex items-baseline text-2xl font-semibold text-secondary-500">
        {item.value}
        <span className="ml-2 text-sm font-medium text-gray-500">
          from {item.previousValue}
        </span>
      </div>

      <div
        className={classNames(
          item.changeType === "steady"
            ? "bg-blue-100 text-blue-800"
            : !item.inverted
            ? item.changeType === "increase"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
            : item.changeType === "increase"
            ? "bg-red-100 text-red-800"
            : "bg-green-100 text-green-800",
          "inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0"
        )}
      >
        {item.changeType === "steady" ? (
          <BiMinus
            className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-blue-500"
            aria-hidden="true"
          />
        ) : !item.inverted ? (
          item.changeType === "increase" ? (
            <BiArrowToTop
              className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-green-500"
              aria-hidden="true"
            />
          ) : (
            <BiArrowToBottom
              className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-red-500"
              aria-hidden="true"
            />
          )
        ) : item.changeType === "increase" ? (
          <BiArrowToTop
            className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-red-500"
            aria-hidden="true"
          />
        ) : (
          <BiArrowToBottom
            className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-green-500"
            aria-hidden="true"
          />
        )}
        {item.change.toFixed(item.inverted ? 0 : 1) +
          (item.inverted ? "" : " %")}
      </div>
    </dd>
  </div>
);
