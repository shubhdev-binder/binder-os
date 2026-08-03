import { useEffect } from "react";
import BinderLogo from "@/components/BinderLogo";

const LogoPreview = () => {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-12 p-8">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
          Binder OS Logo — Live Motion
        </p>
        <div className="flex items-center justify-center gap-16 flex-wrap">
          <div className="flex flex-col items-center gap-3">
            <BinderLogo size={320} />
            <span className="text-xs text-muted-foreground">320px</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <BinderLogo size={160} />
            <span className="text-xs text-muted-foreground">160px</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <BinderLogo size={64} />
            <span className="text-xs text-muted-foreground">64px</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoPreview;
