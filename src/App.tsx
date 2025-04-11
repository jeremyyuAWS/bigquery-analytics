import React, { useState, useRef, useEffect, Suspense } from 'react';
import { 
  BarChart3, 
  MessageSquare, 
  PieChart, 
  DollarSign, 
  AlertCircle, 
  TrendingUp,
  Search,
  Calendar,
  User,
  HelpCircle,
  Settings,
  Bell,
  Filter,
  ChevronDown,
  Activity,
  RefreshCw,
  Terminal,
  ClipboardList,
  Download,
  Check,
  X,
  Clock,
  ExternalLink,
  Loader,
  Info,
  LifeBuoy,
  BarChart,
  Database,
  ChevronRight,
  Smartphone,
  Layers
} from 'lucide-react';
import { 
  AreaChart, Area, 
  LineChart, Line, 
  BarChart as ReBarChart, Bar, 
  PieChart as RePieChart, Pie, Cell, 
  ResponsiveContainer, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  Scatter, ScatterChart
} from 'recharts';
import { format, subDays, addDays, startOfMonth, endOfMonth } from 'date-fns';
import HeatMap from 'react-heatmap-grid';

// Add type declaration at the top of the file
declare module 'react-heatmap-grid';

interface HeatmapData {
  data: number[][];
  xLabels: string[];
  yLabels: string[];
}

// Error Boundary Component
class ErrorBoundaryComponent extends React.Component<
  { children: React.ReactNode, fallback?: React.ReactNode },
  { hasError: boolean, error: Error | null }
> {
  constructor(props: { children: React.ReactNode, fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    // Here you would log the error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md mt-10">
          <div className="flex items-center mb-4 text-red-500">
            <AlertCircle className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-bold">Something went wrong</h2>
          </div>
          <p className="text-gray-600 mb-4">
            We apologize for the inconvenience. Please try refreshing the page or contact support if the issue persists.
          </p>
          <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-500 font-mono overflow-auto">
            {this.state.error?.message || "Unknown error"}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full min-h-[200px]">
    <div className="flex flex-col items-center">
      <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
      <p className="mt-2 text-gray-500">Loading data...</p>
    </div>
  </div>
);

// Generate dates for the past 30 days
const generateDateRange = (days: number) => {
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    dates.push(format(subDays(new Date(), i), 'MMM dd'));
  }
  return dates;
};

// Synthetic data generation functions
const generateSyntheticData = () => {
  // Daily spend data for the last 30 days with trends
  const dateRange = generateDateRange(30);
  const dailySpendData = dateRange.map((date, index) => {
    // Create a gradual increase and then decrease with some randomness
    let baseValue = 250;
    if (index < 10) {
      baseValue += index * 15; // Gradual increase
    } else if (index < 20) {
      baseValue += 150 - (index - 10) * 5; // Plateau
    } else {
      baseValue += 100 - (index - 20) * 10; // Decrease
    }
    
    // Add weekly patterns - weekends have less spend
    const dayNum = index % 7;
    if (dayNum === 5 || dayNum === 6) {
      baseValue *= 0.7; // 30% less spend on weekends
    }
    
    // Add some randomness
    const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    const spend = Math.round(baseValue * randomFactor);
    
    return {
      date,
      spend,
      budget: 300, // Daily budget line
    };
  });

  // Project-specific spending
  const projectSpendData = [
    { name: 'Marketing Analytics', spend: 1452.78 },
    { name: 'Customer Data', spend: 987.34 },
    { name: 'Sales Pipeline', spend: 856.92 },
    { name: 'Product Analytics', spend: 645.21 },
    { name: 'Operations', spend: 314.53 }
  ];

  // Department spend vs ROI data
  const departmentRoiData = [
    { department: 'Marketing', spend: 1856.23, roi: 87 },
    { department: 'Sales', spend: 1234.56, roi: 82 },
    { department: 'Customer Success', spend: 978.45, roi: 76 },
    { department: 'Operations', spend: 856.34, roi: 74 },
    { department: 'Analytics', spend: 1532.67, roi: 58 }
  ];

  // Query execution time heatmap data
  const generateHeatmapData = (): HeatmapData => {
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Create a 2D array for the heatmap data
    const data = days.map(day => 
      hours.map(hour => {
        // Create wave patterns throughout the day
        const hourNum = parseInt(hour);
        const timeOfDay = Math.sin((hourNum / 24) * Math.PI * 2) * 50 + 50;
        
        // Add weekly patterns
        const weekdayFactor = day === 'Sat' || day === 'Sun' ? 0.3 : 1;
        
        // Add some randomness
        const noise = Math.random() * 30;
        
        // Combine factors
        let baseValue = 0;
        if (hourNum >= 9 && hourNum <= 17 && day !== 'Sat' && day !== 'Sun') {
          baseValue = (timeOfDay + noise) * weekdayFactor * 1.5;
        } else if (hourNum >= 7 && hourNum <= 19) {
          baseValue = (timeOfDay + noise) * weekdayFactor;
        } else {
          baseValue = (timeOfDay + noise) * weekdayFactor * 0.5;
        }
        
        return Math.round(Math.max(0, Math.min(100, baseValue)));
      })
    );

    return {
      data,
      xLabels: hours,
      yLabels: days
    };
  };
  
  const queryHeatmapData = generateHeatmapData();

  // Monthly spend trend with forecast
  const generateMonthlySpendData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    return months.map((month, index) => {
      // Set a baseline with seasonal trend
      let baseValue = 4000;
      // Add seasonality - Q4 higher spend
      if (index >= 9) {
        baseValue += 1000;
      }
      // Q1 lower spend
      if (index <= 2) {
        baseValue -= 500;
      }
      
      // Actual vs forecast
      const isActual = index <= currentMonth;
      const randomFactor = 0.9 + Math.random() * 0.3; // 0.9 to 1.2
      
      // Add some month-to-month variation
      const spend = Math.round(baseValue * randomFactor);
      
      return {
        month,
        spend: isActual ? spend : null,
        forecast: !isActual ? spend : null,
        budget: 5000
      };
    });
  };
  
  const monthlySpendData = generateMonthlySpendData();

  // ROI distribution for pie chart
  const roiDistributionData = [
    { name: 'High ROI', value: 42, color: '#4ade80' },
    { name: 'Medium ROI', value: 35, color: '#facc15' },
    { name: 'Low ROI', value: 23, color: '#f87171' }
  ];

  // Query optimization opportunities data
  const optimizationData = [
    { 
      id: 1,
      name: "Add partitioning to customer_events table",
      impact: "high",
      savingsPercentage: 85,
      monthlySavings: 420.56,
      complexity: "medium",
      description: "This table is queried frequently and contains 2.3TB of data. Adding date-based partitioning could reduce query costs by up to 85%."
    },
    { 
      id: 2,
      name: "Optimize daily_user_activity query",
      impact: "high",
      savingsPercentage: 72,
      monthlySavings: 320.45,
      complexity: "high",
      description: "This query uses a cross join without proper filtering, scanning 845GB daily. Restructuring could save approximately $320/month."
    },
    { 
      id: 3,
      name: "Implement caching for product_inventory query",
      impact: "medium",
      savingsPercentage: 56,
      monthlySavings: 215.78,
      complexity: "low",
      description: "This query runs every 15 minutes but data changes infrequently. Implementing results caching could reduce execution frequency by 75%."
    },
    { 
      id: 4,
      name: "Add clustering to marketing_events table",
      impact: "medium",
      savingsPercentage: 42,
      monthlySavings: 156.23,
      complexity: "medium",
      description: "Adding clustering by campaign_id and event_type would improve query performance and reduce costs for this 1.5TB table."
    },
    { 
      id: 5,
      name: "Reduce report_generation job frequency",
      impact: "low",
      savingsPercentage: 25,
      monthlySavings: 132.65,
      complexity: "low",
      description: "This automated report runs hourly but could be reduced to every 4 hours with minimal business impact."
    }
  ];

  // Query performance over time
  const generateQueryPerformanceData = () => {
    const dateRange = generateDateRange(14); // Last 14 days
    
    return dateRange.map((date, index) => {
      // Create a decreasing trend (optimization improvements)
      const baselineExecutionTime = 100 - index * 3.5;
      const randomFactor = 0.9 + Math.random() * 0.2;
      
      return {
        date,
        executionTime: Math.max(Math.round(baselineExecutionTime * randomFactor), 50),
        dataScanned: Math.round((800 - index * 25) * randomFactor)
      };
    });
  };
  
  const queryPerformanceData = generateQueryPerformanceData();

  // Low ROI queries data
  const lowRoiQueriesData = [
    {
      id: 1,
      name: "Historical User Sessions",
      department: "Analytics",
      monthlyCost: 578.92,
      purpose: null,
      executionFrequency: "Daily",
      lastExecuted: "8 hours ago"
    },
    {
      id: 2,
      name: "Legacy Product Metrics",
      department: "Product",
      monthlyCost: 324.56,
      purpose: "Monitoring discontinued features",
      executionFrequency: "Hourly",
      lastExecuted: "2 hours ago"
    },
    {
      id: 3,
      name: "Archived Campaign Analysis",
      department: "Marketing",
      monthlyCost: 289.45,
      purpose: null,
      executionFrequency: "Weekly",
      lastExecuted: "3 days ago"
    },
    {
      id: 4,
      name: "Development Environment Logs",
      department: "Engineering",
      monthlyCost: 245.78,
      purpose: "Debug logs retention",
      executionFrequency: "Continuous",
      lastExecuted: "23 minutes ago"
    }
  ];

  return {
    dailySpendData,
    projectSpendData,
    departmentRoiData,
    queryHeatmapData,
    monthlySpendData,
    roiDistributionData,
    optimizationData,
    queryPerformanceData,
    lowRoiQueriesData
  };
};

// Generate synthetic data
const syntheticData = generateSyntheticData();

// Mock data for the dashboard
const mockTopQueries = [
  { id: 1, name: "User Activity Analytics", cost: 124.56, roi: "low", department: "Marketing" },
  { id: 2, name: "Daily Sales Pipeline", cost: 89.34, roi: "high", department: "Sales" },
  { id: 3, name: "Inventory Reconciliation", cost: 215.78, roi: "medium", department: "Operations" },
  { id: 4, name: "Customer Churn Analysis", cost: 154.23, roi: "high", department: "Customer Success" },
  { id: 5, name: "Campaign Performance", cost: 178.92, roi: "medium", department: "Marketing" },
];

// Initial chat messages
const initialChatHistory = [
  { 
    role: "user", 
    message: "How much did I spend on BigQuery yesterday?"
  },
  { 
    role: "assistant", 
    message: "Your BigQuery spend for yesterday was $324.56, which is 12% higher than your daily average of $289.78."
  },
  { 
    role: "user", 
    message: "What are my top 5 costliest queries this month?"
  },
  { 
    role: "assistant", 
    message: "Here are your top 5 costliest queries for this month:\n\n1. \"Customer Behavior Analytics\" - $215.78\n2. \"Product Inventory Reconciliation\" - $178.92\n3. \"Marketing Campaign Attribution\" - $154.23\n4. \"Daily User Activity Report\" - $124.56\n5. \"Sales Pipeline Forecast\" - $89.34"
  }
];

// Suggested questions for the chat interface
const suggestedQuestions = [
  "How much did I spend on BigQuery today?",
  "What are my optimization opportunities?",
  "Show me my ROI breakdown by department",
  "Identify my longest-running queries",
  "What's my monthly spend projection?",
  "Which tables should I partition?",
  "Where can I save the most money?",
  "Compare this month's spend to last month"
];

// Mock response generator based on user input
const generateMockResponse = (question: string) => {
  // Convert to lowercase for easier matching
  const lowerQuestion = question.toLowerCase();
  
  // Today's spend question
  if (lowerQuestion.includes("spend") && lowerQuestion.includes("today")) {
    return `Your BigQuery spend so far today is $186.34 (as of ${new Date().toLocaleTimeString()}).

Current status:
- Tracking 8% below daily average
- 62% of daily budget consumed
- 15 active project workloads

Recent cost spikes:
- Marketing campaign analysis (+$45.23 at 10:30 AM)
- Product analytics batch job (+$32.45 at 1:15 PM)

⚠️ Alert: The Marketing campaign analysis query is using a cross join that could be optimized to reduce costs by ~35%.

Would you like me to show you the suggested query improvements?`;
  }
  
  // Optimization opportunities
  if (lowerQuestion.includes("optimization") || (lowerQuestion.includes("what") && lowerQuestion.includes("opportunities"))) {
    return `I've identified several optimization opportunities that could save you $1,245.67/month:

1. 🔴 High Impact: Add partitioning to customer_events table
   - Current cost: $420.56/month
   - Potential savings: 85%
   - Implementation: Medium complexity
   - Table size: 2.3TB
   
2. 🔴 High Impact: Optimize daily_user_activity query
   - Current cost: $320.45/month
   - Potential savings: 72%
   - Implementation: High complexity
   - Issue: Inefficient cross join
   
3. 🟡 Medium Impact: Implement caching for product_inventory
   - Current cost: $215.78/month
   - Potential savings: 56%
   - Implementation: Low complexity
   - Quick win opportunity

4. 🟡 Medium Impact: Add clustering to marketing_events
   - Current cost: $156.23/month
   - Potential savings: 42%
   - Implementation: Medium complexity
   - Table size: 1.5TB

Would you like me to:
1. Show detailed implementation steps for any opportunity?
2. Generate the optimization SQL?
3. Create an implementation timeline?`;
  }
  
  // ROI breakdown by department
  if (lowerQuestion.includes("roi") && lowerQuestion.includes("department")) {
    return `Here's your ROI breakdown by department:

1. Marketing: 87/100 ⭐
   - Monthly spend: $1,856.23
   - Direct revenue impact: $12,450
   - Key queries: Campaign Attribution, Customer Segmentation
   - Optimization score: 92%

2. Sales: 82/100 ⭐
   - Monthly spend: $1,234.56
   - Pipeline contribution: $8,760
   - Key queries: Lead Scoring, Deal Analytics
   - Optimization score: 88%

3. Customer Success: 76/100 📈
   - Monthly spend: $978.45
   - Retention impact: $5,890
   - Key queries: Churn Prediction, Usage Analytics
   - Optimization score: 81%

4. Operations: 74/100 📈
   - Monthly spend: $856.34
   - Cost savings: $4,320
   - Key queries: Inventory Management, Supply Chain
   - Optimization score: 79%

5. Analytics: 58/100 ⚠️
   - Monthly spend: $1,532.67
   - Undefined value: Several queries
   - Key queries: Historical Analysis, Data Exports
   - Optimization score: 62%

Recommendations:
1. Document business impact for Analytics queries
2. Implement result caching for reports
3. Archive unused historical data

Would you like a detailed plan for improving any department's ROI score?`;
  }
  
  // Longest-running queries
  if (lowerQuestion.includes("longest") && lowerQuestion.includes("queries")) {
    return `Here are your longest-running queries:

1. "Historical User Behavior Analysis"
   ⏱️ Avg. runtime: 45 minutes
   💾 Data scanned: 2.1TB
   📊 Department: Analytics
   ⚠️ Issue: No partitioning on date range
   
2. "Monthly Customer Segmentation"
   ⏱️ Avg. runtime: 38 minutes
   💾 Data scanned: 1.8TB
   📊 Department: Marketing
   ⚠️ Issue: Inefficient JOIN operations
   
3. "Product Usage Trends"
   ⏱️ Avg. runtime: 32 minutes
   💾 Data scanned: 1.5TB
   📊 Department: Product
   ⚠️ Issue: Multiple self-joins
   
4. "Revenue Attribution Model"
   ⏱️ Avg. runtime: 28 minutes
   💾 Data scanned: 1.2TB
   📊 Department: Sales
   ⚠️ Issue: Complex window functions
   
5. "Customer Churn Prediction"
   ⏱️ Avg. runtime: 25 minutes
   💾 Data scanned: 950GB
   📊 Department: Customer Success
   ⚠️ Issue: Unoptimized subqueries

Optimization recommendations:
1. Add date-based partitioning to main tables
2. Implement query result caching
3. Break down complex queries into smaller steps
4. Use materialized views for common computations

Would you like to see the optimization plan for any of these queries?`;
  }
  
  // Monthly spend projection
  if (lowerQuestion.includes("monthly") && lowerQuestion.includes("projection")) {
    return `Based on current trends, here's your monthly spend projection:

Current Month (November):
- Actual spend to date: $4,256.78
- Projected total: $5,890.45
- Budget: $6,000.00
- Status: On track (2% under budget)

Trend Analysis:
- October: $5,123.67
- September: $4,892.45
- August: $4,588.32
- 3-month trend: +8.4%

Key Drivers:
1. Marketing campaigns (+15% MoM)
   - Black Friday campaign planning
   - New product launch analytics
   
2. Sales analytics (+12% MoM)
   - Enhanced lead scoring models
   - Real-time pipeline analytics
   
3. Product telemetry (+5% MoM)
   - New feature tracking
   - User behavior analysis

Cost Control Measures:
1. Implement query caching: -$215/month
2. Optimize large tables: -$420/month
3. Adjust refresh frequencies: -$180/month

Would you like to:
1. See detailed cost breakdown?
2. View optimization recommendations?
3. Adjust budget allocations?`;
  }
  
  // Tables to partition
  if (lowerQuestion.includes("tables") && lowerQuestion.includes("partition")) {
    return `Here are the top tables that would benefit from partitioning:

1. customer_events (2.3TB)
   - Current monthly cost: $420.56
   - Potential savings: 85%
   - Recommended partition: DATE(event_timestamp)
   - Partition expiration: 90 days
   - Priority: HIGH ⚠️

2. marketing_events (1.5TB)
   - Current monthly cost: $285.34
   - Potential savings: 75%
   - Recommended partition: DATE(campaign_date)
   - Partition expiration: 180 days
   - Priority: HIGH ⚠️

3. product_analytics (980GB)
   - Current monthly cost: $178.92
   - Potential savings: 65%
   - Recommended partition: DATE(usage_date)
   - Partition expiration: 60 days
   - Priority: MEDIUM

4. user_sessions (750GB)
   - Current monthly cost: $156.78
   - Potential savings: 60%
   - Recommended partition: DATE(session_start)
   - Partition expiration: 30 days
   - Priority: MEDIUM

Implementation SQL for customer_events:
\`\`\`sql
ALTER TABLE customer_events
SET OPTIONS (
  partition_by = DATE(event_timestamp),
  partition_expiration_days = 90
)
\`\`\`

Would you like me to:
1. Generate partition SQL for other tables?
2. Show implementation timeline?
3. Estimate cost savings impact?`;
  }
  
  // Where to save the most money
  if (lowerQuestion.includes("save") && lowerQuestion.includes("money")) {
    return `I've identified several cost-saving opportunities totaling $1,575/month:

1. Table Partitioning: $875/month savings
   - customer_events: $420 savings
   - marketing_events: $285 savings
   - product_analytics: $170 savings
   Implementation time: 2-3 hours
   Risk level: Low

2. Query Optimization: $535/month savings
   - Fix cross joins: $320 savings
   - Add proper filters: $215 savings
   Implementation time: 4-6 hours
   Risk level: Medium

3. Caching Strategy: $165/month savings
   - Report queries: $95 savings
   - Dashboard queries: $70 savings
   Implementation time: 1-2 hours
   Risk level: Low

Priority order:
1. Implement caching (Quick win)
2. Add table partitioning (Best ROI)
3. Optimize queries (Requires testing)

Would you like me to:
1. Generate implementation SQL?
2. Create a rollout schedule?
3. Show detailed cost analysis?`;
  }
  
  // Compare this month's spend to last month
  if (lowerQuestion.includes("compare") && lowerQuestion.includes("month")) {
    return `Here's your month-over-month spend comparison:

Current Month (November):
$4,256.78 spent to date
- 12% under budget
- 15 days remaining
- Projected: $5,890.45

vs. Last Month (October): $5,123.67
📉 17% decrease in spend

Key Changes:
1. Query Optimizations
   - Implemented partitioning: -$420
   - Query caching: -$215
   - Total savings: $635

2. Department Changes
   Marketing: $1,856 → $1,542 (↓17%)
   - Optimized campaign analytics
   - Implemented result caching
   
   Sales: $1,234 → $1,156 (↓6%)
   - Reduced redundant queries
   - Better data filtering
   
   Analytics: $1,532 → $1,245 (↓19%)
   - Archived old reports
   - Optimized refresh schedules

3. Performance Improvements
   - Avg query runtime: 45s → 32s
   - Data scanned: -28%
   - Cache hit rate: 65% (↑15%)

Would you like to:
1. See detailed cost breakdown?
2. View trending analysis?
3. Get more optimization suggestions?`;
  }
  
  // Default response for other questions
  return `I understand you're asking about "${question}". To provide the most accurate information, could you specify:

1. The time period you're interested in?
2. Any specific projects or departments?
3. Whether you want cost, performance, or ROI metrics?

I can help you with:
- Cost analysis and optimization
- Query performance improvements
- ROI tracking and enhancement
- Best practices implementation

Just let me know what specific aspect you'd like to explore!`;
};


// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: "alert",
    title: "Cost Threshold Exceeded",
    message: "Your BigQuery spend has exceeded the daily threshold of $300. Current spend: $324.56.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    read: false,
    priority: "high"
  },
  {
    id: 2,
    type: "warning",
    title: "Long-Running Query Detected",
    message: "\"Product Inventory Analysis\" query has been running for over 45 minutes.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    priority: "medium"
  },
  {
    id: 3,
    type: "optimization",
    title: "Optimization Opportunity",
    message: "Adding partitioning to \"user_events\" table could reduce costs by 45%.",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    read: false,
    priority: "medium"
  },
  {
    id: 4,
    type: "alert",
    title: "Unusual Query Pattern",
    message: "Anomaly detected: 3x increase in Marketing department queries in the last hour.",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    read: false,
    priority: "high"
  },
  {
    id: 5,
    type: "info",
    title: "Weekly Report Available",
    message: "Your BigQuery usage summary for last week is now available.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    priority: "low"
  }
];

// Welcome features for the modal
const welcomeFeatures = [
  {
    title: "Real-time Cost Monitoring",
    description: "Track your BigQuery spending in real-time and get alerts when you approach budget thresholds.",
    icon: <DollarSign className="h-6 w-6 text-indigo-600" />
  },
  {
    title: "Query Optimization",
    description: "Get AI-powered suggestions to optimize your most expensive queries and reduce costs.",
    icon: <Database className="h-6 w-6 text-indigo-600" />
  },
  {
    title: "ROI Analysis",
    description: "Understand the business value of your data investments with detailed ROI metrics.",
    icon: <BarChart className="h-6 w-6 text-indigo-600" />
  },
  {
    title: "AI Assistant",
    description: "Chat with your data governance assistant to get answers about your BigQuery usage.",
    icon: <MessageSquare className="h-6 w-6 text-indigo-600" />
  }
];

const roiLevelTag = (roi: string) => {
  if (roi === "high") return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">🟢 High ROI</span>;
  if (roi === "medium") return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">🟡 Medium ROI</span>;
  return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">🔴 Low ROI</span>;
};

// Format relative time
const formatRelativeTime = (timestamp: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
};

// Custom tooltip for recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium text-gray-700">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {entry.name}: ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

// Format money values
const formatMoney = (value: number) => {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Colors for charts
const COLORS = ['#4f46e5', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6'];
const ROI_COLORS = ['#4ade80', '#facc15', '#f87171'];

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState(initialChatHistory);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);
  const [currentWelcomeStep, setCurrentWelcomeStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeOptimization, setActiveOptimization] = useState<number>(1);
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");
  const notificationRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const welcomeModalRef = useRef<HTMLDivElement>(null);
  
  // Check if this is the first visit and show welcome modal
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
      setWelcomeModalOpen(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    }
    
    // Simulate data loading
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  }, []);
  
  // Handle welcome modal outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (welcomeModalRef.current && !welcomeModalRef.current.contains(event.target as Node)) {
        setWelcomeModalOpen(false);
      }
    }
    
    if (welcomeModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [welcomeModalOpen]);
  
  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);
  
  // Function to send a chat message
  const sendChatMessage = (e?: React.FormEvent, questionText?: string) => {
    if (e) e.preventDefault();
    
    // Use provided question or input field
    const messageToSend = questionText || chatInput;
    
    // Don't send empty messages
    if (!messageToSend.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: "user", message: messageToSend };
    setChatHistory(prev => [...prev, userMessage]);
    
    // Clear input
    setChatInput("");
    
    // Show typing indicator
    setIsAssistantTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const assistantResponse = { role: "assistant", message: generateMockResponse(userMessage.message) };
      setChatHistory(prev => [...prev, assistantResponse]);
      setIsAssistantTyping(false);
    }, 1500); // 1.5 second delay to simulate thinking
  };

  // Function to handle clicking on a suggested question
  const handleSuggestedQuestionClick = (question: string) => {
    sendChatMessage(undefined, question);
  };

  // Handle notification click
  const handleNotificationClick = (id: number) => {
    setNotifications(prev => prev.map(note => 
      note.id === id ? { ...note, read: true } : note
    ));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(note => ({ ...note, read: true })));
  };

  // Count unread notifications
  const unreadCount = notifications.filter(note => !note.read).length;
  
  // Navigate through welcome modal steps
  const handleNextStep = () => {
    if (currentWelcomeStep < welcomeFeatures.length - 1) {
      setCurrentWelcomeStep(prev => prev + 1);
    } else {
      setWelcomeModalOpen(false);
      setCurrentWelcomeStep(0);
    }
  };
  
  const handlePrevStep = () => {
    if (currentWelcomeStep > 0) {
      setCurrentWelcomeStep(prev => prev - 1);
    }
  };

  // Close notification panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationPanelOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'optimization':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };
  
  // Get chart data based on selected timeframe
  const getFilteredChartData = (timeframe: string) => {
    const { dailySpendData } = syntheticData;
    
    switch (timeframe) {
      case '7d':
        return dailySpendData.slice(-7);
      case '14d':
        return dailySpendData.slice(-14);
      case '30d':
      default:
        return dailySpendData;
    }
  };
  
  return (
    <ErrorBoundaryComponent>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top navigation */}
          <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img 
                src="https://www.gstatic.com/analytics-suite/header/suite/v2/ic_bigquery.svg"
                alt="QuerySense Logo" 
                className="h-8 w-8 object-contain"
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  QuerySense
                </h1>
                <p className="text-sm text-gray-500">Smart BigQuery Analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Navigation Tabs */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === "dashboard"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Dashboard</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === "chat"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Chat</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === "analytics"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <PieChart className="h-4 w-4" />
                    <span>Analytics</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("queries")}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === "queries"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Terminal className="h-4 w-4" />
                    <span>Queries</span>
                  </div>
                </button>
              </div>
              
              {/* Help Button */}
              <button 
                className="p-2 text-gray-500 hover:text-gray-700 flex items-center gap-1"
                onClick={() => setWelcomeModalOpen(true)}
              >
                <LifeBuoy className="h-5 w-5" />
                <span className="text-sm hidden md:inline">Help & Tour</span>
              </button>
            </div>
          </header>
          {/* Main content */}
          <main className="flex-1 overflow-y-auto">
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div className="p-3 md:p-6">
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    {/* Time Period Selector */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="inline-flex rounded-md shadow-sm" role="group">
                          <button 
                            onClick={() => setSelectedTimeframe("7d")}
                            className={`px-4 py-2 text-sm font-medium ${selectedTimeframe === "7d" 
                              ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                              : "bg-white text-gray-700 hover:bg-gray-50"
                            } border border-gray-300 rounded-l-lg`}
                          >
                            7 Days
                          </button>
                          <button 
                            onClick={() => setSelectedTimeframe("14d")}
                            className={`px-4 py-2 text-sm font-medium ${selectedTimeframe === "14d" 
                              ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                              : "bg-white text-gray-700 hover:bg-gray-50"
                            } border-t border-b border-gray-300`}
                          >
                            14 Days
                          </button>
                          <button 
                            onClick={() => setSelectedTimeframe("30d")}
                            className={`px-4 py-2 text-sm font-medium ${selectedTimeframe === "30d" 
                              ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                              : "bg-white text-gray-700 hover:bg-gray-50"
                            } border border-gray-300 rounded-r-lg`}
                          >
                            30 Days
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Dashboard content */}
                    {/* ... existing dashboard content ... */}
                  </>
                )}
              </div>
            )}
            
            {/* Chat Tab */}
            {activeTab === "chat" && (
              <div className="p-3 md:p-6 h-[calc(100vh-64px)] flex flex-col">
                <div className="bg-white rounded-lg shadow flex-1 flex flex-col overflow-hidden">
                  {/* Chat History */}
                  <div className="flex-1 p-4 overflow-y-auto" ref={chatContainerRef}>
                    {chatHistory.map((message, index) => (
                      <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
                        <div className={`inline-block max-w-3xl rounded-lg px-4 py-2 ${
                          message.role === "user" 
                            ? "bg-indigo-500 text-white" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          <p className="whitespace-pre-line">{message.message}</p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Typing indicator */}
                    {isAssistantTyping && (
                      <div className="mb-4 text-left">
                        <div className="inline-block max-w-3xl rounded-lg px-4 py-2 bg-gray-100 text-gray-800">
                          <div className="flex items-center space-x-2">
                            <Loader className="h-4 w-4 animate-spin text-indigo-500" />
                            <p>Assistant is typing...</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Chat Input */}
                  <div className="border-t border-gray-200 p-4">
                    <form onSubmit={sendChatMessage} className="flex space-x-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Ask a question about your BigQuery usage..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                      <button 
                        type="submit" 
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={isAssistantTyping}
                      >
                        Send
                      </button>
                    </form>
                    
                    {/* Suggested Questions */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Suggested Questions:</h4>
                      <div className="flex flex-wrap gap-2">
                        {suggestedQuestions.map((question, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestedQuestionClick(question)}
                            disabled={isAssistantTyping}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="p-3 md:p-6">
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    {/* Analytics content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6 mb-6">
                      {/* ... existing analytics content ... */}
                    </div>
                  </>
                )}
              </div>
            )}
            
            {/* Queries Tab */}
            {activeTab === "queries" && (
              <div className="p-3 md:p-6">
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    {/* Queries content */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="font-semibold">Query Performance</h3>
                      </div>
                      {/* ... existing queries content ... */}
                    </div>
                  </>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </ErrorBoundaryComponent>
  );
}

export default App;