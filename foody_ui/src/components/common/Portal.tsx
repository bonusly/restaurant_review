import { type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: ReactNode;
  container?: Element | DocumentFragment;
}

export function Portal({ children, container }: PortalProps) {
  const [mountNode, setMountNode] = useState<Element | DocumentFragment | null>(null);

  useEffect(() => {
    const node = container || document.body;
    setMountNode(node);
  }, [container]);

  if (!mountNode) return null;

  return createPortal(children, mountNode);
}
