"use client";
import AdminLayout from "@/components/layouts/AdminLayout";
import DraftsTable from "@/components/sectionAdmin/draftsTable";

export default function Page() {
  return (
    <AdminLayout>
      <DraftsTable />
    </AdminLayout>
  );
}
