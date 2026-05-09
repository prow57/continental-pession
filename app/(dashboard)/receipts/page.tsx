"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { allMembers } from "@/lib/data/members";
import { allReceipts } from "@/lib/data/receipts";
import { formatCurrency, formatDate, generateReferenceNumber } from "@/lib/utils";
import { Plus, Search, DollarSign, CheckCircle } from "lucide-react";
import { AuthorizationStatus } from "@/lib/types";

export default function ReceiptsPage() {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [formData, setFormData] = useState({
    receiptDate: new Date().toISOString().split("T")[0],
    referenceNumber: generateReferenceNumber("REC"),
    description: "",
    amount: "",
    receiptType: "Monthly Contribution",
  });

  // Filter members for search
  const filteredMembers = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return allMembers
      .filter(
        (m) =>
          m.firstName?.toLowerCase().includes(query) ||
          m.lastName?.toLowerCase().includes(query) ||
          m.companyName?.toLowerCase().includes(query) ||
          m.idNumber?.toLowerCase().includes(query)
      )
      .slice(0, 5);
  }, [searchQuery]);

  const handleSelectMember = (member: any) => {
    setSelectedMember(member);
    setSearchQuery("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !formData.amount) {
      alert("Please select a member and enter an amount");
      return;
    }
    alert(
      `Receipt submitted for authorization!\n\nMember: ${selectedMember.firstName} ${selectedMember.lastName}\nAmount: ${formatCurrency(Number(formData.amount))}\nReference: ${formData.referenceNumber}`
    );
    // Reset form
    setFormData({
      receiptDate: new Date().toISOString().split("T")[0],
      referenceNumber: generateReferenceNumber("REC"),
      description: "",
      amount: "",
      receiptType: "Monthly Contribution",
    });
    setSelectedMember(null);
    setShowForm(false);
  };

  const recentReceipts = allReceipts.slice(0, 20);

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Receipt Entry</h1>
          <p className="text-sm text-slate-500">
            Record member contributions and payments
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? "Cancel" : "New Receipt"}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Today's Receipts
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {
                allReceipts.filter((r) => r.receiptDate === new Date().toISOString().split("T")[0])
                  .length
              }
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {formatCurrency(
                allReceipts
                  .filter((r) => r.receiptDate === new Date().toISOString().split("T")[0])
                  .reduce((sum, r) => sum + r.amount, 0)
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Pending Authorization
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {
                allReceipts.filter((r) => r.authorizationStatus === AuthorizationStatus.SUBMITTED)
                  .length
              }
            </div>
            <p className="mt-1 text-xs text-slate-500">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              This Month
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(
                allReceipts
                  .filter((r) => r.receiptDate.startsWith("2025-05"))
                  .reduce((sum, r) => sum + r.amount, 0)
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">Total contributions</p>
          </CardContent>
        </Card>
      </div>

      {/* Receipt Entry Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>New Receipt Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Member Search */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Select Member <span className="text-red-500">*</span>
                </label>
                {selectedMember ? (
                  <div className="flex items-center justify-between rounded-lg border-2 border-blue-600 bg-blue-50 p-4">
                    <div>
                      <p className="font-medium text-slate-900">
                        {selectedMember.firstName} {selectedMember.lastName}
                      </p>
                      <p className="text-sm text-slate-600">
                        {selectedMember.idNumber} • Current Balance:{" "}
                        {formatCurrency(selectedMember.currentBalance)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedMember(null)}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Search by name, ID number..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                    {filteredMembers.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
                        {filteredMembers.map((member) => (
                          <button
                            key={member.id}
                            type="button"
                            onClick={() => handleSelectMember(member)}
                            className="w-full border-b border-slate-100 p-3 text-left hover:bg-slate-50 last:border-0"
                          >
                            <p className="font-medium text-slate-900">
                              {member.firstName} {member.lastName}
                            </p>
                            <p className="text-sm text-slate-600">
                              {member.idNumber} • {formatCurrency(member.currentBalance)}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Receipt Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Receipt Date"
                  type="date"
                  required
                  value={formData.receiptDate}
                  onChange={(e) =>
                    setFormData({ ...formData, receiptDate: e.target.value })
                  }
                />
                <Input
                  label="Reference Number"
                  required
                  value={formData.referenceNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, referenceNumber: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Receipt Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.receiptType}
                  onChange={(e) =>
                    setFormData({ ...formData, receiptType: e.target.value })
                  }
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Monthly Contribution">Monthly Contribution</option>
                  <option value="Lump Sum">Lump Sum</option>
                  <option value="Arrears">Arrears</option>
                  <option value="Voluntary">Voluntary Contribution</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <Input
                label="Amount (MWK)"
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Additional notes or description..."
                />
              </div>

              {/* Preview */}
              {selectedMember && formData.amount && (
                <div className="rounded-lg bg-green-50 p-4">
                  <p className="text-sm font-medium text-green-900">
                    New Balance Preview
                  </p>
                  <p className="mt-1 text-xs text-green-700">
                    Current: {formatCurrency(selectedMember.currentBalance)} → New:{" "}
                    {formatCurrency(
                      selectedMember.currentBalance + Number(formData.amount)
                    )}
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                <Button type="submit" className="flex-1">
                  Submit for Authorization
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Recent Receipts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Receipts</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {recentReceipts.map((receipt) => (
                  <tr key={receipt.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                      {receipt.referenceNumber}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">
                      {receipt.memberName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {formatDate(receipt.receiptDate)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {receipt.receiptType}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-green-600">
                      {formatCurrency(receipt.amount)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Badge variant="status" status={receipt.authorizationStatus}>
                        {receipt.authorizationStatus}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
