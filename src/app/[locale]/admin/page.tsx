import AdminLayout from "@/components/layouts/AdminLayout";
import SectionStats from "@/components/sectionAdmin/sectionStats";
import dynamic from "next/dynamic";

const ReviewsMap = dynamic(
  () => import("@/components/sectionAdmin/reviewsMap"),
  { ssr: false }
);

export default function Admin() {
  return (
    <AdminLayout>
      <SectionStats />
      <ReviewsMap />
    </AdminLayout>
  );
}
