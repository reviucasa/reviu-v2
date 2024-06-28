"use client";
import { WeeklyStats, getAllWeeklyStats } from "@/models/stats";
import { useQuery } from "@tanstack/react-query";
import { BounceLoader } from "react-spinners";
import { StatBox } from "../atoms/StatBox";
import { ReviewsColumnsChart } from "../charts/ReviewsColumnsChart";
import { UsersColumnsChart } from "../charts/UsersColumnsChart";

export interface Stat {
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changeType: "increase" | "decrease" | "steady";
  inverted?: boolean;
}

export default function SectionStats() {
  const { data, isFetching } = useQuery<WeeklyStats[] | undefined, Error>({
    queryKey: ["weeklyStats"],
    queryFn: () => getAllWeeklyStats(),
  });

  let stats: Stat[] = [];
  let avgStats: Stat[] = [];

  if (!isFetching && data) {
    const usersStat = formatStat(
      "Total Users",
      data.map((e) => e.usersCount)
    );
    stats.push(usersStat);

    const reviewsStat = formatStat(
      "Total Reviews",
      data.map((e) => e.reviewsCount)
    );
    stats.push(reviewsStat);

    const reportsStat = formatStat(
      "Total Reports",
      data.map((e) => e.reportsCount),
      true
    );
    stats.push(reportsStat);

    // Average Stats

    const usersAvgStat = formatStat(
      "New Users",
      data.map((e) => e.usersWeekly)
    );
    avgStats.push(usersAvgStat);

    const reviewsAvgStat = formatStat(
      "New Reviews",
      data.map((e) => e.reviewsWeekly)
    );
    avgStats.push(reviewsAvgStat);

    const reportsAvgStat = formatStat(
      "New Reports",
      data.map((e) => e.reportsWeekly),
      true
    );
    avgStats.push(reportsAvgStat);
  }

  return (
    <div className="pb-6 space-y-12">
      <div className=" space-y-8">
        <h3 className="text-2xl font-semibold leading-6 text-gray-900">
          Weekly Stats
        </h3>
        {isFetching || !data ? (
          <div className="flex justify-center items-center h-[108px]  rounded-lg bg-white shadow ">
            <BounceLoader color="#d8b4fe" size={60} />
          </div>
        ) : (
          <dl className=" grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-3 md:divide-x md:divide-y-0">
            {stats.map((item) => (
              <StatBox key={item.name} item={item} />
            ))}
          </dl>
        )}

        {isFetching || !data ? (
          <div className="flex justify-center items-center h-[108px]  rounded-lg bg-white shadow ">
            <BounceLoader color="#d8b4fe" size={60} />
          </div>
        ) : (
          <dl className=" grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-3 md:divide-x md:divide-y-0">
            {avgStats.map((item) => (
              <StatBox key={item.name} item={item} />
            ))}
          </dl>
        )}
      </div>
      <div className=" space-y-8">
        <h3 className="text-2xl font-semibold leading-6 text-gray-900">
          History
        </h3>

        {isFetching || !data ? (
          <div className="flex justify-center items-center h-[330px]  rounded-lg bg-white shadow ">
            <BounceLoader color="#d8b4fe" size={60} />
          </div>
        ) : (
          <dl className=" grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-2 md:divide-x md:divide-y-0">
            <UsersColumnsChart data={data.toReversed()} />
            <ReviewsColumnsChart data={data.toReversed()} />
          </dl>
        )}
      </div>
    </div>
  );
}

const formatStat = (
  name: string,
  data: number[],
  inverted?: boolean | undefined
): Stat => {
  const current = data[0];
  const prev = data[1];

  return {
    name,
    value: current,
    previousValue: prev,
    change: inverted ? current - prev : (current / prev - 1) * 100,
    changeType:
      current > prev ? "increase" : current < prev ? "decrease" : "steady",
    inverted,
  } as Stat;
};
