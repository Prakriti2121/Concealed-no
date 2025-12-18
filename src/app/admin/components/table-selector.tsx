"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableIcon } from "lucide-react";

interface TableSelectorProps {
  onSelect: (rows: number, cols: number) => void;
}

export function TableSelector({ onSelect }: TableSelectorProps) {
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);

  const grid = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Insert table">
          <TableIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[320px] p-2">
        <h3 className="mb-2 text-sm font-medium">Insert Table</h3>
        <div
          className="grid grid-cols-8 gap-1 p-2"
          role="grid"
          aria-label="Table size grid"
        >
          {grid.map((row) =>
            grid.map((col) => (
              <div
                key={`${row}-${col}`}
                role="gridcell"
                aria-label={`${row} rows by ${col} columns`}
                className={`h-8 w-8 cursor-pointer rounded border ${
                  row <= rows && col <= cols
                    ? "bg-primary border-primary"
                    : "border-muted-foreground/20"
                }`}
                onMouseEnter={() => {
                  setRows(row);
                  setCols(col);
                }}
                onClick={() => onSelect(row, col)}
              />
            ))
          )}
        </div>
        <div className="mt-2 text-center text-sm text-muted-foreground">
          {rows > 0 && cols > 0
            ? `${rows} × ${cols} table`
            : "Hover to select table size"}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
