import { useState } from "react";
import { ConfigPanel } from "@/components/ConfigPanel";
import { QuestionInput } from "@/components/QuestionInput";
import { AnswerPanel } from "@/components/AnswerPanel";
import { TracePanel } from "@/components/TracePanel";
import { Shield, Zap, BarChart3 } from "lucide-react";

const Index = () => {
  const [mondayApiKey, setMondayApiKey] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [dealsBoardId, setDealsBoardId] = useState("");
  const [workOrdersBoardId, setWorkOrdersBoardId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [trace, setTrace] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<{role: string, content: string}[]>([]);

  const handleAsk = async () => {
    if (!question.trim()) return;
    const currentQuestion = question.trim();
    setLoading(true);
    setError("");
    setTrace(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          question: currentQuestion,
          mondayApiKey,
          geminiApiKey,
          dealsBoardId,
          workOrdersBoardId,
          history: history
        }),
      });

      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      const data = await res.json();
      const newAnswer = data.answer || "No answer returned.";
      setAnswer(newAnswer);
      setTrace(data.trace || null);
      
      // Update local history for next turns
      setHistory(prev => [
        ...prev, 
        { role: "user", content: currentQuestion },
        { role: "assistant", content: newAnswer }
      ]);
      setQuestion(""); // Clear input for next follow-up
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-background relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-grid opacity-[0.03]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,_hsl(0_100%_27%_/_0.06)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute top-[200px] right-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_center,_hsl(43_56%_52%_/_0.04)_0% ,_transparent_70%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-6 overflow-hidden">
        
        {/* Header - Fixed height, no margin bottom */}
        <header className="text-center space-y-2 mb-4 shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full border border-border bg-muted/50 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
            <span className="w-1 h-1 rounded-full bg-accent" />
            Executive Platform
          </div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">
            Monday <span className="gold-text">Business Intelligence</span>
          </h1>
          <div className="flex items-center justify-center gap-6 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-accent" />
              <span>Secure</span>
            </div>
            <div className="w-px h-2 bg-border" />
            <div className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-accent" />
              <span>Real-Time</span>
            </div>
            <div className="w-px h-2 bg-border" />
            <div className="flex items-center gap-1.5">
              <BarChart3 className="w-3 h-3 text-accent" />
              <span>Insights</span>
            </div>
          </div>
        </header>

        {/* Main Content Area - Stretches to fill space */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4 overflow-hidden min-h-0">
          
          {/* Left Column: Configuration & Input - Scrollable if needed */}
          <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
            <ConfigPanel
              mondayApiKey={mondayApiKey}
              geminiApiKey={geminiApiKey}
              dealsBoardId={dealsBoardId}
              workOrdersBoardId={workOrdersBoardId}
              onMondayApiKeyChange={setMondayApiKey}
              onGeminiApiKeyChange={setGeminiApiKey}
              onDealsBoardIdChange={setDealsBoardId}
              onWorkOrdersBoardIdChange={setWorkOrdersBoardId}
            />

            <QuestionInput
              value={question}
              onChange={setQuestion}
              onAsk={handleAsk}
              loading={loading}
            />

            {error && (
              <div className="card-glass rounded-lg border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive flex items-start gap-3 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-1 shrink-0" />
                {error}
              </div>
            )}
          </div>

          {/* Right Column: Answers & Trace - Scrollable if needed */}
          <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
            <div className="shrink-0">
              <AnswerPanel answer={answer} loading={loading} />
            </div>
            <div className="flex-1">
              <TracePanel trace={trace} />
            </div>
          </div>
        </main>

        {/* Footer - Pushed to bottom */}
        <footer className="text-center pt-4 shrink-0">
          <div className="divider-gold mb-3 opacity-30" />
          <p className="text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em]">
            VH <span className="mx-2 text-accent/20">|</span> Monday BI Agent <span className="mx-2 text-accent/20">|</span> v2.0-Alpha
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
