"use client";
import AdminLayout from "@/components/layouts/AdminLayout";
import ReportedReviewsTable from "@/components/sectionAdmin/reportedReviewsTable";
import ReviewsTable from "@/components/sectionAdmin/reviewsTable";
import SuspendedReviewsTable from "@/components/sectionAdmin/suspendedReviewsTable";

export default function Page() {
  return (
    <AdminLayout>
      <ReviewsTable />
      <ReportedReviewsTable />
      <SuspendedReviewsTable />
    </AdminLayout>
  );
}
