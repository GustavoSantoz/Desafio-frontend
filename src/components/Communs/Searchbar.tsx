import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchBar = ({ searchTerm, setSearchTerm }: SearchBarProps) => {
  return (
    <div className="mb-6 w-full">
      <Input
        type="text"
        placeholder="Pesquisar itens..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
      />
    </div>
  );
};

export default SearchBar;
