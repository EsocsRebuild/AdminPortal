import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { DataTable } from "./data-table";
import { columnHelper } from "./features";

type Row = { id: string; name: string; age: number };
const col = columnHelper<Row>();
const columns = [col.accessor("name", { header: "Name" }), col.accessor("age", { header: "Age" })];
const data: Row[] = Array.from({ length: 15 }, (_, i) => ({ id: `r${i}`, name: `Person ${i}`, age: 20 + i }));

describe("DataTable", () => {
  it("paginates", () => {
    render(<DataTable data={data} columns={columns} getRowId={(r) => r.id} pageSize={10} />);
    const table = screen.getByRole("table");
    expect(within(table).getAllByRole("row")).toHaveLength(11); // header + 10
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
  });

  it("filters with the search box and offers a reset", async () => {
    render(<DataTable data={data} columns={columns} getRowId={(r) => r.id} />);
    await userEvent.type(screen.getByRole("searchbox", { name: "Search" }), "Person 14");
    const table = screen.getByRole("table");
    expect(within(table).getAllByRole("row")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
  });

  it("shows the empty state when nothing matches", async () => {
    render(<DataTable data={data} columns={columns} getRowId={(r) => r.id} />);
    await userEvent.type(screen.getByRole("searchbox", { name: "Search" }), "zzz");
    expect(screen.getByText("No matching results")).toBeInTheDocument();
  });
});
