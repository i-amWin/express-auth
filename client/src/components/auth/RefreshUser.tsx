"use client";
import React from "react";
import { axiosInstance } from "@/lib/axios";
import { useAddUser } from "@/stores/user-store";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function RefreshUser() {
  const addUser = useAddUser();
  const router = useRouter();

  React.useEffect(() => {
    // Check if the isLoggedIn cookie is exists or not
    const isLoggedIn = Cookies.get("isLoggedIn");
    if (!isLoggedIn || isLoggedIn === "false") {
      return;
    }

    const abortController = new AbortController();

    (async () => {
      try {
        await axiosInstance.post("/api/v1/users/refresh-token", null, {
          signal: abortController.signal,
          withCredentials: true,
        });

        const response = await axiosInstance.get("/api/v1/users/me", {
          withCredentials: true,
        });

        if (response.data.success) {
          addUser(response.data.data);
          router.push("/dashboard");
        }
      } catch (error: any) {
        if (error.name === "AbortError") return;
        console.log("error");
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [addUser, router]);

  return null;
}
