import React, { useState, useRef, useEffect } from 'react';
import {
  CalendarClock,
  Clock3,
  CheckCircle2,
  Send,
  ChevronDown,
} from 'lucide-react';
import { CONTENT_STATUSES, ContentStatus, STATUS_META } from '../types/content';

export const StatusIcon: React.FC<{
  status: ContentStatus;
  className?: string;
}> = ({ status, className = 'w-4 h-4' }) => {
  switch (status) {
    case 'Terjadwal':
      return <CalendarClock className={className} />;
    case 'Sedang Diproses':
      return <Clock3 className={className} />;
    case 'Siap Publikasi':
      return <CheckCircle2 className={className} />;
    case 'Sudah Dipublikasikan':
      return <Send className={className} />;
  }
};

interface StatusControlProps {
  status: ContentStatus;
  onChange: (newStatus: ContentStatus) => void;
  variant?: 'default' | 'on-purple';
}

export const StatusControl: React.FC<StatusControlProps> = ({
  status,
  onChange,
  variant = 'default',
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  const meta = STATUS_META[status];

  const buttonClasses =
    variant === 'on-purple'
      ? 'bg-white text-slate-900 hover:bg-purple-50 border border-white shadow-sm'
      : `${meta.bgClass} ${meta.textClass} border ${meta.borderClass} hover:brightness-95`;

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        title="Ketuk untuk mengubah status konten"
        className={`inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 ${buttonClasses}`}
      >
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: meta.dotColor }}
        />
        <StatusIcon status={status} className="w-3.5 h-3.5 shrink-0" />
        <span>{status}</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-70 shrink-0" />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Pilih status konten"
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 mt-1.5 w-60 rounded-2xl bg-white border border-purple-100 shadow-xl shadow-purple-950/12 p-1.5 z-50"
        >
          <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-500 border-b border-slate-100 mb-1">
            Ubah Status Konten
          </div>
          {CONTENT_STATUSES.map((s) => {
            const sMeta = STATUS_META[s];
            const isActive = s === status;
            return (
              <button
                key={s}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  onChange(s);
                  setOpen(false);
                }}
                className={`w-full flex items-start gap-2.5 px-2.5 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-purple-50 text-purple-950'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`mt-0.5 p-1.5 rounded-lg ${sMeta.bgClass} ${sMeta.textClass}`}
                >
                  <StatusIcon status={s} className="w-3.5 h-3.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-xs font-bold leading-tight">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: sMeta.dotColor }}
                    />
                    <span>{sMeta.label}</span>
                  </span>
                  <span className="block text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {sMeta.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
