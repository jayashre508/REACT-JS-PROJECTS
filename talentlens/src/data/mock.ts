export type PipelineStage =
  | 'Applied'
  | 'Screening'
  | 'Technical Interview'
  | 'Manager Round'
  | 'HR Round'
  | 'Offer'
  | 'Hired'
  | 'Rejected'

export type OfferStatus = 'Pending' | 'Accepted' | 'Declined' | 'Negotiating'
export type JobStatus = 'Open' | 'Closed' | 'On Hold'
export type InterviewStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show'

export interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  role: string
  department: string
  skills: string[]
  experience: number
  noticePeriod: string
  stage: PipelineStage
  source: string
  recruiter: string
  appliedDate: string
  resumeUrl?: string
  rating?: number
}

export interface JobOpening {
  id: string
  title: string
  department: string
  location: string
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote'
  status: JobStatus
  openedDate: string
  recruiter: string
  applicants: number
  salaryMin: number
  salaryMax: number
  priority: 'High' | 'Medium' | 'Low'
}

export interface Recruiter {
  id: string
  name: string
  email: string
  phone: string
  department: string
  activeRoles: number
  hiredThisMonth: number
  avgTimeToHire: number
  joinedDate: string
}

export interface Interview {
  id: string
  candidateName: string
  jobTitle: string
  interviewer: string
  date: string
  time: string
  type: 'Technical' | 'Manager' | 'HR' | 'Screening'
  status: InterviewStatus
  rating?: number
  feedback?: string
  recommendation?: 'Strong Yes' | 'Yes' | 'No' | 'Strong No'
}

export interface Offer {
  id: string
  candidateName: string
  jobTitle: string
  department: string
  baseSalary: number
  joiningDate: string
  status: OfferStatus
  sentDate: string
  expiryDate: string
  negotiationRound: number
}

export interface Department {
  id: string
  name: string
  head: string
  openRoles: number
  totalHeadcount: number
  hiredThisQuarter: number
  avgTimeToHire: number
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

export const CANDIDATES: Candidate[] = [
  { id: '1', name: 'Arjun Mehta', email: 'arjun@email.com', phone: '+91-9876543210', role: 'Senior Frontend Engineer', department: 'Engineering', skills: ['React', 'TypeScript', 'GraphQL'], experience: 5, noticePeriod: '30 days', stage: 'Technical Interview', source: 'LinkedIn', recruiter: 'Priya Sharma', appliedDate: '2024-11-01', rating: 4 },
  { id: '2', name: 'Sneha Kapoor', email: 'sneha@email.com', phone: '+91-9876543211', role: 'Product Manager', department: 'Product', skills: ['Roadmapping', 'Agile', 'SQL'], experience: 7, noticePeriod: '60 days', stage: 'Manager Round', source: 'Referral', recruiter: 'Rahul Verma', appliedDate: '2024-10-28', rating: 5 },
  { id: '3', name: 'Vikram Singh', email: 'vikram@email.com', phone: '+91-9876543212', role: 'DevOps Engineer', department: 'Engineering', skills: ['AWS', 'Kubernetes', 'Terraform'], experience: 4, noticePeriod: '45 days', stage: 'Offer', source: 'Naukri', recruiter: 'Priya Sharma', appliedDate: '2024-10-15', rating: 4 },
  { id: '4', name: 'Ananya Iyer', email: 'ananya@email.com', phone: '+91-9876543213', role: 'UX Designer', department: 'Design', skills: ['Figma', 'User Research', 'Prototyping'], experience: 3, noticePeriod: '30 days', stage: 'Screening', source: 'Dribbble', recruiter: 'Meera Nair', appliedDate: '2024-11-05', rating: 3 },
  { id: '5', name: 'Rohan Das', email: 'rohan@email.com', phone: '+91-9876543214', role: 'Data Scientist', department: 'Analytics', skills: ['Python', 'ML', 'Spark'], experience: 6, noticePeriod: '60 days', stage: 'Hired', source: 'LinkedIn', recruiter: 'Rahul Verma', appliedDate: '2024-09-20', rating: 5 },
  { id: '6', name: 'Kavya Reddy', email: 'kavya@email.com', phone: '+91-9876543215', role: 'Backend Engineer', department: 'Engineering', skills: ['Node.js', 'PostgreSQL', 'Redis'], experience: 4, noticePeriod: '30 days', stage: 'Applied', source: 'Indeed', recruiter: 'Priya Sharma', appliedDate: '2024-11-08', rating: undefined },
  { id: '7', name: 'Amit Joshi', email: 'amit@email.com', phone: '+91-9876543216', role: 'Sales Manager', department: 'Sales', skills: ['CRM', 'B2B Sales', 'Negotiation'], experience: 8, noticePeriod: '90 days', stage: 'Rejected', source: 'Referral', recruiter: 'Meera Nair', appliedDate: '2024-10-10', rating: 2 },
  { id: '8', name: 'Divya Nair', email: 'divya@email.com', phone: '+91-9876543217', role: 'HR Business Partner', department: 'HR', skills: ['HRBP', 'Talent Management', 'L&D'], experience: 5, noticePeriod: '30 days', stage: 'HR Round', source: 'LinkedIn', recruiter: 'Meera Nair', appliedDate: '2024-11-02', rating: 4 },
]

export const JOB_OPENINGS: JobOpening[] = [
  { id: '1', title: 'Senior Frontend Engineer', department: 'Engineering', location: 'Bangalore', type: 'Full-time', status: 'Open', openedDate: '2024-10-01', recruiter: 'Priya Sharma', applicants: 24, salaryMin: 2000000, salaryMax: 3000000, priority: 'High' },
  { id: '2', title: 'Product Manager', department: 'Product', location: 'Remote', type: 'Full-time', status: 'Open', openedDate: '2024-10-05', recruiter: 'Rahul Verma', applicants: 18, salaryMin: 2500000, salaryMax: 3500000, priority: 'High' },
  { id: '3', title: 'DevOps Engineer', department: 'Engineering', location: 'Hyderabad', type: 'Full-time', status: 'Open', openedDate: '2024-09-15', recruiter: 'Priya Sharma', applicants: 12, salaryMin: 1800000, salaryMax: 2800000, priority: 'Medium' },
  { id: '4', title: 'UX Designer', department: 'Design', location: 'Mumbai', type: 'Full-time', status: 'Open', openedDate: '2024-11-01', recruiter: 'Meera Nair', applicants: 9, salaryMin: 1500000, salaryMax: 2200000, priority: 'Medium' },
  { id: '5', title: 'Data Scientist', department: 'Analytics', location: 'Bangalore', type: 'Full-time', status: 'Closed', openedDate: '2024-09-01', recruiter: 'Rahul Verma', applicants: 31, salaryMin: 2200000, salaryMax: 3200000, priority: 'High' },
  { id: '6', title: 'Sales Manager', department: 'Sales', location: 'Delhi', type: 'Full-time', status: 'On Hold', openedDate: '2024-10-20', recruiter: 'Meera Nair', applicants: 7, salaryMin: 1800000, salaryMax: 2500000, priority: 'Low' },
]

export const RECRUITERS: Recruiter[] = [
  { id: '1', name: 'Priya Sharma', email: 'priya@talentlens.io', phone: '+91-9800000001', department: 'Engineering', activeRoles: 3, hiredThisMonth: 4, avgTimeToHire: 28, joinedDate: '2022-03-15' },
  { id: '2', name: 'Rahul Verma', email: 'rahul@talentlens.io', phone: '+91-9800000002', department: 'Product & Analytics', activeRoles: 2, hiredThisMonth: 3, avgTimeToHire: 35, joinedDate: '2021-07-01' },
  { id: '3', name: 'Meera Nair', email: 'meera@talentlens.io', phone: '+91-9800000003', department: 'Design & HR', activeRoles: 3, hiredThisMonth: 2, avgTimeToHire: 22, joinedDate: '2023-01-10' },
]

export const INTERVIEWS: Interview[] = [
  { id: '1', candidateName: 'Arjun Mehta', jobTitle: 'Senior Frontend Engineer', interviewer: 'Kiran Rao', date: '2024-11-15', time: '10:00 AM', type: 'Technical', status: 'Scheduled', rating: undefined, feedback: undefined },
  { id: '2', candidateName: 'Sneha Kapoor', jobTitle: 'Product Manager', interviewer: 'Suresh Kumar', date: '2024-11-14', time: '2:00 PM', type: 'Manager', status: 'Completed', rating: 5, feedback: 'Exceptional strategic thinking. Strong product sense.', recommendation: 'Strong Yes' },
  { id: '3', candidateName: 'Vikram Singh', jobTitle: 'DevOps Engineer', interviewer: 'Priya Sharma', date: '2024-11-13', time: '11:00 AM', type: 'HR', status: 'Completed', rating: 4, feedback: 'Good culture fit. Salary expectations aligned.', recommendation: 'Yes' },
  { id: '4', candidateName: 'Ananya Iyer', jobTitle: 'UX Designer', interviewer: 'Meera Nair', date: '2024-11-16', time: '3:00 PM', type: 'Screening', status: 'Scheduled' },
  { id: '5', candidateName: 'Divya Nair', jobTitle: 'HR Business Partner', interviewer: 'Rahul Verma', date: '2024-11-12', time: '4:00 PM', type: 'HR', status: 'Completed', rating: 4, feedback: 'Strong HRBP background. Recommended for offer.', recommendation: 'Yes' },
  { id: '6', candidateName: 'Amit Joshi', jobTitle: 'Sales Manager', interviewer: 'Suresh Kumar', date: '2024-11-10', time: '10:00 AM', type: 'Manager', status: 'Completed', rating: 2, feedback: 'Did not meet expectations for the role.', recommendation: 'No' },
]

export const OFFERS: Offer[] = [
  { id: '1', candidateName: 'Vikram Singh', jobTitle: 'DevOps Engineer', department: 'Engineering', baseSalary: 2400000, joiningDate: '2024-12-01', status: 'Pending', sentDate: '2024-11-13', expiryDate: '2024-11-20', negotiationRound: 1 },
  { id: '2', candidateName: 'Rohan Das', jobTitle: 'Data Scientist', department: 'Analytics', baseSalary: 2800000, joiningDate: '2024-11-25', status: 'Accepted', sentDate: '2024-10-25', expiryDate: '2024-11-01', negotiationRound: 2 },
  { id: '3', candidateName: 'Sneha Kapoor', jobTitle: 'Product Manager', department: 'Product', baseSalary: 3200000, joiningDate: '2024-12-15', status: 'Negotiating', sentDate: '2024-11-14', expiryDate: '2024-11-21', negotiationRound: 1 },
]

export const DEPARTMENTS: Department[] = [
  { id: '1', name: 'Engineering', head: 'Kiran Rao', openRoles: 3, totalHeadcount: 45, hiredThisQuarter: 6, avgTimeToHire: 32 },
  { id: '2', name: 'Product', head: 'Suresh Kumar', openRoles: 1, totalHeadcount: 12, hiredThisQuarter: 2, avgTimeToHire: 38 },
  { id: '3', name: 'Design', head: 'Anita Bose', openRoles: 1, totalHeadcount: 8, hiredThisQuarter: 1, avgTimeToHire: 25 },
  { id: '4', name: 'Analytics', head: 'Deepak Menon', openRoles: 0, totalHeadcount: 10, hiredThisQuarter: 3, avgTimeToHire: 30 },
  { id: '5', name: 'Sales', head: 'Ravi Pillai', openRoles: 1, totalHeadcount: 20, hiredThisQuarter: 2, avgTimeToHire: 20 },
  { id: '6', name: 'HR', head: 'Meera Nair', openRoles: 1, totalHeadcount: 6, hiredThisQuarter: 1, avgTimeToHire: 18 },
]

export const PIPELINE_STAGES: PipelineStage[] = [
  'Applied', 'Screening', 'Technical Interview', 'Manager Round', 'HR Round', 'Offer', 'Hired', 'Rejected',
]

export const SOURCES = ['LinkedIn', 'Referral', 'Naukri', 'Indeed', 'Dribbble', 'Company Website', 'Campus']
