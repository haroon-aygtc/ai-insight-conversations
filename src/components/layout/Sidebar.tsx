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
  Brain,
  GitBranch,
  Rocket,
  Activity,
  FileCode,
  Bot,
  Zap,
  MessageSquare,
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
          <div className="flex items-center gap-2 mb-6 px-2">
            <Brain className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold tracking-tight">TempoLabs AI</h2>
          </div>
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
          <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
            Development
          </h3>
          <div className="space-y-1">
            <SidebarItem
              icon={<GitBranch className="h-4 w-4" />}
              label="Experiments"
              href="/experiments"
              active={pathname === "/experiments"}
            />
            <SidebarItem
              icon={<FileCode className="h-4 w-4" />}
              label="Notebooks"
              href="/notebooks"
              active={pathname === "/notebooks"}
            />
            <SidebarItem
              icon={<Layers className="h-4 w-4" />}
              label="Training Jobs"
              href="/training-jobs"
              active={pathname === "/training-jobs"}
            />
          </div>
        </div>

        <div className="px-4 py-2">
          <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
            Operations
          </h3>
          <div className="space-y-1">
            <SidebarItem
              icon={<Rocket className="h-4 w-4" />}
              label="Deployments"
              href="/deployments"
              active={pathname === "/deployments"}
            />
            <SidebarItem
              icon={<Activity className="h-4 w-4" />}
              label="Monitoring"
              href="/monitoring"
              active={pathname === "/monitoring"}
            />
            <SidebarItem
              icon={<BarChart2 className="h-4 w-4" />}
              label="Analytics"
              href="/analytics"
              active={pathname === "/analytics"}
            />
          </div>
        </div>

        <div className="px-4 py-2">
          <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
            AI Services
          </h3>
          <div className="space-y-1">
            <SidebarItem
              icon={<Bot className="h-4 w-4" />}
              label="Chatbots"
              href="/chatbots"
              active={pathname === "/chatbots"}
            />
            <SidebarItem
              icon={<MessageSquare className="h-4 w-4" />}
              label="Conversations"
              href="/conversations"
              active={pathname === "/conversations"}
            />
            <SidebarItem
              icon={<Zap className="h-4 w-4" />}
              label="Integrations"
              href="/integrations"
              active={pathname === "/integrations"}
            />
          </div>
        </div>

        <div className="px-4 py-2">
          <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
            Administration
          </h3>
          <div className="space-y-1">
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
