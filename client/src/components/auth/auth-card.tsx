import React from "react";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import OAuthLogin from "./oauth-login";

interface CardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  oauth?: boolean;
}

export default function AuthCard({
  title,
  description,
  children,
  oauth,
}: CardProps) {
  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle className="text-center text-5xl font-black">
          {title}
        </CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
        {oauth && <OAuthLogin />}
      </CardContent>
    </Card>
  );
}
