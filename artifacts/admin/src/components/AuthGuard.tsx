import { useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth");
    if (auth !== "authenticated") {
      const portfolioBase = window.location.origin.replace(/\/admin.*$/, "");
      window.location.href = `${portfolioBase}/?admin=true`;
    } else {
      setChecked(true);
    }
  }, []);

  if (!checked) return null;
  return <>{children}</>;
}
