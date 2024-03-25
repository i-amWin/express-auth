import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <section className="space-x-10">
      <Button asChild variant="secondary">
        <Link href={"/register"} className="btn">
          Register
        </Link>
      </Button>

      <Button asChild>
        <Link href={"/login"} className="btn btn-green">
          Login
        </Link>
      </Button>
    </section>
  );
}
