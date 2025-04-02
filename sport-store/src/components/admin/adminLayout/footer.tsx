export default function Footer() {
  return (
    <footer className="sticky bottom-0 z-40 w-full border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-14 items-center justify-between px-4 sm:px-6">
        <div className="text-sm text-muted-foreground">
          © 2025 <span className="font-semibold">Vju Sport</span> | All Rights Reserved.
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}