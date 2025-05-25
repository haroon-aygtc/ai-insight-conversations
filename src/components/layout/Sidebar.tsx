import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Cpu,
  BarChart2,
  Database,
  Settings,
  Layers,
  Code,
  Home,
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  href,
  active,
}) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
        active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="pb-12 min-h-screen">
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            TempoLabs AI
          </h2>
          <div className="space-y-1">
            <SidebarItem
              icon={<Home className="h-4 w-4" />}
              label="Dashboard"
              href="/"
              active={pathname === "/"}
            />
            <SidebarItem
              icon={<Cpu className="h-4 w-4" />}
              label="AI Models"
              href="/ai-models"
              active={pathname === "/ai-models"}
            />
            <SidebarItem
              icon={<Database className="h-4 w-4" />}
              label="Datasets"
              href="/datasets"
              active={pathname === "/datasets"}
            />
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Management
          </h2>
          <div className="space-y-1">
            <SidebarItem
              icon={<Layers className="h-4 w-4" />}
              label="Projects"
              href="/projects"
              active={pathname === "/projects"}
            />
            <SidebarItem
              icon={<BarChart2 className="h-4 w-4" />}
              label="Analytics"
              href="/analytics"
              active={pathname === "/analytics"}
            />
            <SidebarItem
              icon={<Code className="h-4 w-4" />}
              label="API Keys"
              href="/api-keys"
              active={pathname === "/api-keys"}
            />
            <SidebarItem
              icon={<Settings className="h-4 w-4" />}
              label="Settings"
              href="/settings"
              active={pathname === "/settings"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
