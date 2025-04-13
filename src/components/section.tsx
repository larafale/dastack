import { cn } from "@/lib/utils"
import React from "react"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  container?: boolean
  border?: "none" | "top" | "bottom" | "both"
}

const Section = ({
  children,
  className,
  border = "none",
  ...props
}: SectionProps) => {
  const borderClasses = {
    none: "",
    top: "border-t border-grid",
    bottom: "border-b border-grid",
    both: "border-y border-grid",
    right: "border-r border-grid",
    left: "border-l border-grid",
  }

  return (
    <section
      className={cn("section", borderClasses[border], className)}
      {...props}
    >
      {children}
    </section>
  )
}

export default Section 