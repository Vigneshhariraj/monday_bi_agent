import { useState } from "react";
import { KeyRound, LayoutDashboard, Settings2, Eye, EyeOff } from "lucide-react";

interface ConfigPanelProps {
  mondayApiKey: string;
  geminiApiKey: string;
  dealsBoardId: string;
  workOrdersBoardId: string;
  onMondayApiKeyChange: (v: string) => void;
  onGeminiApiKeyChange: (v: string) => void;
  onDealsBoardIdChange: (v: string) => void;
  onWorkOrdersBoardIdChange: (v: string) => void;
}

const fields = [
  { key: "mondayApiKey", label: "Monday API Key", placeholder: "Enter your Monday.com API key", icon: KeyRound, isSecret: true },
  { key: "geminiApiKey", label: "Gemini API Key", placeholder: "Enter your Gemini API key", icon: KeyRound, isSecret: true },
  { key: "dealsBoardId", label: "Deals Board ID", placeholder: "Enter your Deals board ID", icon: LayoutDashboard, isSecret: false },
  { key: "workOrdersBoardId", label: "Work Orders Board ID", placeholder: "Enter your Work Orders board ID", icon: LayoutDashboard, isSecret: false },
] as const;

export const ConfigPanel = (props: ConfigPanelProps) => {
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const values: Record<string, string> = {
    mondayApiKey: props.mondayApiKey,
    geminiApiKey: props.geminiApiKey,
    dealsBoardId: props.dealsBoardId,
    workOrdersBoardId: props.workOrdersBoardId,
  };

  const setters: Record<string, (v: string) => void> = {
    mondayApiKey: props.onMondayApiKeyChange,
    geminiApiKey: props.onGeminiApiKeyChange,
    dealsBoardId: props.onDealsBoardIdChange,
    workOrdersBoardId: props.onWorkOrdersBoardIdChange,
  };

  const toggleSecret = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section className="card-glass rounded-xl p-6 space-y-5">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Settings2 className="w-4 h-4 text-accent" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Configuration</h2>
          <p className="text-[11px] text-muted-foreground">Session-only · Never stored permanently</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field) => {
          const Icon = field.icon;
          const isVisible = showSecrets[field.key];
          
          return (
            <div key={field.key} className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Icon className="w-3 h-3" />
                {field.label}
              </label>
              <div className="relative group">
                <input
                  type={field.isSecret && !isVisible ? "password" : "text"}
                  value={values[field.key]}
                  onChange={(e) => setters[field.key](e.target.value)}
                  placeholder={field.placeholder}
                  className={`w-full rounded-lg input-field pl-3.5 ${field.isSecret ? "pr-10" : "pr-3.5"} py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50`}
                />
                {field.isSecret && (
                  <button
                    type="button"
                    onClick={() => toggleSecret(field.key)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground/50 hover:text-accent hover:bg-accent/5 transition-colors"
                    title={isVisible ? "Hide" : "Show"}
                  >
                    {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
