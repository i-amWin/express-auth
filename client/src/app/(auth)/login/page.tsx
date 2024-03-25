"use client";
import Card from "@/components/auth/auth-card";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import { axiosInstance, userResponseSchema } from "@/lib/axios";
import { useAddUser } from "@/stores/user-store";
import { useRouter } from "next/navigation";
import { CardFooter } from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export default function LoginPage() {
  const addUser = useAddUser();
  const router = useRouter();
  const [isLoading, startTransition] = React.useTransition();
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    startTransition(async () => {
      try {
        const response = await axiosInstance.post(
          "/api/v1/users/login",
          values,
          {
            withCredentials: true,
          }
        );

        const data = userResponseSchema.parse(response.data);

        if (data.success) {
          toast.success(data.message);
          if (!data.data) return;
          addUser(data.data);
          router.push("/dashboard");
        } else {
          toast.error(data.message);
        }
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    });
  };

  const handleGoogleLogin = () => {
    // startTransition(async () => {
    //   try {
    //     const response = await axiosInstance.get("/api/auth/google", {
    //       withCredentials: true,
    //     });

    //     // const data = userResponseSchema.parse(response.data);

    //     console.log(response);
    //   } catch (error: any) {
    //     console.log(error);
    //   }
    // });
    window.location.href = "http://localhost:3001/api/v1/users/login/google";
  };

  return (
    <section>
      <Card title="Login" description="Login to your account" oauth>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="johndoe@gmail.com"
                      type="email"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="********"
                        type={passwordVisible ? "text" : "password"}
                        className="pr-12"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <Button
                      variant="link"
                      className="absolute right-0 top-0 text-gray-700"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      type="button"
                      disabled={isLoading}
                    >
                      {passwordVisible ? <Eye /> : <EyeOff />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="animate-spin w-4 h-4 mr-1" />}
              Login
            </Button>

            <p className="text-center">
              Don&apos;t have an account?{" "}
              <Link className="text-blue-600 hover:underline" href="/register">
                Register here
              </Link>
            </p>
          </form>
        </Form>

        {/* <Button
          className="w-full mt-4 border-gray-300"
          onClick={handleGoogleLogin}
          variant="outline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            // width="100"
            // height="100"
            viewBox="0 0 48 48"
            className="w-6 h-6 mr-2"
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            ></path>
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            ></path>
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
          </svg>
          Google
        </Button> */}
      </Card>
    </section>
  );
}
