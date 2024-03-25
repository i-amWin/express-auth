import AuthRoutes from "@/components/auth/AuthRoutes";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthRoutes>{children}</AuthRoutes>;
}
