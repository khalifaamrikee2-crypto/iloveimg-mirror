import { Heart } from "lucide-react";

const Header = () => {
  const navItems = [
    { name: "تحويل صور", href: "#" },
    { name: "تحويل إلى JPG", href: "#" },
    { name: "من الصور", href: "#" },
    { name: "تحرير صور", href: "#" },
    { name: "تحرير PDF", href: "#" },
    { name: "تطبيق الصور", href: "#" },
  ];

  return (
    <header className="bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-foreground">I</span>
            <Heart className="w-6 h-6 text-red-500 fill-current" />
            <span className="text-2xl font-bold text-foreground">IMG</span>
          </div>

          {/* Navigation - Hidden on mobile for simplicity */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Language selector - simplified */}
          <div className="flex items-center space-x-2">
            <select className="text-sm bg-transparent text-muted-foreground border-none outline-none">
              <option>العربية</option>
              <option>English</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;