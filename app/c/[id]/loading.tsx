export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-500 dark:border-zinc-700 dark:border-t-zinc-300"></div>
        <p className="mt-4 text-lg font-medium text-zinc-600 dark:text-zinc-400">
          Loading chat...
        </p>
      </div>
    </div>
  );
}
