# 📱 CPS Back Office System - Screens Overview

## Complete Visual Guide to All 8 Screens

---

## 🏠 Screen 1: Dashboard
**Route**: `/dashboard`

### Purpose
Central hub showing real-time system statistics and quick access to key functions.

### Key Features
- 4 KPI cards with trend indicators
- Member distribution charts (gender, status)
- Recent transactions feed (last 5)
- Quick action buttons
- Pending authorizations alert

### Data Displayed
- Total members: 60
- Active members: 54
- Dormant members: 6
- Total fund value: MWK 200M+
- Monthly contributions
- Pending authorizations: 5

### User Actions
- View statistics at a glance
- Click quick actions to navigate
- Monitor pending items

---

## 👥 Screen 2: Member List
**Route**: `/members`

### Purpose
Browse, search, and filter all pension fund members.

### Key Features
- Searchable table (60 members)
- Advanced filters:
  - Status (Active, Dormant, Deceased, Closed)
  - Gender (Male, Female, Other)
  - Company (10 companies)
- Sortable columns (click headers)
- Pagination (20 per page, 3 pages)
- Status badges with colors
- Export to CSV button
- Register new member button

### Table Columns
1. Member ID
2. Name/Company Name
3. Type (Individual/Company)
4. Gender
5. Phone Number
6. Company
7. Current Balance
8. Status Badge
9. Date Joined
10. Actions (View button)

### User Actions
- Search by name, ID, phone
- Filter by multiple criteria
- Sort by any column
- Navigate pages
- Export data
- View member details
- Register new member

---

## 📝 Screen 3: Member Registration
**Route**: `/members/new`

### Purpose
Register new pension fund members with complete KYC information.

### Key Features
- 6-step multi-step form
- Progress indicator
- Individual/Company selector
- Dynamic beneficiary management
- Real-time percentage validation
- Form state persistence
- Navigation (next/previous)

### Steps

**Step 1: Basic Information**
- Member type (Individual/Company)
- First Name, Last Name (or Company Name)
- Date of Birth
- Gender, Marital Status
- ID Type, ID Number
- Phone Number
- Date of Joining

**Step 2: Address Information**
- Physical Address (Location, District)
- Place of Birth (Location, District)
- Village (optional)

**Step 3: Next of Kin**
- Full Name
- ID Number
- Address
- Phone Number
- Relationship

**Step 4: Beneficiaries** (Most Complex!)
- Add/Remove beneficiaries dynamically
- For each beneficiary:
  - Full Name
  - Date of Birth
  - ID Number
  - Relationship
  - Benefit Rate (%)
- Real-time percentage total
- Visual progress bar
- Must total exactly 100%

**Step 5: Account Setup**
- Account Status (Active/Dormant)
- Company assignment (for individuals)
- Opening Balance (optional)
- Notes/Comments

**Step 6: Review & Submit**
- Summary of all entered data
- Edit buttons for each section
- Submit for authorization button

### User Actions
- Select member type
- Fill in all required fields
- Add multiple beneficiaries
- Validate percentages
- Review all information
- Submit for authorization

---

## ✅ Screen 4: Authorization Queue
**Route**: `/authorization`

### Purpose
Review and authorize pending transactions (Capturer/Authorizer workflow).

### Key Features
- 3 summary cards (Pending, Approved, Rejected)
- Filter by status and record type
- Authorization detail modal
- Complete audit trail
- Approve/Reject with mandatory reason
- 7 sample records

### Table Columns
1. Type (with icon)
2. Record ID
3. Description
4. Submitted By
5. Submitted Date
6. Status Badge
7. Actions (View button)

### Record Types
- 👤 Member (new registrations)
- 📄 Receipt (contributions)
- 💰 Payment (withdrawals)
- 🔄 Transfer (between companies)
- 📈 Earning (bonus allocation)

### Authorization Modal
- Record information (all fields)
- Submission details (who, when)
- Complete audit trail (timeline)
- Action section:
  - Reason textarea (mandatory)
  - Approve button (green)
  - Reject button (red)

### Audit Trail
- Created → Submitted → Approved/Rejected
- Each action shows:
  - Action type
  - Performed by (user name)
  - Timestamp
  - Reason/Comments

### User Actions
- Filter by status/type
- View record details
- Review audit trail
- Approve with reason
- Reject with reason
- Track authorization history

---

## 🧾 Screen 5: Receipt Entry
**Route**: `/receipts`

### Purpose
Record member contributions and payments to the pension fund.

### Key Features
- 3 summary cards (Today, Pending, This Month)
- Member search/autocomplete
- Receipt entry form
- Recent receipts table (100+ receipts)
- Balance preview
- Authorization status tracking

### Receipt Entry Form
- Member search (autocomplete dropdown)
- Selected member display:
  - Name
  - ID Number
  - Current Balance
- Receipt Date (date picker)
- Reference Number (auto-generated)
- Receipt Type dropdown:
  - Monthly Contribution
  - Lump Sum
  - Arrears
  - Voluntary Contribution
  - Other
- Amount (MWK)
- Description (textarea)
- Balance preview (current → new)
- Submit button

### Recent Receipts Table
1. Reference Number
2. Member Name
3. Date
4. Type
5. Amount (green)
6. Status Badge

### User Actions
- Search and select member
- Enter receipt details
- Preview new balance
- Submit for authorization
- View recent receipts
- Track authorization status

---

## 📊 Screen 6: Member Ledger
**Route**: `/members/[id]`

### Purpose
View complete transaction history and balance details for a specific member.

### Key Features
- Member profile display
- 4 balance summary cards
- Balance flow visualization
- Transaction trail table
- Period filters
- Export statement to CSV

### Member Profile
- Full name
- Member ID
- ID Number
- Phone Number
- Company
- Beneficiaries count
- Account status badge
- Member since date

### Balance Summary Cards
1. **Opening Balance** - Start of period
2. **Total Contributions** - Receipts + Earnings (green)
3. **Total Withdrawals** - Payments + Fees (red)
4. **Current Balance** - With growth indicator

### Period Filters
- Last Month
- Last Quarter
- Last Year
- All Time

### Balance Flow Diagram
- Visual representation:
  - Opening Balance (left)
  - Progress bar (green/red split)
  - Closing Balance (right)
- Shows contributions vs withdrawals

### Transaction Trail Table
1. Date
2. Reference Number
3. Type Badge (Receipt/Payment/Earning/Transfer)
4. Description
5. Debit (red, right-aligned)
6. Credit (green, right-aligned)
7. Balance (bold, right-aligned)

### Generated Transactions
- Opening balance
- Monthly contributions (16 months)
- Annual earnings (2-3 entries)
- Occasional withdrawals
- Balance adjustments

### User Actions
- Select period filter
- View transaction history
- Export statement to CSV
- Track balance changes
- Review all transactions

---

## 💰 Screen 7: PW Setup (Programmed Withdrawal)
**Route**: `/pw-setup`

### Purpose
Configure investment and withdrawal schedules for pension members.

### Key Features
- Info card explaining PW
- Eligible member selection
- 3 PW option types
- Investment parameters
- Automatic calculation
- Fund movement table
- 4 summary cards
- Fund depletion warning

### Member Selection
- Search eligible members (Active, Balance > 0)
- Autocomplete dropdown
- Selected member display:
  - Name
  - ID Number
  - Age
  - Available Balance

### PW Configuration

**PW Options** (3 cards)
1. Monthly Annuity - Fixed monthly payments
2. Life-based PW - Based on life expectancy
3. Fixed-Term PW - Fixed number of years

**Investment Parameters**
- Annual Investment Rate (%) - 0-20%
- Tenure (Months) - 12-360
- Monthly Payment (Optional) - Auto-calculated

**Calculate Button** - Triggers calculation

### Calculation Results

**Summary Cards**
1. **Monthly Payment** - Fixed amount
2. **Total Interest** - Over tenure (green)
3. **Total Withdrawals** - All payments (red)
4. **Final Balance** - Remaining amount

**Fund Movement Table** (Scrollable)
1. Period (Month 1, Month 2, ...)
2. Opening Balance
3. Interest Earned (green)
4. Withdrawal (red)
5. Closing Balance (bold)

### Calculation Engine
- Compound interest formula
- Monthly rate = Annual / 12
- Interest = Balance × Monthly Rate
- New Balance = Old + Interest - Withdrawal
- Continues until balance depleted or tenure ends

### Fund Depletion Warning
- Shows if fund depletes early
- Amber alert card
- Suggests reducing payment or increasing rate

### User Actions
- Search and select member
- Choose PW option
- Enter investment parameters
- Calculate fund movement
- Review amortization schedule
- Save PW setup

---

## 📈 Screen 8: Reports
**Route**: `/reports`

### Purpose
Generate and export various pension fund reports.

### Key Features
- 4 report type cards
- Report filters
- Report preview (20 records)
- Export to CSV
- Real-time data generation

### Report Types

**1. Member Balances Report**
- All member account balances
- Opening vs Current balance
- Growth calculation
- Filter by status and company
- Columns:
  - Member ID, Name
  - Company, Status
  - Opening Balance
  - Current Balance
  - Growth (green/red)

**2. Beneficiaries Report**
- All members with beneficiaries
- Benefit allocation percentages
- Potential benefit amounts
- Columns:
  - Member Name
  - Beneficiary Name
  - Relationship
  - Benefit Rate (%)
  - Potential Benefit (MWK)

**3. Member Grouping Report**
- Categorize members by:
  - Gender (Male, Female, Other)
  - Status (Active, Dormant, Deceased, Closed)
  - Age (Under 30, 30-40, 41-50, 51-60, Over 60)
- Columns:
  - Category
  - Group
  - Count
  - Percentage

**4. Contributions Report**
- All receipts and contributions
- Filter by date range
- Columns:
  - Reference Number
  - Member Name
  - Date
  - Type
  - Amount
  - Status

### Report Filters
- Date From / Date To (for Contributions)
- Status Filter (for Member Balances)
- Company Filter (for Member Balances)

### User Actions
- Select report type
- Apply filters
- Preview report (first 20 records)
- Export full report to CSV
- Change report type

---

## 🎨 Design System

### Colors
- **Primary**: Blue (#2563eb) - Actions, links
- **Success**: Green (#10b981) - Approved, active, positive
- **Warning**: Yellow (#f59e0b) - Pending, dormant, alerts
- **Danger**: Red (#ef4444) - Rejected, deceased, negative
- **Neutral**: Slate - Text, borders, backgrounds

### Status Badges
- **Active**: Green badge
- **Dormant**: Yellow badge
- **Deceased**: Gray badge
- **Closed**: Red badge
- **Submitted**: Blue badge
- **Approved**: Green badge
- **Rejected**: Red badge
- **Draft**: Slate badge

### Typography
- **Headings**: Bold, 2xl/xl/lg
- **Body**: Regular, sm/base
- **Labels**: Medium, sm
- **Numbers**: Monospace, bold

### Components
- **Cards**: White background, border, shadow
- **Buttons**: Rounded, padding, hover effects
- **Inputs**: Border, focus ring, validation
- **Tables**: Striped rows, hover effects
- **Badges**: Rounded-full, small padding

---

## 📱 Responsive Design

### Desktop (1024px+)
- Full sidebar visible
- Multi-column layouts (2-4 columns)
- Large tables with all columns
- Spacious padding

### Tablet (768px-1023px)
- Collapsible sidebar
- 2-column layouts
- Scrollable tables
- Medium padding

### Mobile (< 768px)
- Hamburger menu
- Single column layouts
- Card-based table view
- Compact padding

---

## 🔐 User Roles

### Admin (Makhumbo Chikaonda)
- Full access to all features
- Can view all screens
- Can perform all actions

### Capturer (Chisomo Banda, Thandiwe Phiri)
- Create records (members, receipts)
- Submit for authorization
- View own submissions
- Cannot approve/reject

### Authorizer (Lawrence Kachuma)
- Review pending items
- Approve/reject with reason
- View all submissions
- Cannot create records

### Read Only (Mphatso Mwale)
- View all screens
- Cannot create/edit
- Cannot authorize
- Export reports only

---

## 🎯 Navigation Flow

```
Dashboard (/)
├── Members (/members)
│   ├── Member List
│   ├── New Member (/members/new)
│   └── Member Ledger (/members/[id])
├── Receipts (/receipts)
├── Payments (/payments) [Coming Soon]
├── Authorization (/authorization)
├── Reports (/reports)
├── PW Setup (/pw-setup)
└── Settings (/settings) [Coming Soon]
```

---

## 📊 Data Flow

```
1. Capturer creates record → Draft
2. Capturer submits → Submitted
3. Authorizer reviews → Audit Trail
4. Authorizer approves/rejects → Approved/Rejected
5. Approved records → Update balances
6. All actions → Audit Log
```

---

## 🎬 Quick Demo Path

1. **Dashboard** - Show KPIs and alerts
2. **Members** - Search and filter
3. **New Member** - 6-step form with beneficiaries
4. **Authorization** - Approve with audit trail
5. **Receipts** - Enter new receipt
6. **Ledger** - View transaction history
7. **PW Setup** - Calculate fund movement
8. **Reports** - Generate and export

**Total Demo Time**: 5-7 minutes

---

**All 8 screens are fully functional and ready for demonstration!** 🚀
