"use client";
import { useEffect, useState } from "react";

export default function ZakatPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    gold: "",
    silver: "",
    cash: "",
    bank: "",
    business: "",
    investments: "",
    property: "",
    other: "",
    liabilities: "",
  });
  const [result, setResult] = useState(null);

  // --- Fetch logs ---
  async function fetchLogs() {
    try {
      const res = await fetch("/api/zakat"); // adjust if backend is separate
      const data = await res.json();

      // 🔥 FIX: backend returns array, not {records}
      setLogs(Array.isArray(data) ? data : data.records || []);
    } catch (err) {
      console.error("Error fetching zakat logs:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  // --- Handle input ---
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --- Submit form ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/zakat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(data);
      fetchLogs(); // refresh logs after saving
    } catch (err) {
      console.error("Error saving zakat:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Zakat Calculator</h1>

      {/* --- Form --- */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 mb-6 p-4 border rounded-lg"
      >
        {Object.keys(form).map((field) => (
          <div key={field} className="flex flex-col">
            <label className="capitalize mb-1">{field}</label>
            <input
              type="number"
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="border px-2 py-1 rounded"
              placeholder="0"
            />
          </div>
        ))}
        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Calculate & Save
        </button>
      </form>

      {/* --- Calculation result --- */}
      {result && (
        <div className="mb-6 p-4 border rounded-lg bg-green-50">
          <p><strong>Total Assets:</strong> {result.total_assets}</p>
          <p><strong>Liabilities:</strong> {result.liabilities}</p>
          <p><strong>Net Assets:</strong> {result.net_assets}</p>
          <p><strong>Zakaat:</strong> {result.zakaat}</p>
        </div>
      )}

      {/* --- Logs --- */}
      <h2 className="text-xl font-semibold mb-2">Zakat Logs</h2>
      {loading ? (
        <p>Loading...</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-500">No records found.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Total Assets</th>
              <th className="border px-4 py-2">Liabilities</th>
              <th className="border px-4 py-2">Net Assets</th>
              <th className="border px-4 py-2">Zakaat</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i}>
                <td className="border px-4 py-2">
                  {new Date(log.created).toLocaleDateString("en-GB")}
                </td>
                <td className="border px-4 py-2">{log.total_assets}</td>
                <td className="border px-4 py-2">{log.liabilities}</td>
                <td className="border px-4 py-2">{log.net_assets}</td>
                <td className="border px-4 py-2">{log.zakaat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
