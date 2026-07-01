import type { IResourceItem } from "@refinedev/core";
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  TeamOutlined,
  CalendarOutlined,
  GiftOutlined,
  ApartmentOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

export const resources: IResourceItem[] = [
  {
    name: "dashboard",
    list: "/",
    meta: { label: "Dashboard", icon: <DashboardOutlined /> },
  },
  {
    name: "candidates",
    list: "/candidates",
    show: "/candidates/:id",
    create: "/candidates/new",
    edit: "/candidates/edit/:id",
    meta: { label: "Candidates", icon: <UserOutlined /> },
  },
  {
    name: "job-openings",
    list: "/job-openings",
    show: "/job-openings/:id",
    create: "/job-openings/new",
    edit: "/job-openings/edit/:id",
    meta: { label: "Job Openings", icon: <FileTextOutlined /> },
  },
  {
    name: "recruiters",
    list: "/recruiters",
    show: "/recruiters/:id",
    create: "/recruiters/new",
    edit: "/recruiters/edit/:id",
    meta: { label: "Recruiters", icon: <TeamOutlined /> },
  },
  {
    name: "interviews",
    list: "/interviews",
    show: "/interviews/:id",
    create: "/interviews/new",
    edit: "/interviews/edit/:id",
    meta: { label: "Interviews", icon: <CalendarOutlined /> },
  },
  {
    name: "offers",
    list: "/offers",
    show: "/offers/:id",
    create: "/offers/new",
    edit: "/offers/edit/:id",
    meta: { label: "Offers", icon: <GiftOutlined /> },
  },
  {
    name: "departments",
    list: "/departments",
    show: "/departments/:id",
    create: "/departments/new",
    edit: "/departments/edit/:id",
    meta: { label: "Departments", icon: <ApartmentOutlined /> },
  },
  {
    name: "reports",
    list: "/reports",
    meta: { label: "Hiring Reports", icon: <BarChartOutlined /> },
  },
];
