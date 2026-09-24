export function EmptyState({ text = "Nothing found." }) {
  return (
    <div className="rounded-lg border bg-white p-10 text-center text-slate-500">
      {text}
    </div>
  );
}
