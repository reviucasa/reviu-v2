"use client";
import { PostForm } from "@/components/forms/PostForm";
import AdminLayout from "@/components/layouts/AdminLayout";

export default function Page() {
  return (
    <AdminLayout>
      <PostForm />
    </AdminLayout>
  );
}
