import { createContext, useContext, useState } from "react";

type SearchContextValue = {
  query: string;
  setQuery: (query: string) => void;
  clear: () => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const clear = () => setQuery("");

  return (
    <SearchContext.Provider value={{ query, setQuery, clear }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error("SearchProvider missing");
  }
  return ctx;
}
