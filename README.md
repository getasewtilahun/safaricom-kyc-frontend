# KYC Frontend – Safaricom Partners

This is the frontend for the Safaricom Partners KYC system, built with Next.js and React. It is fully integrated with the backend API.

## Features

- Responsive login page with validation
- KYC application form (bank, branch, account, file upload)
- Confirmation and review page (submit/draft)
- Dashboard with navigation sidebar
- Transaction management (create, reverse, view history)
- Real-time form validation and user feedback

## Tech Stack

- Next.js 14
- React 18
- Tailwind CSS

## Setup & Run

1. **Clone the repository**

   ```sh
   git clone <your-frontend-repo-url>
   cd kyc-app
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Configure API URL**

   - By default, the frontend expects the backend to be running at `http://localhost:8080`.
   - If your backend is running elsewhere, edit `app/services/api.ts` and update the `API_BASE_URL`.

4. **Run the app**

   ```sh
   npm run dev
   ```

5. **Usage**
   - Open [http://localhost:3000](http://localhost:3000) in your browser.
   - Login, fill out the KYC form, upload files, and manage transactions.

## Important: Backend Integration

- **The backend must be running** for the frontend to function fully.
- See the backend README for setup instructions.

## Screenshots

_Add UI screenshots here as required by the exam._

## Notes

- All API calls are integrated with the backend.
- Validation errors are user-friendly and follow best UX practices.
- The sidebar and header are consistent across all main pages.
