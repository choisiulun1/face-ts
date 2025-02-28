"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { BarChart, CalendarCheck, Clock, Users } from "lucide-react";
export default function Dashboard() {
  // Fabricated attendance data
  const attendanceSummary = {
    totalStudents: 50,
    present: 42,
    absent: 8,
  };

  const attendanceTrends = [
    { date: "Feb 21", present: 38 },
    { date: "Feb 22", present: 40 },
    { date: "Feb 23", present: 35 },
    { date: "Feb 24", present: 41 },
    { date: "Feb 25", present: 42 },
    { date: "Feb 26", present: 39 },
    { date: "Feb 27", present: 42 },
  ];

  const recentCheckIns = [
    { name: "Alice Johnson", time: "8:05 AM" },
    { name: "Bob Smith", time: "8:15 AM" },
    { name: "Charlie Brown", time: "8:20 AM" },
    { name: "David White", time: "8:25 AM" },
    { name: "Eve Black", time: "8:30 AM" },
  ];

  const absentStudents = [
    "John Doe",
    "Sarah Lee",
    "Tom Wilson",
    "Emma Davis",
    "Kevin Brown",
  ];

  // Compute the maximum attendance from the trends for proper scaling (with fallback to avoid division by zero)
  const maxAttendance =
    Math.max(...attendanceTrends.map((day) => day.present)) || 1;

  // Calculate progress percentages with safeguard against division by zero
  const presentPercentage =
    (attendanceSummary.present / (attendanceSummary.totalStudents || 1)) * 100;
  const absentPercentage =
    (attendanceSummary.absent / (attendanceSummary.totalStudents || 1)) * 100;

  return (
    <div className="p-6 space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Total Students */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Total Students</CardTitle>
            <Users className="w-6 h-6 text-gray-500" />
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {attendanceSummary.totalStudents}
          </CardContent>
        </Card>

        {/* Present Today */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Present Today</CardTitle>
            <CalendarCheck className="w-6 h-6 text-green-500" />
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {attendanceSummary.present}
          </CardContent>
          <Progress value={presentPercentage} className="mt-2" />
        </Card>

        {/* Absent Today */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Absent Today</CardTitle>
            <Clock className="w-6 h-6 text-red-500" />
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {attendanceSummary.absent}
          </CardContent>
          <Progress value={absentPercentage} className="mt-2" />
        </Card>
      </div>

      {/* Attendance Trends (Bar Chart) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Attendance Trends (Last 7 Days)</CardTitle>
          <BarChart className="w-6 h-6 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-3">
            {attendanceTrends.map((day, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-8 bg-blue-500 rounded-md"
                  style={{
                    height: `${(day.present / maxAttendance) * 100}%`,
                    minHeight: "10px", // Ensures bars are always visible
                  }}
                />
                <span className="text-xs mt-1">{day.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Check-ins & Absent Students */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Check-ins Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Check-in Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCheckIns.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell className="text-right">{student.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Absent Students List */}
        <Card>
          <CardHeader>
            <CardTitle>Absent Students</CardTitle>
          </CardHeader>
          <CardContent>
            {absentStudents.length > 0 ? (
              <ul className="space-y-2">
                {absentStudents.map((name, index) => (
                  <li
                    key={index}
                    className="p-2 border rounded-md bg-red-50 text-red-700"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No absentees today.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
