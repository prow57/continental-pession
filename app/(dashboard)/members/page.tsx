"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { allMembers } from "@/lib/data/members";
import { companies } from "@/lib/data/companies";
import { formatCurrency, formatDate, searchMembers, sortData } from "@/lib/utils";
import {
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AccountStatus, Gender } from "@/lib/types";

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [companyFilter, setCompanyFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<string>("dateOfJoining");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter and sort members
  const filteredMembers = useMemo(() => {
    let filtered = allMembers;

    // Search
    if (searchQuery) {
      filtered = searchMembers(filtered, searchQuery);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((m) => m.accountStatus === statusFilter);
    }

    // Gender filter
    if (genderFilter !== "all") {
      filtered = filtered.filter((m) => m.gender === genderFilter);
    }

    // Company filter
    if (companyFilter !== "all") {
      filtered = filtered.filter((m) => m.companyId === companyFilter);
    }

    // Sort
    return sortData(filtered, sortKey as any, sortDirection);
  }, [searchQuery, statusFilter, genderFilter, companyFilter, sortKey, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const getCompanyName = (companyId?: string) => {
    if (!companyId) return "Individual";
    return companies.find((c) => c.id === companyId)?.name || "Unknown";
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Members</h1>
          <p className="text-sm text-slate-500">
            Manage pension fund members and their accounts
          </p>
        </div>
        <Link href="/members/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Register Member
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-5">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search by name, ID, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All Status</option>
              <option value={AccountStatus.ACTIVE}>Active</option>
              <option value={AccountStatus.DORMANT}>Dormant</option>
              <option value={AccountStatus.DECEASED}>Deceased</option>
              <option value={AccountStatus.CLOSED}>Closed</option>
            </select>

            {/* Gender Filter */}
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All Genders</option>
              <option value={Gender.MALE}>Male</option>
              <option value={Gender.FEMALE}>Female</option>
              <option value={Gender.OTHER}>Other</option>
            </select>

            {/* Company Filter */}
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All Companies</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Showing {paginatedMembers.length} of {filteredMembers.length} members
            </p>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort("id")}
                      className="flex items-center text-xs font-medium uppercase tracking-wider text-slate-600 hover:text-slate-900"
                    >
                      Member ID
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort("firstName")}
                      className="flex items-center text-xs font-medium uppercase tracking-wider text-slate-600 hover:text-slate-900"
                    >
                      Name
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort("currentBalance")}
                      className="flex items-center text-xs font-medium uppercase tracking-wider text-slate-600 hover:text-slate-900"
                    >
                      Balance
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort("dateOfJoining")}
                      className="flex items-center text-xs font-medium uppercase tracking-wider text-slate-600 hover:text-slate-900"
                    >
                      Joined
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {paginatedMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                      {member.id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {member.type === "Individual"
                            ? `${member.firstName} ${member.lastName}`
                            : member.companyName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {member.idNumber}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {member.type}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {member.gender || "-"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {member.phoneNumber}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {getCompanyName(member.companyId)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                      {formatCurrency(member.currentBalance)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Badge variant="status" status={member.accountStatus}>
                        {member.accountStatus}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {formatDate(member.dateOfJoining)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <Link href={`/members/${member.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
              <div className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
