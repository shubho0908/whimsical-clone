"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/models/user.models";
import Loader from "@/lib/Loader";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const CreateorVerifyUser = async () => {
      try {
        if (session) {
          const response = await axios.post("/api/oauth", {
            name: session?.user?.name,
            email: session?.user?.email,
            profile: session?.user?.image,
          });
          const { data } = response;
          if (data.success) {
            setUser(data.user);
          }
        }
      } catch (error: any) {
        console.error("Error:", error);
      }
    };

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

    CreateorVerifyUser();
    checkWorkspace();
  }, [session, router]);

  if (isLoading) return <Loader />;

  return (
    <ContentLayout title="My Workspace">
      <p>My Workspace</p>
    </ContentLayout>
  );
}
