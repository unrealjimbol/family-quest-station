"use client";

import { useRef, useState } from "react";

/** All localStorage keys used by Family Quest Station */
const APP_KEYS = [
  "fqs.v1.state",
  "fqs.v1.points",
  "fqs.v1.pointPresets",
  "fqs.v1.rewardPresets",
  "fqs.v1.customQuests",
  "fqs.v1.parentPin",
];

type BackupPayload = {
  _meta: {
    app: "family-quest-station";
    version: 1;
    exportedAt: string;
    keys: string[];
  };
  data: Record<string, string>;
};

export default function DataBackup() {
  const [expanded, setExpanded] = useState(false);
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const data: Record<string, string> = {};
    for (const key of APP_KEYS) {
      const val = window.localStorage.getItem(key);
      if (val !== null) {
        data[key] = val;
      }
    }
    const payload: BackupPayload = {
      _meta: {
        app: "family-quest-station",
        version: 1,
        exportedAt: new Date().toISOString(),
        keys: Object.keys(data),
      },
      data,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    a.download = `fqs-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result;
        if (typeof text !== "string") throw new Error("Invalid file");
        const payload = JSON.parse(text) as BackupPayload;
        // Validate structure
        if (
          !payload._meta ||
          payload._meta.app !== "family-quest-station" ||
          !payload.data ||
          typeof payload.data !== "object"
        ) {
          throw new Error("Not a valid FQS backup file");
        }
        // Restore data
        for (const [key, value] of Object.entries(payload.data)) {
          if (APP_KEYS.includes(key) && typeof value === "string") {
            window.localStorage.setItem(key, value);
          }
        }
        setImportStatus("success");
        // Reload to pick up restored state
        setTimeout(() => window.location.reload(), 1200);
      } catch {
        setImportStatus("error");
        setTimeout(() => setImportStatus("idle"), 3000);
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be re-imported
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-7">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">💾</span>
          <h3 className="text-base font-bold">Data backup</h3>
        </div>
        <span className="text-sm text-ink-soft" aria-hidden="true">
          {expanded ? "▲" : "▼"}
        </span>
      </button>

      {expanded ? (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-ink-soft">
            Export all app data to a JSON file, or restore from a backup.
          </p>

          {/* Export */}
          <button
            type="button"
            onClick={handleExport}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#81b29a] px-4 py-3 font-bold text-white shadow-sm transition active:scale-[0.98]"
          >
            <span aria-hidden="true">📤</span>
            Export backup
          </button>

          {/* Import */}
          <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-bold text-ink shadow-sm ring-1 ring-black/10 transition active:scale-[0.98]">
            <span aria-hidden="true">📥</span>
            Import backup
            <input
              ref={fileRef}
              type="file"
              accept=".json,application/json"
              onChange={handleImport}
              className="hidden"
            />
          </label>

          {importStatus === "success" ? (
            <p className="text-center text-sm font-semibold text-[#81b29a] animate-pop">
              Restored! Reloading…
            </p>
          ) : null}
          {importStatus === "error" ? (
            <p className="text-center text-sm font-semibold text-[#e07a5f] animate-pop">
              Invalid backup file. Please try again.
            </p>
          ) : null}

          <p className="text-xs text-ink-soft">
            Backup includes quest progress, points, presets, and settings.
            Importing will overwrite current data.
          </p>
        </div>
      ) : null}
    </div>
  );
}
