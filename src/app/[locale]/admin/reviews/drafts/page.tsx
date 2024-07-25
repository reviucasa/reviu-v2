"use client";
import AdminLayout from "@/components/layouts/AdminLayout";
import DraftsTable from "@/components/sectionAdmin/draftsTable";
import ReportedReviewsTable from "@/components/sectionAdmin/reportedReviewsTable";
import ReviewsTable from "@/components/sectionAdmin/reviewsTable";
import SuspendedReviewsTable from "@/components/sectionAdmin/suspendedReviewsTable";

export default function Page() {
  return (
    <AdminLayout>
      <DraftsTable />
    </AdminLayout>
  );
}
