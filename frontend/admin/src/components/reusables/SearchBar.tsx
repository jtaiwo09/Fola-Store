import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";

export const SearchBar = ({
  placeholder = "Search products...",
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        type="search"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
      />
    </div>
  );
};
