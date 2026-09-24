export function Pagination({ page, pageSize, total, onPage, onPageSize }) {
  const pages = Math.max(1, Math.ceil(total / pageSize)),
    current = Math.min(page, pages),
    start = total ? (current - 1) * pageSize + 1 : 0,
    end = Math.min(current * pageSize, total),
    nums = [];
  for (let i = Math.max(1, current - 2); i <= Math.min(pages, current + 2); i++)
    nums.push(i);
  return (
    <div className="flex flex-col gap-3 border-t bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-slate-500">
        Showing {start}–{end} of {total}
      </span>
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={pageSize}
          onChange={(e) => onPageSize(Number(e.target.value))}
          className="rounded border px-2 py-2"
        >
          {[10, 20, 50].map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
        <button
          disabled={current === 1}
          onClick={() => onPage(current - 1)}
          className="rounded border px-3 py-2"
        >
          Previous
        </button>
        {nums.map((n) => (
          <button
            key={n}
            onClick={() => onPage(n)}
            className={`rounded px-3 py-2 ${n === current ? "bg-slate-900 text-white" : "border"}`}
          >
            {n}
          </button>
        ))}
        <button
          disabled={current === pages}
          onClick={() => onPage(current + 1)}
          className="rounded border px-3 py-2"
        >
          Next
        </button>
      </div>
    </div>
  );
}
