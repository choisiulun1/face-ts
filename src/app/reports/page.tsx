"use client";

import { useState } from "react";
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
    { id: 3, name: "Alice Johnson", date: "2023-09-02", status: "Present" },
    { id: 4, name: "Bob Brown", date: "2023-09-03", status: "Late" },
    // Add more sample data as needed.
  ];

  // State for search term and date filter
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Filter attendance data based on search term and date
  const filteredData = attendanceData.filter((record) => {
    const matchesName = record.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter ? record.date === dateFilter : true;
    return matchesName && matchesDate;
  });

  // Function to export the filtered data to CSV
  const exportToCsv = () => {
    const headers = ["ID", "Name", "Date", "Status"];
    const csvRows = [headers.join(",")];
    filteredData.forEach((record) => {
      const row = [record.id, record.name, record.date, record.status];
      csvRows.push(row.join(","));
    });
    const csvString = csvRows.join("\n");
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
      <Card className="p-4 mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4">
          <Input
            placeholder="Search by name..."
            className="max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Input
            type="date"
            placeholder="Filter by date"
            className="max-w-xs"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
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
            {filteredData.map((record) => (
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
