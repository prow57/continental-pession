"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { Gender, MaritalStatus, IDType, AccountStatus } from "@/lib/types";
import { companies } from "@/lib/data/companies";

const steps = [
  { id: 1, name: "Basic Information" },
  { id: 2, name: "Address" },
  { id: 3, name: "Next of Kin" },
  { id: 4, name: "Beneficiaries" },
  { id: 5, name: "Account Setup" },
  { id: 6, name: "Review" },
];

export default function NewMemberPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [memberType, setMemberType] = useState<"Individual" | "Company">("Individual");
  
  // Form state
  const [formData, setFormData] = useState({
    // Basic Info
    firstName: "",
    lastName: "",
    companyName: "",
    dateOfBirth: "",
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.SINGLE,
    idType: IDType.NATIONAL_ID,
    idNumber: "",
    phoneNumber: "",
    dateOfJoining: new Date().toISOString().split("T")[0],
    // Address
    location: "",
    district: "",
    placeOfBirthLocation: "",
    placeOfBirthDistrict: "",
    village: "",
    // Next of Kin
    nokFullName: "",
    nokIdNumber: "",
    nokAddress: "",
    nokPhoneNumber: "",
    nokRelationship: "",
    // Beneficiaries
    beneficiaries: [
      { fullName: "", dateOfBirth: "", idNumber: "", relationship: "", benefitRate: 100 },
    ],
    // Account
    accountStatus: AccountStatus.ACTIVE,
    companyId: "",
    openingBalance: 0,
    notes: "",
  });

  const [beneficiaryTotal, setBeneficiaryTotal] = useState(100);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addBeneficiary = () => {
    setFormData((prev) => ({
      ...prev,
      beneficiaries: [
        ...prev.beneficiaries,
        { fullName: "", dateOfBirth: "", idNumber: "", relationship: "", benefitRate: 0 },
      ],
    }));
  };

  const removeBeneficiary = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      beneficiaries: prev.beneficiaries.filter((_, i) => i !== index),
    }));
  };

  const updateBeneficiary = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const newBeneficiaries = [...prev.beneficiaries];
      newBeneficiaries[index] = { ...newBeneficiaries[index], [field]: value };
      return { ...prev, beneficiaries: newBeneficiaries };
    });
    
    // Calculate total
    const total = formData.beneficiaries.reduce((sum, b, i) => {
      if (i === index) return sum + Number(value);
      return sum + b.benefitRate;
    }, 0);
    setBeneficiaryTotal(total);
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    alert("Member registration submitted for authorization!");
    // In real app, would save to backend
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/members">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Members
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Register New Member</h1>
            <p className="text-sm text-slate-500">
              Complete all steps to register a new pension fund member
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      currentStep > step.id
                        ? "border-green-600 bg-green-600 text-white"
                        : currentStep === step.id
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-300 bg-white text-slate-400"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  <span className="mt-2 text-xs font-medium text-slate-600">
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 ${
                      currentStep > step.id ? "bg-green-600" : "bg-slate-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Member Type
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setMemberType("Individual")}
                    className={`flex-1 rounded-lg border-2 p-4 text-center transition-colors ${
                      memberType === "Individual"
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    <span className="font-medium">Individual</span>
                  </button>
                  <button
                    onClick={() => setMemberType("Company")}
                    className={`flex-1 rounded-lg border-2 p-4 text-center transition-colors ${
                      memberType === "Company"
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    <span className="font-medium">Company</span>
                  </button>
                </div>
              </div>

              {memberType === "Individual" ? (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label="First Name"
                      required
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                    />
                    <Input
                      label="Last Name"
                      required
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label="Date of Birth"
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    />
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange("gender", e.target.value)}
                        className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value={Gender.MALE}>Male</option>
                        <option value={Gender.FEMALE}>Female</option>
                        <option value={Gender.OTHER}>Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Marital Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.maritalStatus}
                      onChange={(e) => handleInputChange("maritalStatus", e.target.value)}
                      className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value={MaritalStatus.SINGLE}>Single</option>
                      <option value={MaritalStatus.MARRIED}>Married</option>
                      <option value={MaritalStatus.DIVORCED}>Divorced</option>
                      <option value={MaritalStatus.WIDOWED}>Widowed</option>
                    </select>
                  </div>
                </>
              ) : (
                <Input
                  label="Company Name"
                  required
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                />
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    ID Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.idType}
                    onChange={(e) => handleInputChange("idType", e.target.value)}
                    className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value={IDType.NATIONAL_ID}>National ID</option>
                    <option value={IDType.PASSPORT}>Passport</option>
                    <option value={IDType.DRIVERS_LICENSE}>Driver's License</option>
                  </select>
                </div>
                <Input
                  label="ID Number"
                  required
                  value={formData.idNumber}
                  onChange={(e) => handleInputChange("idNumber", e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Phone Number"
                  type="tel"
                  required
                  placeholder="+265 999 123 456"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                />
                <Input
                  label="Date of Joining"
                  type="date"
                  required
                  value={formData.dateOfJoining}
                  onChange={(e) => handleInputChange("dateOfJoining", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 2: Address */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Location"
                  required
                  placeholder="e.g., Area 47"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
                <Input
                  label="District"
                  required
                  placeholder="e.g., Lilongwe"
                  value={formData.district}
                  onChange={(e) => handleInputChange("district", e.target.value)}
                />
              </div>

              {memberType === "Individual" && (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label="Place of Birth - Location"
                      placeholder="e.g., Mzuzu"
                      value={formData.placeOfBirthLocation}
                      onChange={(e) =>
                        handleInputChange("placeOfBirthLocation", e.target.value)
                      }
                    />
                    <Input
                      label="Place of Birth - District"
                      placeholder="e.g., Mzimba"
                      value={formData.placeOfBirthDistrict}
                      onChange={(e) =>
                        handleInputChange("placeOfBirthDistrict", e.target.value)
                      }
                    />
                  </div>
                  <Input
                    label="Village (Optional)"
                    placeholder="e.g., Ekwendeni"
                    value={formData.village}
                    onChange={(e) => handleInputChange("village", e.target.value)}
                  />
                </>
              )}
            </div>
          )}

          {/* Step 3: Next of Kin */}
          {currentStep === 3 && memberType === "Individual" && (
            <div className="space-y-4">
              <Input
                label="Full Name"
                required
                value={formData.nokFullName}
                onChange={(e) => handleInputChange("nokFullName", e.target.value)}
              />
              <Input
                label="ID Number"
                required
                value={formData.nokIdNumber}
                onChange={(e) => handleInputChange("nokIdNumber", e.target.value)}
              />
              <Input
                label="Address"
                required
                value={formData.nokAddress}
                onChange={(e) => handleInputChange("nokAddress", e.target.value)}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Phone Number"
                  type="tel"
                  required
                  value={formData.nokPhoneNumber}
                  onChange={(e) => handleInputChange("nokPhoneNumber", e.target.value)}
                />
                <Input
                  label="Relationship"
                  required
                  placeholder="e.g., Spouse, Parent, Sibling"
                  value={formData.nokRelationship}
                  onChange={(e) => handleInputChange("nokRelationship", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 4: Beneficiaries */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-blue-900">
                  Total benefit allocation: <strong>{beneficiaryTotal}%</strong>
                  {beneficiaryTotal !== 100 && (
                    <span className="ml-2 text-red-600">
                      (Must equal 100%)
                    </span>
                  )}
                </p>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-blue-200">
                  <div
                    className={`h-full transition-all ${
                      beneficiaryTotal === 100 ? "bg-green-600" : "bg-blue-600"
                    }`}
                    style={{ width: `${Math.min(beneficiaryTotal, 100)}%` }}
                  />
                </div>
              </div>

              {formData.beneficiaries.map((beneficiary, index) => (
                <div key={index} className="rounded-lg border border-slate-200 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-medium text-slate-900">
                      Beneficiary {index + 1}
                    </h4>
                    {formData.beneficiaries.length > 1 && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeBeneficiary(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="space-y-4">
                    <Input
                      label="Full Name"
                      required
                      value={beneficiary.fullName}
                      onChange={(e) =>
                        updateBeneficiary(index, "fullName", e.target.value)
                      }
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                      <Input
                        label="Date of Birth"
                        type="date"
                        required
                        value={beneficiary.dateOfBirth}
                        onChange={(e) =>
                          updateBeneficiary(index, "dateOfBirth", e.target.value)
                        }
                      />
                      <Input
                        label="ID Number"
                        required
                        value={beneficiary.idNumber}
                        onChange={(e) =>
                          updateBeneficiary(index, "idNumber", e.target.value)
                        }
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Input
                        label="Relationship"
                        required
                        placeholder="e.g., Child, Spouse"
                        value={beneficiary.relationship}
                        onChange={(e) =>
                          updateBeneficiary(index, "relationship", e.target.value)
                        }
                      />
                      <Input
                        label="Benefit Rate (%)"
                        type="number"
                        required
                        min="0"
                        max="100"
                        value={beneficiary.benefitRate}
                        onChange={(e) =>
                          updateBeneficiary(index, "benefitRate", Number(e.target.value))
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={addBeneficiary} className="w-full">
                + Add Another Beneficiary
              </Button>
            </div>
          )}

          {/* Step 5: Account Setup */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Account Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.accountStatus}
                  onChange={(e) => handleInputChange("accountStatus", e.target.value)}
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value={AccountStatus.ACTIVE}>Active</option>
                  <option value={AccountStatus.DORMANT}>Dormant</option>
                </select>
              </div>

              {memberType === "Individual" && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Company
                  </label>
                  <select
                    value={formData.companyId}
                    onChange={(e) => handleInputChange("companyId", e.target.value)}
                    className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Select Company (Optional)</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <Input
                label="Opening Balance (Optional)"
                type="number"
                min="0"
                value={formData.openingBalance}
                onChange={(e) =>
                  handleInputChange("openingBalance", Number(e.target.value))
                }
              />

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Notes/Comments
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={4}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Any additional information..."
                />
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-sm font-medium text-green-900">
                  ✓ All information has been entered. Please review before submitting.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border border-slate-200 p-4">
                  <h4 className="mb-3 font-medium text-slate-900">Basic Information</h4>
                  <dl className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Type:</dt>
                      <dd className="font-medium">{memberType}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Name:</dt>
                      <dd className="font-medium">
                        {memberType === "Individual"
                          ? `${formData.firstName} ${formData.lastName}`
                          : formData.companyName}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-600">ID:</dt>
                      <dd className="font-medium">{formData.idNumber}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Phone:</dt>
                      <dd className="font-medium">{formData.phoneNumber}</dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-lg border border-slate-200 p-4">
                  <h4 className="mb-3 font-medium text-slate-900">Beneficiaries</h4>
                  <div className="space-y-2">
                    {formData.beneficiaries.map((ben, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-slate-600">{ben.fullName}</span>
                        <span className="font-medium">{ben.benefitRate}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 p-4">
                  <h4 className="mb-3 font-medium text-slate-900">Account Details</h4>
                  <dl className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Status:</dt>
                      <dd>
                        <Badge variant="status" status={formData.accountStatus}>
                          {formData.accountStatus}
                        </Badge>
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Opening Balance:</dt>
                      <dd className="font-medium">
                        MWK {formData.openingBalance.toLocaleString()}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between border-t border-slate-200 pt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                <Check className="mr-2 h-4 w-4" />
                Submit for Authorization
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
