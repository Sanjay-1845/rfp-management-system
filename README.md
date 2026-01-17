# RFP Management System

An AI-powered Request for Proposal (RFP) management system that automates the creation, sending, and comparison of RFPs with vendor proposals.

## Features

- **Create RFPs**: Generate structured RFPs from natural language text using AI
- **Vendor Management**: Add, edit, and manage vendor contacts
- **Send RFPs**: Email RFPs to selected vendors via SendGrid
- **Proposal Parsing**: AI-powered extraction of pricing, delivery, warranty from vendor responses
- **Proposal Comparison**: Compare vendor proposals with AI-generated recommendations

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB (Mongoose ODM)
- OpenAI API for AI-powered features
- SendGrid for email delivery

### Frontend
- React 19
- React Router
- Axios for API calls
- Lucide React for icons

## Prerequisites

- Node.js (v18 or higher)
- MongoDB database (local or MongoDB Atlas)
- OpenAI API key
- SendGrid API key (optional, for email features)

## Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/Sanjay-1845/rfp-management-system.git
cd rfp-management-system
```

### 2. Backend Setup

```bash
# Install backend dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=4000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/rfp_system
OPENAI_API_KEY=your_openai_api_key
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sender@email.com
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd rfp-ui

# Install frontend dependencies
npm install
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
# From project root
npm run dev
```
Backend runs at: http://localhost:4000

**Terminal 2 - Frontend:**
```bash
# From rfp-ui directory
cd rfp-ui
npm start
```
Frontend runs at: http://localhost:3000

### Production Mode

**Backend:**
```bash
npm start
```

**Frontend:**
```bash
cd rfp-ui
npm run build
```

## API Endpoints

### RFPs
- `GET /api/rfps` - Get all RFPs
- `POST /api/rfps` - Create RFP
- `POST /api/rfps/from-text` - Create RFP from natural language
- `POST /api/rfps/:rfpId/send` - Send RFP to vendors
- `GET /api/rfps/:rfpId/comparison` - Get proposal comparison

### Vendors
- `GET /api/vendors` - Get all vendors
- `POST /api/vendors` - Create vendor
- `PUT /api/vendors/:vendorId` - Update vendor
- `DELETE /api/vendors/:vendorId` - Delete vendor

### Proposals
- `GET /api/proposals/rfps-with-proposals` - Get RFPs that have proposals
- `GET /api/proposals/rfp/:rfpId` - Get proposals for an RFP

### Webhooks
- `POST /webhooks/sendgrid/inbound` - Handle inbound email (vendor responses)

## Project Structure

```
rfp-management-system/
├── src/
│   ├── app.js              # Express app entry point
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── controllers/
│   │   ├── rfp.controller.js
│   │   ├── vendor.controller.js
│   │   ├── proposol.controller.js
│   │   └── inboundEmail.controller.js
│   ├── models/
│   │   ├── RFP.js
│   │   ├── Vendor.js
│   │   └── Proposal.js
│   ├── routes/
│   │   ├── rfp.routes.js
│   │   ├── vendor.routes.js
│   │   ├── proposal.routes.js
│   │   └── webhooks.routes.js
│   ├── services/
│   │   ├── ai.service.js
│   │   └── email.service.js
│   └── prompt/             # AI prompt templates
├── rfp-ui/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── public/
├── .env.example
└── package.json
```

## Testing Mock Vendor Responses

The application includes a Mock Vendor Response page to simulate vendor email responses for testing:

1. Navigate to "Mock Vendor Response" in the sidebar
2. Select an RFP and vendor
3. Generate or write a sample proposal
4. Submit to test the AI proposal parsing

## License

ISC
