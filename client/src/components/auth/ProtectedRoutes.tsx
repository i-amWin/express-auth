"use client";
import { useUser } from "@/stores/user-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoutes({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [router, user]);

  return <>{user && children}</>;
}
