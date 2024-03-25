"use client";
import { useRemoveUser, useUser } from "@/stores/user-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { axiosInstance, userResponseSchema } from "@/lib/axios";
import { toast } from "react-toastify";

export default function DashBoardPage() {
  const user = useUser();
  const removeUser = useRemoveUser();

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.delete("/api/v1/users/logout", {
        withCredentials: true,
      });

      const data = userResponseSchema.parse(response.data);

      if (data.success) {
        toast.success(data.message);
        removeUser();
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle className="text-center text-4xl font-black">
          Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {user &&
          Object.entries(user).map(([fieldName, fieldValue]) => (
            <div
              className="flex justify-between gap-4 p-4 border rounded-lg"
              key={fieldName}
            >
              <p className="bg-slate-100 px-2 py-1 rounded font-mono text-sm">
                {fieldName}
              </p>
              <p className="bg-slate-100 px-4 py-1 rounded font-mono text-sm">
                {fieldValue.toString()}
              </p>
            </div>
          ))}

        <Button onClick={handleLogout}>Logout</Button>
      </CardContent>
    </Card>
  );
}
