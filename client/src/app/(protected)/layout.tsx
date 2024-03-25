import ProtectedRoutes from "@/components/auth/ProtectedRoutes";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProtectedRoutes>{children}</ProtectedRoutes>;
}
