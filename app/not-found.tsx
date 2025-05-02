import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <h1 className="mb-4 text-6xl font-bold">404</h1>
      <p className="mb-8 text-xl">
        Oops! The chat you&apos;re looking for doesn&apos;t exist.
      </p>
      <div className="flex space-x-4">
        <Button variant="outline" asChild>
          <Link href="/">New Chat</Link>
        </Button>
      </div>
    </div>
  );
}
