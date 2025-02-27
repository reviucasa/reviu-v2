import AdminLayout from "@/components/layouts/AdminLayout";
import ReviewsStats from "@/components/sectionAdmin/reviewsStats";
import dynamic from "next/dynamic";

const ReviewsMap = dynamic(
  () => import("@/components/sectionAdmin/reviewsMap"),
  { ssr: false }
);

export default function Admin() {
  return (
    <AdminLayout>
      <ReviewsStats />
      <ReviewsMap />
    </AdminLayout>
  );
}
