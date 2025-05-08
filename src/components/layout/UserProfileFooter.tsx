
import React from 'react';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const UserProfileFooter = () => {
  return (
    <div className="px-3 py-2">
      <div className="flex items-center gap-3 rounded-md p-2 hover:bg-slate-100">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-slate-200 text-slate-800">
            <User size={16} />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium">Admin User</span>
          <span className="text-xs text-slate-500">admin@example.com</span>
        </div>
      </div>
    </div>
  );
};
