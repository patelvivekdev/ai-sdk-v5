import NextLink from "next/link";
export const ProjectOverview = () => {
  return (
    <div className="flex flex-col items-center justify-end">
      <h1 className="text-3xl font-semibold mb-4">
        Vercel <span className="text-zinc-500">+</span> Gemini{" "}
        <span className="text-zinc-500">+</span> AI SDK
      </h1>
      <p className="text-center">
        This starter project uses{" "}
        <Link href="https://ai.google.dev/">Gemini</Link> with the{" "}
        <Link href="https://sdk.vercel.ai/docs">AI SDK</Link>.
      </p>
      <p className="text-center mt-4">
        Explore more about our project and its features.
      </p>
    </div>
  );
};

const Link = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) => {
  return (
    <NextLink
      target="_blank"
      className="text-blue-500 hover:text-blue-600 transition-colors duration-75"
      href={href}
    >
      {children}
    </NextLink>
  );
};
