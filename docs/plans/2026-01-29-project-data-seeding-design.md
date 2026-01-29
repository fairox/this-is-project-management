# design: Project Data Seeding Strategy

## Overview
This document outlines the strategy for seeding the "List of Projects" provided by the user into the Supabase database. The goal is to programmatically insert these projects and their associated details (value, status, location) into the `projects` and `contracts` tables.

## Problem
The user provided a raw list of projects with varying details (Value, Status, Location, etc.) that need to be "strategically" implemented. The current database schema splits this information across `projects` (basic info) and `contracts` (financials). There is no direct "location" or "type" column on the `projects` table in the current minimal schema, or they might be missing.

## Analysis of User Data
The data provided follows this pattern:
`[Name] - [Location] - [Type] - [Status/Stage] - [Value Estimations]`

**Examples:**
- `Artisan - Thetsane, Lesotho - Commercial - Completed Contract Value M 400 000`
- `Liberty Stanlib - New Europa, Lesotho - Commercial - Unbuilt - Covid - Estimate value M 200 500 000`

**Key Fields to Extract:**
1.  **Name**: "Artisan", "Villa Besetsa", etc.
2.  **Location**: "Thetsane, Lesotho", "Masowe 3, Lesotho" (No dedicated column in `projects` schema detected yet, might need to go into description or new column).
3.  **Type**: "Commercial", "Residential" (No dedicated column).
4.  **Status**: "Completed", "Unbuilt", "Design Development".
5.  **Value**: "M 400 000", "M 200 500 000".

## Schema Mapping Strategy

### 1. `projects` Table
| User Field | Database Column | Notes |
| :--- | :--- | :--- |
| Name | `name` | Direct mapping. |
| Status | `status` | Map "Completed" -> 'completed', "Unbuilt"/"Design" -> 'active' (or 'on-hold'). |
| Description | `description` | **Strategy**: Combine Location, Type, and specific status details here (e.g., "Commercial project in Thetsane. Stage: Completed"). |
| Created At | `created_at` | Auto-generated. |

### 2. `contracts` Table
We will create a dummy "Main Contract" for each project to store specific financial values.
| User Field | Database Column | Notes |
| :--- | :--- | :--- |
| Value | `accepted_contract_amount` | Parse "M 400 000" to integer 400000. |
| Name | `title` | "Main Contract - [Project Name]" |
| Completion | `completion_date` | Set if status is "Completed". |

## Implementation Approach: Client-Side Seeder
Running a standalone Node script is difficult because the project uses Vite's `import.meta.env` for Supabase keys.

**Proposed Solution:**
Create a temporary React component or utility function `src/utils/seedProjects.ts` that can be invoked from the browser console or a temporary button in the UI.

### Logic Flow
1.  **Parse Data**: Create an array of objects representing the raw user data.
2.  **Iterate**: Loop through each item.
3.  **Insert Project**: Call `supabase.from('projects').insert(...)`.
4.  **Get ID**: improved with `.select().single()`.
5.  **Insert Contract**: Call `supabase.from('contracts').insert(...)` using the returned Project ID.
6.  **Log Results**: Output success/failure to console.

## Detailed Data Parsings
- "M 400 000" -> `400000`
- "M 2 500 000" -> `2500000`
- "M 200 500 000" -> `200500000`
- "M 500 000 000" -> `500000000` (Qalo Wellness Resort - Huge value, double check)
- "M 4 000 000 000" -> `4000000000` (Lerotholi Master Plan - Huge value)

## Next Steps
1.  Create `src/utils/seedProjects.ts`.
2.  Create a temporary UI trigger (e.g., a button in `App.tsx` or a hidden route).
3.  Run the seeder.
4.  Verify data in Dashboard.
5.  Delete seeder code.
