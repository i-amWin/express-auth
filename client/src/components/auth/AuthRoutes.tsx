"use client";
import { useUser } from "@/stores/user-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthRoutes({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [router, user]);

  return <>{!user && children}</>;
}
