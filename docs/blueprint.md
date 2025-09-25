# **App Name**: FactureTrack

## Core Features:

- User Authentication: Secure login with role-based access (Commande Publique, Services, Finances) via dropdown and password authentication.
- Dashboard: Role-specific dashboard displaying key metrics (total invoices, amounts by type, rejections) and quick actions.
- Invoice Management: Display invoice details (file name, date, type, amount, service, reference, status, due date) with filtering and sorting options. Provides a button to refresh data.
- Invoice Workflow: Enable each role (Commande Publique, Services, Finances) to approve, reject, and add comments to invoices, updating status in real-time.
- PDF Integration: Directly open PDF invoices (stored on the specified server path) with Foxit Reader, allowing modification and saving back to the server.
- History & Audit: Detailed invoice history with filtering (name, service, type, amount, status) and the ability to revert status (Finances) or mark as 'Processed'.
- Service Management: Admin panel for managing service accounts (name, designation, password) with add, modify, and delete functions (Finances only).

## Style Guidelines:

- Primary color: Dark purple (#624CAB) for a modern and sophisticated feel.
- Background color: Very dark grey (#212121) to create a modern dark theme.
- Accent color: Teal (#4DB6AC) to highlight interactive elements.
- Body text and headline font: 'Inter', a sans-serif, should be used.
- Consistent use of flat, line-based icons for actions and status indicators.
- Responsive layout with a left sidebar (collapsible), top-right user menu, and full-screen toggle. Prioritize data density and filtering options.
- Subtle transitions and animations to provide feedback on interactions (approvals, rejections, comments).