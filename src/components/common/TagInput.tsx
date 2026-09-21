import React, { useState, KeyboardEvent } from 'react';
import { Plus, X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  badgeVariant?: 'primary' | 'secondary';
  label?: string;
  error?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  placeholder = 'Digite e pressione Enter...',
  badgeVariant = 'primary',
  label,
  error,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter(t => t !== tagToRemove));
  };

  const chipColor = badgeVariant === 'primary' 
    ? 'bg-brand-500/15 text-brand-300 border-brand-500/30'
    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </label>
      )}

      <div className="flex flex-wrap gap-2 p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl focus-within:ring-2 focus-within:ring-brand-500/50 focus-within:border-brand-500 transition-all">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium border ${chipColor} animate-fadeIn`}
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="hover:text-white p-0.5 rounded transition-colors focus:outline-none"
              title="Remover tag"
            >
              <X size={13} />
            </button>
          </span>
        ))}

        <div className="flex items-center flex-1 min-w-[160px] gap-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : 'Adicionar outro...'}
            className="w-full bg-transparent text-sm text-slate-200 placeholder-slate-500 focus:outline-none px-1 py-0.5"
          />
          {inputValue.trim() && (
            <button
              type="button"
              onClick={handleAddTag}
              className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center shrink-0 transition-colors"
            >
              <Plus size={14} />
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
    </div>
  );
};
