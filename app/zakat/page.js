"use client";
import { useEffect, useState } from "react";

export default function ZakatLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch("/api/zakat");
        const data = await res.json();
        console.log("✅ Zakat logs:", data);
        setLogs(data.records || []); // ✅ FIXED here
      } catch (err) {
        console.error("❌ Error fetching zakat logs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📜 Zakat Logs</h1>

      {loading ? (
        <p>Loading...</p>
      ) : logs.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">ID</th>
                <th className="border p-2">Gold</th>
                <th className="border p-2">Silver</th>
                <th className="border p-2">Cash</th>
                <th className="border p-2">Bank</th>
                <th className="border p-2">Business</th>
                <th className="border p-2">Investments</th>
                <th className="border p-2">Property</th>
                <th className="border p-2">Other</th>
                <th className="border p-2">Liabilities</th>
                <th className="border p-2">Total Assets</th>
                <th className="border p-2">Net Assets</th>
                <th className="border p-2">Zakaat</th>
                <th className="border p-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="border p-2">{log.id}</td>
                  <td className="border p-2">{log.gold}</td>
                  <td className="border p-2">{log.silver}</td>
                  <td className="border p-2">{log.cash}</td>
                  <td className="border p-2">{log.bank}</td>
                  <td className="border p-2">{log.business}</td>
                  <td className="border p-2">{log.investments}</td>
                  <td className="border p-2">{log.property}</td>
                  <td className="border p-2">{log.other}</td>
                  <td className="border p-2">{log.liabilities}</td>
                  <td className="border p-2">{log.total_assets}</td>
                  <td className="border p-2">{log.net_assets}</td>
                  <td className="border p-2">{log.zakaat}</td>
                  <td className="border p-2">
                    {new Date(log.created).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
