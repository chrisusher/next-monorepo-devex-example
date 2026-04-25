interface Column<T> {
  key: keyof T
  header: string
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  emptyMessage?: string
}

/**
 * Generic data table component.
 *
 * Accepts typed column definitions so consuming pages get type-safe
 * table rendering without coupling to a specific data shape.
 */
export function Table<T extends { id: string | number }>({
  data,
  columns,
  emptyMessage = 'No data',
}: TableProps<T>) {
  if (data.length === 0) {
    return <p className="text-gray-500 text-sm">{emptyMessage}</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 whitespace-nowrap">
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
