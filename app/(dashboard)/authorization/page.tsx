"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { authorizationQueue } from "@/lib/data/authorizationQueue";
import { users } from "@/lib/data/users";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Filter,
  AlertCircle,
} from "lucide-react";
import { AuthorizationStatus, RecordType } from "@/lib/types";

export default function AuthorizationPage() {
  const [statusFilter, setStatusFilter] = useState<string>("submitted");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionReason, setActionReason] = useState("");

  // Filter records
  const filteredRecords = authorizationQueue.filter((record) => {
    if (statusFilter !== "all" && record.status !== statusFilter) return false;
    if (typeFilter !== "all" && record.recordType !== typeFilter) return false;
    return true;
  });

  const pendingCount = authorizationQueue.filter(
    (r) => r.status === AuthorizationStatus.SUBMITTED
  ).length;

  const getUserName = (userId: string) => {
    return users.find((u) => u.id === userId)?.fullName || "Unknown";
  };

  const handleViewDetails = (record: any) => {
    setSelectedRecord(record);
    setShowModal(true);
    setActionReason("");
  };

  const handleApprove = () => {
    if (!actionReason.trim()) {
      alert("Please provide a reason for approval");
      return;
    }
    alert(`Record ${selectedRecord.id} approved!\nReason: ${actionReason}`);
    setShowModal(false);
    setActionReason("");
  };

  const handleReject = () => {
    if (!actionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    alert(`Record ${selectedRecord.id} rejected!\nReason: ${actionReason}`);
    setShowModal(false);
    setActionReason("");
  };

  const getRecordTypeIcon = (type: RecordType) => {
    switch (type) {
      case RecordType.MEMBER:
        return "👤";
      case RecordType.RECEIPT:
        return "📄";
      case RecordType.PAYMENT:
        return "💰";
      case RecordType.TRANSFER:
        return "🔄";
      case RecordType.EARNING:
        return "📈";
      default:
        return "📋";
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Authorization Queue</h1>
          <p className="text-sm text-slate-500">
            Review and authorize pending transactions
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center space-x-2 rounded-lg bg-amber-50 px-4 py-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-medium text-amber-900">
              {pendingCount} pending authorization{pendingCount !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{pendingCount}</div>
            <p className="mt-1 text-xs text-slate-500">Awaiting authorization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Approved Today
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {
                authorizationQueue.filter(
                  (r) =>
                    r.status === AuthorizationStatus.APPROVED &&
                    r.authorizedAt?.startsWith("2025-05-08")
                ).length
              }
            </div>
            <p className="mt-1 text-xs text-slate-500">Successfully processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Rejected
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {
                authorizationQueue.filter(
                  (r) => r.status === AuthorizationStatus.REJECTED
                ).length
              }
            </div>
            <p className="mt-1 text-xs text-slate-500">Requires correction</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">All Status</option>
                <option value={AuthorizationStatus.SUBMITTED}>Pending</option>
                <option value={AuthorizationStatus.APPROVED}>Approved</option>
                <option value={AuthorizationStatus.REJECTED}>Rejected</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Record Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">All Types</option>
                <option value={RecordType.MEMBER}>Members</option>
                <option value={RecordType.RECEIPT}>Receipts</option>
                <option value={RecordType.PAYMENT}>Payments</option>
                <option value={RecordType.TRANSFER}>Transfers</option>
                <option value={RecordType.EARNING}>Earnings</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Authorization Queue Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                    Record ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                    Submitted By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                    Submitted Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">
                          {getRecordTypeIcon(record.recordType)}
                        </span>
                        <span className="text-sm font-medium text-slate-900">
                          {record.recordType}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                      {record.recordId}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">
                        {record.recordType === RecordType.MEMBER &&
                          `${record.recordData.firstName} ${record.recordData.lastName}`}
                        {record.recordType === RecordType.RECEIPT &&
                          `${record.recordData.memberName} - ${formatCurrency(
                            record.recordData.amount
                          )}`}
                        {record.recordType === RecordType.PAYMENT &&
                          `${record.recordData.memberName} - ${formatCurrency(
                            record.recordData.amount
                          )}`}
                        {record.recordType === RecordType.TRANSFER &&
                          `${record.recordData.memberName} - Transfer`}
                      </div>
                      <div className="text-xs text-slate-500">
                        {record.recordType === RecordType.RECEIPT &&
                          record.recordData.referenceNumber}
                        {record.recordType === RecordType.PAYMENT &&
                          record.recordData.referenceNumber}
                        {record.recordType === RecordType.MEMBER &&
                          record.recordData.idNumber}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {getUserName(record.submittedBy)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {formatDate(record.submittedAt, "dd MMM yyyy HH:mm")}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Badge variant="status" status={record.status}>
                        {record.status}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(record)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-500">
                No records found matching your filters
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Authorization Modal */}
      {showModal && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Authorization Details
                  </h2>
                  <p className="text-sm text-slate-500">
                    {selectedRecord.recordType} • {selectedRecord.recordId}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="space-y-6 p-6">
              {/* Record Details */}
              <div className="rounded-lg border border-slate-200 p-4">
                <h3 className="mb-3 font-medium text-slate-900">Record Information</h3>
                <dl className="grid gap-3 text-sm">
                  {Object.entries(selectedRecord.recordData).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <dt className="font-medium text-slate-600">
                        {key.replace(/([A-Z])/g, " $1").trim()}:
                      </dt>
                      <dd className="text-slate-900">
                        {typeof value === "number" && key.includes("amount")
                          ? formatCurrency(value)
                          : String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Submission Info */}
              <div className="rounded-lg border border-slate-200 p-4">
                <h3 className="mb-3 font-medium text-slate-900">Submission Details</h3>
                <dl className="grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="font-medium text-slate-600">Submitted By:</dt>
                    <dd className="text-slate-900">
                      {getUserName(selectedRecord.submittedBy)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-slate-600">Submitted At:</dt>
                    <dd className="text-slate-900">
                      {formatDate(selectedRecord.submittedAt, "dd MMM yyyy HH:mm")}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-slate-600">Current Status:</dt>
                    <dd>
                      <Badge variant="status" status={selectedRecord.status}>
                        {selectedRecord.status}
                      </Badge>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Audit Trail */}
              <div className="rounded-lg border border-slate-200 p-4">
                <h3 className="mb-3 font-medium text-slate-900">Audit Trail</h3>
                <div className="space-y-3">
                  {selectedRecord.auditTrail.map((log: any, index: number) => (
                    <div
                      key={log.id}
                      className="flex items-start space-x-3 border-l-2 border-blue-600 pl-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-900">
                            {log.action}
                          </span>
                          <span className="text-xs text-slate-500">
                            {formatDate(log.performedAt, "dd MMM yyyy HH:mm")}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          By {getUserName(log.performedBy)}
                        </p>
                        {log.reason && (
                          <p className="mt-1 text-xs italic text-slate-500">
                            "{log.reason}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Authorization Action */}
              {selectedRecord.status === AuthorizationStatus.SUBMITTED && (
                <div className="rounded-lg border border-slate-200 p-4">
                  <h3 className="mb-3 font-medium text-slate-900">
                    Authorization Action
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Reason <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={actionReason}
                        onChange={(e) => setActionReason(e.target.value)}
                        rows={3}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Provide a reason for your decision..."
                      />
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        onClick={handleApprove}
                        className="flex-1"
                        disabled={!actionReason.trim()}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        onClick={handleReject}
                        variant="danger"
                        className="flex-1"
                        disabled={!actionReason.trim()}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Already Authorized */}
              {selectedRecord.status !== AuthorizationStatus.SUBMITTED && (
                <div
                  className={`rounded-lg p-4 ${
                    selectedRecord.status === AuthorizationStatus.APPROVED
                      ? "bg-green-50"
                      : "bg-red-50"
                  }`}
                >
                  <p className="text-sm font-medium">
                    {selectedRecord.status === AuthorizationStatus.APPROVED
                      ? "✓ Approved"
                      : "✗ Rejected"}{" "}
                    by {getUserName(selectedRecord.authorizedBy!)}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {formatDate(selectedRecord.authorizedAt!, "dd MMM yyyy HH:mm")}
                  </p>
                  {selectedRecord.reason && (
                    <p className="mt-2 text-sm italic">"{selectedRecord.reason}"</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
