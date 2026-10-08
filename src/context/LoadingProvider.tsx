import { PropsWithChildren, useEffect, useRef, useState } from "react";
import Loading from "../components/Loading";
import { LoadingContext } from "./loadingContext";
export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(0);
  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => { mainRef.current?.toggleAttribute("inert", isLoading); }, [isLoading]);
  // The content stays usable even if a scene or lazy chunk fails to load.
  useEffect(() => {
    const timeout = window.setTimeout(() => setIsLoading(false), 12000);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, setLoading }}>
      {isLoading && <Loading percent={loading} />}
      <main ref={mainRef} className="main-body" aria-busy={isLoading}>{children}</main>
    </LoadingContext.Provider>
  );
};
