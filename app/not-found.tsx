import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">
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
