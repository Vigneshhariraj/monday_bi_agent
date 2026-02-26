import { MessageSquare } from "lucide-react";

interface AnswerPanelProps {
  answer: string;
  loading: boolean;
}

export const AnswerPanel = ({ answer, loading }: AnswerPanelProps) => {
  if (!answer && !loading) return null;

  return (
    <section className="card-glass rounded-xl p-6 space-y-4">
      <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-primary" />
        </div>
        Answer
      </h2>
      {loading ? (
        <div className="flex items-center gap-4 text-sm text-foreground/80 py-4">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:-0.3s]" />
          </div>
          Getting your answer...
        </div>
      ) : (
        <div className="text-[15px] leading-[1.8] text-foreground whitespace-pre-wrap font-medium">
          {answer}
        </div>
      )}
    </section>
  );
};
