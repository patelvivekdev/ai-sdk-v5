export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen w-full p-4">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-zinc-200 dark:border-zinc-700 border-t-zinc-500 dark:border-t-zinc-300"></div>
        <p className="mt-4 text-lg font-medium text-zinc-600 dark:text-zinc-400">
          Loading chat...
        </p>
      </div>
    </div>
  );
}
