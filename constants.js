import { UserRole } from './types';
export const MOCK_PROJECTS = [
    {
        id: 'p1',
        name: 'Mumbai Sky Tower',
        location: 'Mumbai, India',
        budget: 850000000,
        status: 'In Progress',
        thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400',
        completionDate: '2025-12-15',
        team: [
            { id: 't1', name: 'Rahul Sharma', email: 'rahul@constructai.com', role: UserRole.SITE_MANAGER },
            { id: 't2', name: 'Vikram Singh', email: 'vikram@client.com', role: UserRole.CLIENT }
        ]
    },
    {
        id: 'p2',
        name: 'Shanti Villa',
        location: 'Lonavala, India',
        budget: 45000000,
        status: 'Planning',
        thumbnail: 'https://images.unsplash.com/photo-1600596542815-60002552286b?auto=format&fit=crop&q=80&w=400',
        completionDate: '2024-08-30',
        team: [
            { id: 't3', name: 'Anjali Desai', email: 'anjali@owner.com', role: UserRole.CLIENT }
        ]
    },
    {
        id: 'p3',
        name: 'Pune Industrial & Logistics Park',
        location: 'Pune, India',
        budget: 120000000,
        status: 'Completed',
        thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400',
        completionDate: '2023-11-10',
        team: []
    }
];
export const MOCK_REQUESTS = [
    {
        id: 'r1',
        projectId: 'p1',
        title: 'Kitchen Countertop Change',
        description: 'We want to change the granite color from black to galaxy white as discussed.',
        status: 'Pending',
        date: '2023-10-24'
    },
    {
        id: 'r2',
        projectId: 'p1',
        title: 'Balcony Grill Design',
        description: 'Please use the modern horizontal slat design instead of the floral pattern.',
        status: 'Approved',
        date: '2023-10-20'
    }
];
export const MOCK_WORKERS = [
    { id: '1', name: 'Rajesh Kumar', role: 'Mason', status: 'Present', hourlyRate: 850, efficiency: 92 },
    { id: '2', name: 'Suresh Patil', role: 'Carpenter', status: 'Present', hourlyRate: 900, efficiency: 88 },
    { id: '3', name: 'Amit Singh', role: 'Electrician', status: 'Absent', hourlyRate: 1000, efficiency: 95 },
    { id: '4', name: 'Manoj Tiwari', role: 'Helper', status: 'Present', hourlyRate: 500, efficiency: 80 },
    { id: '5', name: 'Priya Sharma', role: 'Plumber', status: 'Present', hourlyRate: 950, efficiency: 90 },
    { id: '6', name: 'Karan Malhotra', role: 'Mason', status: 'Present', hourlyRate: 850, efficiency: 89 },
    { id: '7', name: 'Vijay Verma', role: 'Helper', status: 'Present', hourlyRate: 500, efficiency: 85 },
    { id: '8', name: 'Deepak Das', role: 'Helper', status: 'Present', hourlyRate: 500, efficiency: 82 },
];
export const MOCK_DAILY_ATTENDANCE = [
    { date: 'Oct 20', Mason: 4, Carpenter: 2, Electrician: 1, Plumber: 1, Helper: 6, totalWorkers: 14 },
    { date: 'Oct 21', Mason: 4, Carpenter: 3, Electrician: 2, Plumber: 1, Helper: 7, totalWorkers: 17 },
    { date: 'Oct 22', Mason: 5, Carpenter: 3, Electrician: 2, Plumber: 2, Helper: 8, totalWorkers: 20 },
    { date: 'Oct 23', Mason: 5, Carpenter: 4, Electrician: 1, Plumber: 2, Helper: 8, totalWorkers: 20 },
    { date: 'Oct 24', Mason: 3, Carpenter: 2, Electrician: 1, Plumber: 1, Helper: 5, totalWorkers: 12 },
    { date: 'Oct 25', Mason: 6, Carpenter: 4, Electrician: 2, Plumber: 2, Helper: 10, totalWorkers: 24 },
    { date: 'Oct 26', Mason: 6, Carpenter: 4, Electrician: 3, Plumber: 2, Helper: 10, totalWorkers: 25 },
];
export const MOCK_MATERIALS = [
    { id: 'm1', name: 'Cement (UltraTech)', category: 'Structural', quantity: 450, unit: 'Bags', minLevel: 100, unitPrice: 380 },
    { id: 'm2', name: 'Steel TMT Bars (Tata)', category: 'Structural', quantity: 2500, unit: 'kg', minLevel: 500, unitPrice: 65 },
    { id: 'm3', name: 'Red Bricks', category: 'Structural', quantity: 15000, unit: 'pcs', minLevel: 2000, unitPrice: 9 },
    { id: 'm4', name: 'River Sand', category: 'Aggregate', quantity: 1200, unit: 'cft', minLevel: 300, unitPrice: 55 },
    { id: 'm5', name: 'Paint (Asian Paints)', category: 'Finishing', quantity: 40, unit: 'L', minLevel: 50, unitPrice: 450 },
];
export const MOCK_STATS = {
    totalBudget: 850000000,
    spent: 420000000,
    progress: 58,
    daysRemaining: 120
};
export const MOCK_TEAM_MESSAGES = [
    {
        id: 'msg1',
        projectId: 'p1',
        senderId: 't1',
        senderName: 'Rahul Sharma',
        senderRole: UserRole.SITE_MANAGER,
        text: 'Materials for the foundation have arrived. Unloading started.',
        timestamp: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: 'msg2',
        projectId: 'p1',
        senderId: 't2',
        senderName: 'Vikram Singh',
        senderRole: UserRole.CLIENT,
        text: 'Great! Please share photos once done.',
        timestamp: new Date(Date.now() - 82800000).toISOString()
    },
    {
        id: 'msg3',
        projectId: 'p1',
        senderId: 'pm1',
        senderName: 'Project Manager',
        senderRole: UserRole.PROJECT_MANAGER,
        text: 'Ensure safety protocols are followed during unloading.',
        timestamp: new Date(Date.now() - 80000000).toISOString()
    }
];
export const MOCK_VENDORS = [
    { id: 'v1', name: 'BuildFast Supplies', category: 'Structural', location: 'Mumbai', phone: '+91 98765 43210', rating: 4.8, isFavorite: true },
    { id: 'v2', name: 'Lonavala Bricks Co', category: 'Structural', location: 'Lonavala', phone: '+91 98765 12345', rating: 4.5, isFavorite: false },
    { id: 'v3', name: 'City Paints & Decor', category: 'Finishing', location: 'Mumbai', phone: '+91 98765 67890', rating: 4.2, isFavorite: false },
    { id: 'v4', name: 'Pune Steel Works', category: 'Structural', location: 'Pune', phone: '+91 98765 99887', rating: 4.6, isFavorite: true },
];
export const MOCK_MATERIAL_REQUESTS = [
    { id: 'mr1', projectId: 'p1', requesterName: 'Amit Engineer', requesterRole: UserRole.SITE_ENGINEER, materialName: 'River Sand', quantity: 200, unit: 'cft', status: 'Pending', date: '2023-10-25' },
    { id: 'mr2', projectId: 'p1', requesterName: 'Amit Engineer', requesterRole: UserRole.SITE_ENGINEER, materialName: 'Cement', quantity: 50, unit: 'Bags', status: 'Approved', date: '2023-10-24' },
];
export const MOCK_SECURITY_ALERTS = [
    {
        id: 'sec1',
        projectId: 'p1',
        severity: 'HIGH',
        type: 'THEFT_RISK',
        title: 'Unusual Night Material Movement',
        description: 'IoT Sensors detected movement of 20 Cement Bags at 2:30 AM. No authorized night shift scheduled.',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        isResolved: false
    },
    {
        id: 'sec2',
        projectId: 'p1',
        severity: 'MEDIUM',
        type: 'INVENTORY_DROP',
        title: 'Sudden Steel Inventory Drop',
        description: 'Steel TMT Bars inventory dropped by 15% in 2 hours without corresponding work log entry.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        isResolved: false
    },
    {
        id: 'sec3',
        projectId: 'p1',
        severity: 'LOW',
        type: 'SUSPICIOUS_ACTIVITY',
        title: 'Suspicious Worker Activity',
        description: 'Worker ID #4 (Manoj Tiwari) logged near storage yard multiple times during break hours.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isResolved: true
    }
];
export const MOCK_DOCUMENTS = [
    {
        id: 'doc1',
        projectId: 'p1',
        title: 'Cement Supply Tender - Phase 1',
        type: 'Material Tender',
        content: 'TENDER FOR SUPPLY OF ORDINARY PORTLAND CEMENT...',
        status: 'Finalized',
        date: '2023-09-15'
    },
    {
        id: 'doc2',
        projectId: 'p1',
        title: 'Electrical Contractor Agreement',
        type: 'Contractor Agreement',
        content: 'THIS AGREEMENT made on this 1st day of October 2023...',
        status: 'Draft',
        date: '2023-10-01'
    }
];
export const MOCK_PERMITS = [
    {
        id: 'prm1',
        projectId: 'p1',
        title: 'VMC Building Permit Application',
        type: 'Building Permit',
        content: 'APPLICATION FOR BUILDING PERMIT \nTo The Commissioner, \nVijayawada Municipal Corporation...',
        status: 'Draft',
        date: '2023-10-26'
    }
];
export const MOCK_DAILY_LOGS = [
    {
        id: 'log1',
        projectId: 'p1',
        date: '2023-10-26',
        author: 'Rahul Sharma',
        role: UserRole.SITE_MANAGER,
        workDescription: 'Completed 2nd floor slab casting. Curing started for ground floor columns. Electrical conduit laying in progress for 1st floor.',
        weather: 'Sunny',
        issues: 'Minor delay in RMC truck arrival (30 mins).',
        status: 'On Track'
    },
    {
        id: 'log2',
        projectId: 'p1',
        date: '2023-10-25',
        author: 'Rahul Sharma',
        role: UserRole.SITE_MANAGER,
        workDescription: 'Shuttering work for 2nd floor slab completed. Reinforcement checking done by site engineer.',
        weather: 'Cloudy',
        issues: 'None',
        status: 'Ahead'
    }
];
export const SAMPLE_PROMPTS = [
    "3BHK independent floor, 1500 sqft, Vastu compliant, east facing entrance",
    "Commercial complex layout with shops on ground floor, 2400 sqft",
    "Duplex house plan with pooja room and open terrace garden"
];
