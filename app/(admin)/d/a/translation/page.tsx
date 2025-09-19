"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type Row = {
  id: number;
  key: string;
  value: string;
  language: string;
  type: string;
};

export default function TranslationTable() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Fetch data
  useEffect(() => {
    fetch("/api/tr")
      .then((res) => res.json())
      .then((data) => {
        setRows(data);
        setLoading(false);
      });
  }, []);

  const handleChange = ({ id, value }: { id: number; value: string }) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, value } : r)));
  };

  const handleSave = async ({
    id,
    value,
    language,
    type,
  }: {
    id: number;
    value: string;
    language: string;
    type: string;
  }) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/tr/u/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value, language, type }),
      });
      if (!res.ok) throw new Error("Failed to update translation");
      toast.success("Translation updated successfully!");
    } catch (err) {
      toast.error("Error updating translation");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRows = useMemo(() => {
    const lower = search.toLowerCase();
    return rows.filter((r) => r.value.toLowerCase().includes(lower));
  }, [rows, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header + Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-xl font-semibold text-gray-800">
          Translation Table
        </h1>
        <Input
          placeholder="Search by value…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left border">Lang</th>
              <th className="p-3 text-left border">Value</th>
              <th className="p-3 text-left border">Type</th>
              <th className="p-3 text-center border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length ? (
              filteredRows.map((row) => (
                <tr
                  key={row.id}
                  className="odd:bg-background even:bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <td className="p-3 border">
                    {row.language === "en" ? "English" : "Danish"}
                  </td>
                  <td className="p-3 border">
                    <Textarea
                      rows={3}
                      value={row.value}
                      onChange={(e) =>
                        handleChange({ id: row.id, value: e.target.value })
                      }
                      className="resize-none"
                    />
                  </td>
                  <td className="p-3 border">{row.type}</td>
                  <td className="p-3 border text-center">
                    <Button
                      onClick={() =>
                        handleSave({
                          id: row.id,
                          value: row.value,
                          language: row.language,
                          type: row.type,
                        })
                      }
                      disabled={updatingId === row.id}
                      className="min-w-[80px]"
                    >
                      {updatingId === row.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="p-4 text-center text-muted-foreground"
                >
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
