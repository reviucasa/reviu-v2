"use client";
import AdminLayout from "@/components/layouts/AdminLayout";
import ReviewsTable from "@/components/sectionAdmin/reviewsTable";
import SectionStats from "@/components/sectionAdmin/sectionStats";
import SuspendedReviewsTable from "@/components/sectionAdmin/suspendedReviewsTable";
import UsersTable from "@/components/sectionAdmin/usersTable";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Admin() {
  const { user, claims, initializing } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const handleVerify = async () => {
      try {
        if (!claims.admin) {
          router.replace("/");
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error verifying admin status:", error);
      }
    };

    if (user) {
      handleVerify();
    } else {
      if (!initializing && !user) router.replace("/");
    }
  }, [claims, initializing, router, user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AdminLayout>
      <SectionStats />
      <ReviewsTable />
      <SuspendedReviewsTable />
      <UsersTable />
    </AdminLayout>
  );
}
