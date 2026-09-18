import type { HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "ppid-pelaksana": HTMLAttributes<HTMLElement> & {
        unit: string;
        lang?: string;
      };
    }
  }
}
