"use client";
import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Menu } from "@/components/admin-panel/menu";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import axios from "axios";
import { useEffect, useState } from "react";
import { Workspace } from "@/models/workspace.models";
import { BsPersonWorkspace } from "react-icons/bs";

export function SheetMenu() {
  const [workspaceData, setWorkspaceData] = useState<Workspace | null>(null);

  useEffect(() => {
    const getWorkspaceData = async () => {
      const response = await axios.get("/api/check-workspace");
      const { data } = response;
      if (data.success) {
        setWorkspaceData(data.workspaceData);
      }
    };
    getWorkspaceData();
  }, []);

  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
          <Button
            className="flex justify-center items-center pb-2 pt-1"
            variant="link"
            asChild
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <BsPersonWorkspace className="mr-2" fontSize={22} />
              <h1 className="font-bold text-lg">{workspaceData?.name}</h1>
            </Link>
          </Button>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}
