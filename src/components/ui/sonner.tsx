import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  // const { theme = "system" } = useTheme()

  let theme : "light" | "dark" = localStorage.getItem("theme") == "dark" ? "dark" : "light";

  return (
    <Sonner
      theme={ theme}
      className="toaster group"
      {...props}
    />
  )
}

export { Toaster }
