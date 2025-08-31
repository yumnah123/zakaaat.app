import { useEffect, useState } from "react";

export default function ZakatPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecords() {
      try {
        const res = await fetch("/api/zakat");
        const data = await res.json();
        setRecords(data.records || []);
      } catch (err) {
        console.error("Failed to fetch zakat logs", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRecords();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Zakat Logs</h1>
      {records.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Assets</th>
              <th>Liabilities</th>
              <th>Net Assets</th>
              <th>Zakaat</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i}>
                <td>{r.created}</td>
                <td>{r.total_assets}</td>
                <td>{r.liabilities}</td>
                <td>{r.net_assets}</td>
                <td>{r.zakaat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
