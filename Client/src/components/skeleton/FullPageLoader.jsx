import { Loader2 } from "lucide-react";

export const FullPageLoader = () => (
  <div className="h-screen flex items-center justify-center">
    <Loader2 className="animate-spin h-10 w-10 text-primary" />
  </div>
);
