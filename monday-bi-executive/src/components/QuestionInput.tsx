import { Send, Loader2 } from "lucide-react";

interface QuestionInputProps {
  value: string;
  onChange: (value: string) => void;
  onAsk: () => void;
  loading: boolean;
}

export const QuestionInput = ({ value, onChange, onAsk, loading }: QuestionInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onAsk();
    }
  };

  return (
    <section className="card-glass rounded-xl p-6 space-y-4">
      <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
        Ask Your Question
      </h2>
      <div className="space-y-3">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a business question…"
          rows={4}
          className="w-full rounded-lg input-field px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 resize-none leading-relaxed"
        />
        <button
          onClick={onAsk}
          disabled={loading || !value.trim()}
          className="btn-primary w-full rounded-lg py-3 text-sm font-semibold text-primary-foreground flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Running Analysis...
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              Ask Question
            </>
          )}
        </button>
      </div>
    </section>
  );
};
