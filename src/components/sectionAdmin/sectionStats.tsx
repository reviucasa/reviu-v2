"use client";
import { WeeklyStats, getAllWeeklyStats } from "@/models/stats";
import { useQuery } from "@tanstack/react-query";
import { BounceLoader } from "react-spinners";
import { StatBox } from "../atoms/StatBox";

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
    <div className="pb-6">
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        Last Week Stats
      </h3>
      {isFetching || !data ? (
        <div className="flex justify-center items-center h-[108px] mt-5 rounded-lg bg-white shadow ">
          <BounceLoader color="#d8b4fe" size={60} />
        </div>
      ) : (
        <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-3 md:divide-x md:divide-y-0">
          {stats.map((item) => (
            <StatBox key={item.name} item={item} />
          ))}
        </dl>
      )}
      {/* <h3 className="text-base font-semibold leading-6 text-gray-900 mt-12">
        Avg Week Stats
      </h3> */}
      {isFetching || !data ? (
        <div className="flex justify-center items-center h-[108px] mt-5 rounded-lg bg-white shadow ">
          <BounceLoader color="#d8b4fe" size={60} />
        </div>
      ) : (
        <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-3 md:divide-x md:divide-y-0">
          {avgStats.map((item) => (
            <StatBox key={item.name} item={item} />
          ))}
        </dl>
      )}
    </div>
  );
}

/* const formatStat = (
  name: string,
  data: number[],
  inverted?: boolean | undefined
): Stat => {
  console.log(data);
  const total = data.reduce((prev, val) => prev + val);
  const prev = data.slice(1).reduce((prev, val) => prev + val);

  return {
    name,
    value: total,
    previousValue: prev,
    change: (total / prev - 1) * 100,
    changeType:
      total > prev ? "increase" : total < prev ? "decrease" : "steady",
    inverted,
  } as Stat;
}; */

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
