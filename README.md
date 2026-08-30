# AIrchitect

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbab1904%2Fairchitect)

An AI-powered architectural project management and collaboration platform designed to streamline construction workflows, enhance team coordination, and optimize project planning.

## Features

- **AI Assistant**: Intelligent chatbot powered by Gemini API for project queries and guidance
- **Project Management**: Create, explore, and manage architectural projects efficiently
- **Floor Plan Generator**: AI-assisted floor plan creation and visualization
- **Team Collaboration**: Real-time team chat and project communication
- **Workforce Management**: Track and manage construction workforce allocation
- **Cost Estimation**: Automated cost and budget planning with AI insights
- **Bill of Quantities (BOQ) Optimizer**: Generate and optimize project BOQs
- **Schedule Automation**: AI-powered project scheduling and timeline management
- **Materials Management**: Track materials and resource allocation
- **Permit & Compliance Management**: Streamline permit applications and code compliance checks
- **Contract Management**: Manage project contracts and agreements
- **Client Requests**: Handle and track client requirements
- **Role-Based Access**: Multi-user support with role-based authentication

## Tech Stack

- **Frontend Framework**: React (TypeScript)
- **UI Components**: Custom React components
- **AI Integration**: Google Gemini API
- **Authentication**: Custom authentication service
- **State Management**: React hooks
- **Styling**: CSS/SCSS

## Project Structure

```
AIrchitect/
├── components/
│   ├── AIAssistant.tsx           # AI-powered assistant interface
│   ├── Dashboard.tsx              # Main dashboard view
│   ├── ProjectExplorer.tsx        # Project navigation and exploration
│   ├── ProjectList.tsx            # List view of projects
│   ├── TeamManagement.tsx         # Team collaboration features
│   ├── TeamChatWidget.tsx         # Real-time team chat
│   ├── FloorPlanGenerator.tsx     # AI floor plan creation
│   ├── BOQOptimizer.tsx           # Bill of Quantities management
│   ├── CostEstimator.tsx          # Cost estimation tools
│   ├── AutoSchedule.tsx           # Automated scheduling
│   ├── Materials.tsx              # Materials management
│   ├── Permits.tsx                # Permit management
│   ├── CodeCompliance.tsx         # Compliance checking
│   ├── Contracts.tsx              # Contract management
│   ├── ClientRequest.tsx          # Client request tracking
│   ├── Workforce.tsx              # Workforce management
│   ├── Worklog.tsx                # Work activity logging
│   ├── RoleSelection.tsx          # User role selection
│   ├── Auth.tsx                   # Authentication interface
│   ├── Layout.tsx                 # Main layout wrapper
│   └── NewProjectWizard.tsx       # Project creation wizard
├── services/
│   ├── authServices.ts            # Authentication logic
│   └── geminiServices.ts          # Gemini API integration
├── App.tsx                        # Main application component
├── index.tsx                      # React entry point
├── index.html                     # HTML template
├── types.ts                       # TypeScript type definitions
├── constants.ts                   # Application constants
└── metadata.json                  # Project metadata
```

## Installation

### Prerequisites
- Node.js 14+ and npm/yarn
- Google Gemini API key

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AIrchitect
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   ```

## Usage

### Getting Started

1. **Launch the Application**: Open your browser and navigate to `http://localhost:3000`
2. **Authentication**: Select your role (Architect, Contractor, Client, etc.) and authenticate
3. **Create a Project**: Use the New Project Wizard to start a new architectural project
4. **Explore Features**: Navigate through the dashboard to access different tools and features

### Key Workflows

#### Creating a Project
- Navigate to "New Project"
- Fill in project details using the wizard
- Select team members and assign roles
- Start planning with AI assistance

#### Generating Floor Plans
- Open the Floor Plan Generator
- Provide specifications and requirements
- Let AI generate initial designs
- Edit and refine as needed

#### Managing Teams
- Access Team Management from the dashboard
- Add team members and assign roles
- Use Team Chat for real-time communication
- Monitor workforce allocation

#### Cost Estimation
- Use Cost Estimator for budget planning
- Generate BOQ with BOQ Optimizer
- Track expenses and manage budgets
- Get AI-powered cost insights

## API Integration

### Gemini API
The application integrates with Google's Gemini API for AI-powered features including:
- Project recommendations
- Design suggestions
- Cost analysis
- Schedule optimization
- Compliance checking

Ensure your API key is properly configured in environment variables.

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please create an issue in the repository or contact the development team.

## Roadmap

- [ ] Advanced 3D floor plan visualization
- [ ] Machine learning-based cost prediction
- [ ] Mobile app support
- [ ] Integration with CAD software
- [ ] Real-time project tracking with IoT sensors
- [ ] Advanced analytics and reporting

---

**Built with ❤️ for the construction and architecture industry**
