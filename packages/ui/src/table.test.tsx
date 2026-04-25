import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Table } from './table'

const columns = [
  { key: 'name' as const, header: 'Name' },
  { key: 'status' as const, header: 'Status' },
]

const data = [
  { id: '1', name: 'Project Alpha', status: 'active' },
  { id: '2', name: 'Project Beta', status: 'archived' },
]

describe('Table', () => {
  it('renders column headers', () => {
    render(<Table data={data} columns={columns} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('renders all rows', () => {
    render(<Table data={data} columns={columns} />)
    expect(screen.getByText('Project Alpha')).toBeInTheDocument()
    expect(screen.getByText('Project Beta')).toBeInTheDocument()
  })

  it('shows empty message when data is empty', () => {
    render(<Table data={[]} columns={columns} emptyMessage="Nothing here" />)
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
  })

  it('uses a custom render function', () => {
    const colsWithRender = [
      {
        key: 'status' as const,
        header: 'Status',
        render: (val: string) => <span data-testid="badge">{val.toUpperCase()}</span>,
      },
    ]
    render(<Table data={data} columns={colsWithRender as any} />)
    const badges = screen.getAllByTestId('badge')
    expect(badges[0]).toHaveTextContent('ACTIVE')
  })
})
