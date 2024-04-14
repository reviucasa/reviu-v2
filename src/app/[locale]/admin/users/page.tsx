"use client";
import AdminLayout from "@/components/layouts/AdminLayout";
import UsersTable from "@/components/sectionAdmin/usersTable";

export default function Page() {
  return (
    <AdminLayout>
      <UsersTable />
    </AdminLayout>
  );
}
