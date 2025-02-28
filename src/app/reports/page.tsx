"use client";

import { useState, useRef } from "react";
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
  // Initialize attendance data as null (or empty array)
  const [attendanceData, setAttendanceData] = useState(null);
  // State for search term, date filter, and status filter
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  // File input reference for triggering the file dialog
  const fileInputRef = useRef(null);

  // Filter attendance data based on search term, date, and status
  const filteredData = attendanceData
    ? attendanceData.filter((record) => {
        const matchesName = record.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesDate = dateFilter ? record.date === dateFilter : true;
        const matchesStatus =
          statusFilter === "All" || record.status === statusFilter;
        return matchesName && matchesDate && matchesStatus;
      })
    : [];

  // Function to export the filtered data to CSV
  const exportToCsv = () => {
    if (!attendanceData) return;
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

  // Function to handle the CSV file import
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      const lines = text.split("\n").filter((line) => line.trim() !== "");
      // Assuming the first line is header: "ID,Name,Date,Status"
      const data = lines.slice(1).map((line) => {
        const values = line.split(",").map((val) => val.trim());
        return {
          id: values[0],
          name: values[1],
          date: values[2],
          status: values[3],
        };
      });
      setAttendanceData(data);
    };
    reader.readAsText(file);
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
          {/* Status Filter Dropdown */}
          <select
            className="border rounded px-3 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
          </select>
        </div>
        <div className="flex gap-4">
          <Button
            variant="default"
            onClick={exportToCsv}
            disabled={!attendanceData}
          >
            Export Report
          </Button>
          <Button
            variant="default"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            Import Report
          </Button>
          {/* Hidden file input for CSV import */}
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleImport}
            style={{ display: "none" }}
          />
        </div>
      </Card>

      {/* Attendance Table */}
      <Card>
        {attendanceData ? (
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
        ) : (
          <p className="p-4">No data available. Please import a CSV file.</p>
        )}
      </Card>
    </div>
  );
}
