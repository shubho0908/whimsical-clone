"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/lib/Loader";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const checkWorkspace = async () => {
      try {
        if (session) {
          const response = await axios.get("/api/check-workspace");
          const { data } = response;
          if (data.success) {
            if (!data.myWorkspace) {
              router.push("/create-workspace");
            } else {
              setIsLoading(false);
            }
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    checkWorkspace();
  }, [session, router]);

  if (isLoading) return <Loader />;

  return (
    <ContentLayout title="My Workspace">
      <p>My Workspace</p>
    </ContentLayout>
  );
}
