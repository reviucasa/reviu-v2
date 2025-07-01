import { Review } from "@/models/review";
import { User } from "@/models/user";

export function convertReviewsToCSV(reviews: Review[], users: User[]): string {
  const headers = [
    "id",
    "userId",
    "emial",
    "name",
    "lastname",
    "address",
    "placeId",
    "province",
    "municipality",
    "status",
    "step",
    "createdAt",
    "updatedAt",
  ];

  const userMap = new Map(users.map((u) => [u.id, u]));

  const rows = reviews.map((r) => {
    const user = userMap.get(r.userId);
    const location = r.location ?? {
      province: "",
      municipality: "",
      street: "",
      number: "",
    };

    return [
      r.id,
      r.userId,
      user?.email ?? "",
      user?.name ?? "",
      user?.lastname ?? "",
      r.address,
      r.placeId,
      location.province,
      location.municipality,
      r.status,
      r.data?.step ?? "",
      r.timeCreated?.toDate().toISOString() ?? "",
      r.timeUpdated?.toDate().toISOString() ?? "",
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}
