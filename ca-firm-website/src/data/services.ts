export interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export const services: Service[] = [
  {
    id: 1,
    icon: 'Calculator',
    title: 'Income Tax & GST Compliance',
    description: 'Hassle-free tax filings, smart tax planning, and regulatory compliance. We ensure you stay compliant while minimizing your tax burden.',
  },
  {
    id: 2,
    icon: 'BookOpen',
    title: 'Accounting & Auditing',
    description: 'Keeping your books clean, accurate, and audit-ready. Professional accounting services covering financial reporting and management accounts.',
  },
  {
    id: 3,
    icon: 'Briefcase',
    title: 'Business Growth Advisory',
    description: 'Helping startups & SMEs scale with financial strategies. Expert advisory on market evaluation, India entry strategy, and business planning.',
  },
  {
    id: 4,
    icon: 'TrendingUp',
    title: 'Virtual CFO Services',
    description: 'Strategic financial guidance, cash flow management, budgeting, and business analytics for MSMEs — at a fraction of the cost of a full-time CFO.',
  },
  {
    id: 5,
    icon: 'PiggyBank',
    title: 'Investment & Wealth Planning',
    description: 'Making your money work smarter for you. Personalized investment strategies and wealth management solutions for individuals and businesses.',
  },
  {
    id: 6,
    icon: 'FileCheck',
    title: 'Corporate & Legal Services',
    description: 'Company registration, ROC filings, succession planning, valuation services, and complete legal compliance support for your business.',
  },
];
