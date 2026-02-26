import { Terminal } from "lucide-react";

interface TracePanelProps {
  trace: unknown;
}

export const TracePanel = ({ trace }: TracePanelProps) => {
  if (!trace) return null;

  return (
    <section className="card-glass-accent rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Terminal className="w-4 h-4 text-accent" />
        </div>
        <h2 className="text-sm font-semibold text-foreground">Technical Trace & System Metrics</h2>
      </div>
      
      <div className="rounded-lg bg-background/40 border border-white/5 p-4 overflow-hidden">
        <pre className="text-[11px] leading-relaxed text-muted-foreground/80 font-mono whitespace-pre-wrap">
          {JSON.stringify(trace, null, 2)}
        </pre>
      </div>
    </section>
  );
};
