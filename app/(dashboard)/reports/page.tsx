"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { allMembers } from "@/lib/data/members";
import { companies } from "@/lib/data/companies";
import { allReceipts } from "@/lib/data/receipts";
import { formatCurrency, formatDate, exportToCSV, calculateAge } from "@/lib/utils";
import {
  FileText,
  Download,
  Users,
  DollarSign,
  TrendingUp,
  PieChart,
} from "lucide-react";
import { AccountStatus, Gender } from "@/lib/types";

type ReportType =
  | "member-balances"
  | "beneficiaries"
  | "member-grouping"
  | "contributions"
  | null;

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportType>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");

  const generateMemberBalancesReport = () => {
    let filtered = allMembers;

    if (statusFilter !== "all") {
      filtered = filtered.filter((m) => m.accountStatus === statusFilter);
    }

    if (companyFilter !== "all") {
      filtered = filtered.filter((m) => m.companyId === companyFilter);
    }

    return filtered.map((m) => ({
      "Member ID": m.id,
      Name:
        m.type === "Individual"
          ? `${m.firstName} ${m.lastName}`
          : m.companyName,
      "ID Number": m.idNumber,
      Company: m.companyId
        ? companies.find((c) => c.id === m.companyId)?.name || "N/A"
        : "Individual",
      Status: m.accountStatus,
      "Opening Balance": m.openingBalance,
      "Current Balance": m.currentBalance,
      Growth: m.currentBalance - m.openingBalance,
      "Date Joined": m.dateOfJoining,
    }));
  };

  const generateBeneficiariesReport = () => {
    const data: any[] = [];
    allMembers.forEach((member) => {
      member.beneficiaries.forEach((ben) => {
        data.push({
          "Member ID": member.id,
          "Member Name":
            member.type === "Individual"
              ? `${member.firstName} ${member.lastName}`
              : member.companyName,
          "Beneficiary Name": ben.fullName,
          "Beneficiary ID": ben.idNumber,
          Relationship: ben.relationship,
          "Benefit Rate": `${ben.benefitRate}%`,
          "Member Balance": member.currentBalance,
          "Potential Benefit": (member.currentBalance * ben.benefitRate) / 100,
        });
      });
    });
    return data;
  };

  const generateMemberGroupingReport = () => {
    const genderGroups = {
      Male: allMembers.filter((m) => m.gender === Gender.MALE).length,
      Female: allMembers.filter((m) => m.gender === Gender.FEMALE).length,
      Other: allMembers.filter((m) => m.gender === Gender.OTHER).length,
    };

    const statusGroups = {
      Active: allMembers.filter((m) => m.accountStatus === AccountStatus.ACTIVE)
        .length,
      Dormant: allMembers.filter(
        (m) => m.accountStatus === AccountStatus.DORMANT
      ).length,
      Deceased: allMembers.filter(
        (m) => m.accountStatus === AccountStatus.DECEASED
      ).length,
      Closed: allMembers.filter((m) => m.accountStatus === AccountStatus.CLOSED)
        .length,
    };

    const ageGroups = {
      "Under 30": 0,
      "30-40": 0,
      "41-50": 0,
      "51-60": 0,
      "Over 60": 0,
    };

    allMembers.forEach((m) => {
      if (m.dateOfBirth) {
        const age = calculateAge(m.dateOfBirth);
        if (age < 30) ageGroups["Under 30"]++;
        else if (age <= 40) ageGroups["30-40"]++;
        else if (age <= 50) ageGroups["41-50"]++;
        else if (age <= 60) ageGroups["51-60"]++;
        else ageGroups["Over 60"]++;
      }
    });

    return [
      { Category: "Gender", Group: "Male", Count: genderGroups.Male },
      { Category: "Gender", Group: "Female", Count: genderGroups.Female },
      { Category: "Gender", Group: "Other", Count: genderGroups.Other },
      { Category: "Status", Group: "Active", Count: statusGroups.Active },
      { Category: "Status", Group: "Dormant", Count: statusGroups.Dormant },
      { Category: "Status", Group: "Deceased", Count: statusGroups.Deceased },
      { Category: "Status", Group: "Closed", Count: statusGroups.Closed },
      { Category: "Age", Group: "Under 30", Count: ageGroups["Under 30"] },
      { Category: "Age", Group: "30-40", Count: ageGroups["30-40"] },
      { Category: "Age", Group: "41-50", Count: ageGroups["41-50"] },
      { Category: "Age", Group: "51-60", Count: ageGroups["51-60"] },
      { Category: "Age", Group: "Over 60", Count: ageGroups["Over 60"] },
    ];
  };

  const generateContributionsReport = () => {
    let filtered = allReceipts;

    if (dateFrom) {
      filtered = filtered.filter((r) => r.receiptDate >= dateFrom);
    }

    if (dateTo) {
      filtered = filtered.filter((r) => r.receiptDate <= dateTo);
    }

    return filtered.map((r) => ({
      "Receipt ID": r.id,
      "Member Name": r.memberName,
      Date: r.receiptDate,
      "Reference Number": r.referenceNumber,
      Type: r.receiptType,
      Amount: r.amount,
      Description: r.description,
      Status: r.authorizationStatus,
    }));
  };

  const handleExport = () => {
    let data: any[] = [];
    let filename = "";

    switch (selectedReport) {
      case "member-balances":
        data = generateMemberBalancesReport();
        filename = "member-balances-report";
        break;
      case "beneficiaries":
        data = generateBeneficiariesReport();
        filename = "beneficiaries-report";
        break;
      case "member-grouping":
        data = generateMemberGroupingReport();
        filename = "member-grouping-report";
        break;
      case "contributions":
        data = generateContributionsReport();
        filename = "contributions-report";
        break;
    }

    if (data.length > 0) {
      exportToCSV(data, `${filename}-${new Date().toISOString().split("T")[0]}`);
    }
  };

  const reports = [
    {
      id: "member-balances" as ReportType,
      name: "Member Balances Report",
      description: "View all member account balances and growth",
      icon: DollarSign,
      color: "blue",
    },
    {
      id: "beneficiaries" as ReportType,
      name: "Beneficiaries Report",
      description: "List all members with their nominated beneficiaries",
      icon: Users,
      color: "green",
    },
    {
      id: "member-grouping" as ReportType,
      name: "Member Grouping Report",
      description: "Categorize members by gender, age, and status",
      icon: PieChart,
      color: "purple",
    },
    {
      id: "contributions" as ReportType,
      name: "Contributions Report",
      description: "Track all contributions and receipts",
      icon: TrendingUp,
      color: "amber",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="text-sm text-slate-500">
          Generate and export various pension fund reports
        </p>
      </div>

      {/* Report Selection */}
      {!selectedReport && (
        <div className="grid gap-6 md:grid-cols-2">
          {reports.map((report) => (
            <Card
              key={report.id}
              className="cursor-pointer transition-all hover:shadow-lg"
              onClick={() => setSelectedReport(report.id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div
                    className={`rounded-lg bg-${report.color}-100 p-3`}
                  >
                    <report.icon className={`h-6 w-6 text-${report.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{report.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {report.description}
                    </p>
                    <Button variant="ghost" size="sm" className="mt-3">
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Report Filters and Display */}
      {selectedReport && (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {reports.find((r) => r.id === selectedReport)?.name}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedReport(null)}
              >
                Change Report
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="grid gap-4 md:grid-cols-4">
                {(selectedReport === "member-balances" ||
                  selectedReport === "contributions") && (
                  <>
                    {selectedReport === "contributions" && (
                      <>
                        <Input
                          label="Date From"
                          type="date"
                          value={dateFrom}
                          onChange={(e) => setDateFrom(e.target.value)}
                        />
                        <Input
                          label="Date To"
                          type="date"
                          value={dateTo}
                          onChange={(e) => setDateTo(e.target.value)}
                        />
                      </>
                    )}
                    {selectedReport === "member-balances" && (
                      <>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Status Filter
                          </label>
                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          >
                            <option value="all">All Status</option>
                            <option value={AccountStatus.ACTIVE}>Active</option>
                            <option value={AccountStatus.DORMANT}>Dormant</option>
                            <option value={AccountStatus.DECEASED}>Deceased</option>
                            <option value={AccountStatus.CLOSED}>Closed</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Company Filter
                          </label>
                          <select
                            value={companyFilter}
                            onChange={(e) => setCompanyFilter(e.target.value)}
                            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          >
                            <option value="all">All Companies</option>
                            {companies.map((company) => (
                              <option key={company.id} value={company.id}>
                                {company.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export to CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Report Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-auto">
                {selectedReport === "member-balances" && (
                  <table className="w-full">
                    <thead className="sticky top-0 border-b border-slate-200 bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-600">
                          Member
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-600">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-600">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase text-slate-600">
                          Opening Balance
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase text-slate-600">
                          Current Balance
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase text-slate-600">
                          Growth
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {generateMemberBalancesReport()
                        .slice(0, 20)
                        .map((row, index) => (
                          <tr key={index} className="hover:bg-slate-50">
                            <td className="px-6 py-4 text-sm font-medium text-slate-900">
                              {row.Name}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {row.Company}
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant="status" status={row.Status}>
                                {row.Status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-right text-sm text-slate-900">
                              {formatCurrency(row["Opening Balance"])}
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium text-slate-900">
                              {formatCurrency(row["Current Balance"])}
                            </td>
                            <td
                              className={`px-6 py-4 text-right text-sm font-medium ${
                                row.Growth >= 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {row.Growth >= 0 ? "+" : ""}
                              {formatCurrency(row.Growth)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}

                {selectedReport === "beneficiaries" && (
                  <table className="w-full">
                    <thead className="sticky top-0 border-b border-slate-200 bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-600">
                          Member
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-600">
                          Beneficiary
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-600">
                          Relationship
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase text-slate-600">
                          Rate
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase text-slate-600">
                          Potential Benefit
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {generateBeneficiariesReport()
                        .slice(0, 20)
                        .map((row, index) => (
                          <tr key={index} className="hover:bg-slate-50">
                            <td className="px-6 py-4 text-sm font-medium text-slate-900">
                              {row["Member Name"]}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-900">
                              {row["Beneficiary Name"]}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {row.Relationship}
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium text-blue-600">
                              {row["Benefit Rate"]}
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium text-slate-900">
                              {formatCurrency(row["Potential Benefit"])}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}

                {selectedReport === "member-grouping" && (
                  <table className="w-full">
                    <thead className="sticky top-0 border-b border-slate-200 bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-600">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-600">
                          Group
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase text-slate-600">
                          Count
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase text-slate-600">
                          Percentage
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {generateMemberGroupingReport().map((row, index) => (
                        <tr key={index} className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">
                            {row.Category}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-900">
                            {row.Group}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium text-slate-900">
                            {row.Count}
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-slate-600">
                            {((row.Count / allMembers.length) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {selectedReport === "contributions" && (
                  <table className="w-full">
                    <thead className="sticky top-0 border-b border-slate-200 bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-600">
                          Reference
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-600">
                          Member
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-600">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-600">
                          Type
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase text-slate-600">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {generateContributionsReport()
                        .slice(0, 20)
                        .map((row, index) => (
                          <tr key={index} className="hover:bg-slate-50">
                            <td className="px-6 py-4 text-sm font-medium text-slate-900">
                              {row["Reference Number"]}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-900">
                              {row["Member Name"]}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {formatDate(row.Date)}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {row.Type}
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium text-green-600">
                              {formatCurrency(row.Amount)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="border-t border-slate-200 p-4 text-center text-sm text-slate-500">
                Showing preview of first 20 records. Export to CSV for full report.
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
