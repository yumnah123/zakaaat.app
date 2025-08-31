"use client";

import { useState, useEffect } from "react";

export default function ZakatPage() {
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
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch logs on page load
  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    try {
      const res = await fetch("/api/zakat");
      const data = await res.json();
      setLogs(data.records || []);
    } catch (err) {
      console.error("❌ Failed to fetch logs", err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/zakat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(data);
      fetchLogs(); // refresh logs
    } catch (err) {
      console.error("❌ Error submitting zakat", err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Zakat Calculator</h1>

      {/* Calculation Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
        {Object.keys(form).map((field) => (
          <div key={field}>
            <label className="block capitalize">{field}</label>
            <input
              type="number"
              step="0.01"
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="col-span-2 bg-blue-600 text-white p-2 rounded mt-4"
        >
          {loading ? "Calculating..." : "Calculate & Save"}
        </button>
      </form>

      {/* Latest Result */}
      {result && (
        <div className="bg-green-100 p-4 rounded mb-6">
          <p>Total Assets: {result.totalAssets}</p>
          <p>Liabilities: {result.liabilities}</p>
          <p>Net Assets: {result.netAssets}</p>
          <p>Zakat (2.5%): {result.zakaat}</p>
          <p>Date: {new Date(result.created).toLocaleDateString()}</p>
        </div>
      )}

      {/* Logs Table */}
      <h2 className="text-xl font-semibold mb-2">Zakat Logs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Date</th>
              <th className="border p-2">Total Assets</th>
              <th className="border p-2">Liabilities</th>
              <th className="border p-2">Net Assets</th>
              <th className="border p-2">Zakat</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id}>
                  <td className="border p-2">
                    {new Date(log.created).toLocaleDateString()}
                  </td>
                  <td className="border p-2">{log.total_assets}</td>
                  <td className="border p-2">{log.liabilities}</td>
                  <td className="border p-2">{log.net_assets}</td>
                  <td className="border p-2">{log.zakaat}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
