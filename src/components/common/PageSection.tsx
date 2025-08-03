import { cn } from "@/lib/utils";

const PageSection = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <section className={cn("w-full py-10 lg:py-20", className)}>
      <div className="w-full md:max-w-6xl lg:max-w-8xl mx-auto px-6 sm:px-6 lg:px-0">
        {children}
      </div>
    </section>
  )
}

export default PageSection;