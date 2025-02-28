"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ReportPage() {
  // Sample attendance data; replace with dynamic data as needed.
  const attendanceData = [
    { id: 1, name: "John Doe", date: "2023-09-01", status: "Present" },
    { id: 2, name: "Jane Smith", date: "2023-09-01", status: "Absent" },
    { id: 3, name: "Alice Johnson", date: "2023-09-01", status: "Present" },
    { id: 4, name: "Bob Brown", date: "2023-09-01", status: "Late" },
  ];

  // Function to convert data to CSV and trigger file download.
  const exportToCsv = () => {
    const headers = ["ID", "Name", "Date", "Status"];
    // Build CSV rows: first row as header then data rows.
    const csvRows = [headers.join(",")];
    attendanceData.forEach((record) => {
      const row = [record.id, record.name, record.date, record.status];
      csvRows.push(row.join(","));
    });
    const csvString = csvRows.join("\n");
    // Create a Blob from the CSV string and generate a download link.
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "attendance_report.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Attendance Report</h1>

      {/* Controls */}
      <Card className="p-4 mb-6 flex items-center justify-between">
        <Input placeholder="Search by name..." className="max-w-xs" />
        <Button variant="default" onClick={exportToCsv}>
          Export Report
        </Button>
      </Card>

      {/* Attendance Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceData.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.id}</TableCell>
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
