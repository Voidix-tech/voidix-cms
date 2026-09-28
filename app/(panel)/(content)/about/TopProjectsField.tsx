"use client";

import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { CONTROL_CLASSES } from "@/components/ui/Field";
import { TOP_PROJECT_FIELD_NAMES } from "@/lib/forms/topProjectFields";
import { FIELD_LIMITS } from "@/lib/validation/contentSchemas";

const DESCRIPTION_ROWS = 3;

const ICON_BUTTON_CLASSES =
  "flex size-7 items-center justify-center rounded-sm text-muted transition-colors duration-150 hover:text-accent disabled:pointer-events-none disabled:opacity-25";

export interface TopProjectValue {
  name: string;
  description: string;
  url: string;
}

interface TopProjectRow extends TopProjectValue {
  /** React key only. Never posted — position in the list is the order, as everywhere else here. */
  rowKey: number;
}

/**
 * About's section 06, one row per project.
 *
 * Rows live in the About form and save with it, rather than getting their own pages the way Works
 * and roles do: a short list read in the context of the page around it. Reordering is client-side
 * for the same reason — nothing is stored until Save draft, exactly like every other field here.
 */
export function TopProjectsField({
  defaultValue,
  error,
}: {
  defaultValue: TopProjectValue[];
  error?: string;
}) {
  const nextRowKey = useRef(defaultValue.length);
  const [rows, setRows] = useState<TopProjectRow[]>(() =>
    defaultValue.map((project, index) => ({ ...project, rowKey: index })),
  );

  const isFull = rows.length >= FIELD_LIMITS.topProjectCount;

  function updateRow(rowKey: number, changes: Partial<TopProjectValue>) {
    setRows((current) =>
      current.map((row) => (row.rowKey === rowKey ? { ...row, ...changes } : row)),
    );
  }

  function moveRow(position: number, offset: -1 | 1) {
    setRows((current) => {
      const reordered = [...current];
      const [moved] = reordered.splice(position, 1);
      reordered.splice(position + offset, 0, moved);
      return reordered;
    });
  }

  function removeRow(rowKey: number) {
    setRows((current) => current.filter((row) => row.rowKey !== rowKey));
  }

  function addRow() {
    const rowKey = nextRowKey.current;
    nextRowKey.current += 1;
    setRows((current) => [...current, { rowKey, name: "", description: "", url: "" }]);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-xs uppercase tracking-[0.14em] text-muted">Projects</span>
        <span className="text-[11px] tabular-nums text-muted">
          {rows.length} / {FIELD_LIMITS.topProjectCount}
        </span>
      </div>

      {rows.length === 0 && (
        <p className="text-[11px] leading-relaxed text-muted">
          No projects — section 06 is left off the page, and out of the orbit rail, until one is
          added.
        </p>
      )}

      <ol className="flex flex-col gap-4">
        {rows.map((row, position) => (
          <li
            key={row.rowKey}
            className="flex flex-col gap-4 rounded-sm border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="eyebrow tabular-nums">
                {String(position + 1).padStart(2, "0")}
              </span>

              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => moveRow(position, -1)}
                  disabled={position === 0}
                  aria-label={`Move project ${position + 1} up`}
                  className={ICON_BUTTON_CLASSES}
                >
                  <ChevronUp className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => moveRow(position, 1)}
                  disabled={position === rows.length - 1}
                  aria-label={`Move project ${position + 1} down`}
                  className={ICON_BUTTON_CLASSES}
                >
                  <ChevronDown className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => removeRow(row.rowKey)}
                  aria-label={`Remove project ${position + 1}`}
                  className={`${ICON_BUTTON_CLASSES} hover:text-danger`}
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>
            </div>

            <RowInput
              label="Name"
              name={TOP_PROJECT_FIELD_NAMES.name}
              value={row.name}
              max={FIELD_LIMITS.topProjectName}
              onChange={(name) => updateRow(row.rowKey, { name })}
            />

            <RowInput
              label="Description"
              name={TOP_PROJECT_FIELD_NAMES.description}
              value={row.description}
              max={FIELD_LIMITS.topProjectDescription}
              multiline
              onChange={(description) => updateRow(row.rowKey, { description })}
            />

            <RowInput
              label="URL"
              name={TOP_PROJECT_FIELD_NAMES.url}
              value={row.url}
              max={FIELD_LIMITS.projectLiveUrl}
              placeholder="https://… — optional"
              onChange={(url) => updateRow(row.rowKey, { url })}
            />
          </li>
        ))}
      </ol>

      <div>
        <Button type="button" onClick={addRow} disabled={isFull}>
          <Plus className="size-4" aria-hidden />
          Add project
        </Button>
      </div>

      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : (
        <p className="text-[11px] leading-relaxed text-muted">
          Leave the URL empty for work with no public address — the row shows no link. Order here is
          the order on the page.
        </p>
      )}
    </div>
  );
}

function RowInput({
  label,
  name,
  value,
  max,
  placeholder,
  multiline = false,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  max: number;
  placeholder?: string;
  multiline?: boolean;
  onChange: (value: string) => void;
}) {
  const isOverLimit = value.length > max;

  // `maxLength` deliberately unset, as in TextField: a hard cap truncates a paste without saying so.
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-baseline justify-between gap-4">
        <span className="text-[11px] uppercase tracking-[0.14em] text-muted">{label}</span>
        <span
          className={`text-[11px] tabular-nums ${isOverLimit ? "text-danger" : "text-muted"}`}
        >
          {value.length} / {max}
        </span>
      </span>
      {multiline ? (
        <textarea
          name={name}
          value={value}
          rows={DESCRIPTION_ROWS}
          onChange={(event) => onChange(event.target.value)}
          className={`${CONTROL_CLASSES} resize-y`}
        />
      ) : (
        <input
          type="text"
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={CONTROL_CLASSES}
        />
      )}
    </label>
  );
}
