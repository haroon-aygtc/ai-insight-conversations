import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface ModelFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  clearFilters: () => void;
}

const ModelFilters: React.FC<ModelFiltersProps> = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  clearFilters,
}) => {
  const hasActiveFilters = search || statusFilter || typeFilter;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search models..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-8 w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="training">Training</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-8 w-[130px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="classification">Classification</SelectItem>
            <SelectItem value="regression">Regression</SelectItem>
            <SelectItem value="nlp">NLP</SelectItem>
            <SelectItem value="vision">Computer Vision</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={clearFilters}
          >
            <X className="mr-1 h-3 w-3" />
            Clear filters
          </Button>
        )}

        {statusFilter && (
          <Badge variant="secondary" className="h-6">
            Status: {statusFilter}
            <button
              className="ml-1 rounded-full hover:bg-muted"
              onClick={() => setStatusFilter("")}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {typeFilter && (
          <Badge variant="secondary" className="h-6">
            Type: {typeFilter}
            <button
              className="ml-1 rounded-full hover:bg-muted"
              onClick={() => setTypeFilter("")}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ModelFilters;
