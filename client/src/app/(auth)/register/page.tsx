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

const registerSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
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

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    startTransition(async () => {
      try {
        const response = await axiosInstance.post(
          "/api/v1/users/register",
          values
        );

        const data = userResponseSchema.parse(response.data);

        if (data.success) {
          toast.success(data.message);
          if (!data.data) return;
          router.push("/dashboard");
        } else {
          toast.error(data.message);
        }
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    });
  };

  return (
    <section>
      <Card title="Register" description="Create an account">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="John Doe"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              Register
            </Button>

            <p className="text-center">
              Already have an account?{" "}
              <Link className="text-blue-600 hover:underline" href="/login">
                Login here
              </Link>
            </p>
          </form>
        </Form>
      </Card>
    </section>
  );
}
