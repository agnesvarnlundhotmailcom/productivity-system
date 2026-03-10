import React from "react";
import { Link, useLocation } from "react-router-dom";
import { History, Calendar, Timer, BarChart } from "lucide-react";

/**
 * Bottom navigation bar för mobil - klassisk app-design
 */
const BottomNav = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/flow", icon: Timer, label: "Timer" },
    { path: "/calendar", icon: Calendar, label: "Kalender" },
    { path: "/history", icon: History, label: "Historik" },
    { path: "/stats", icon: BarChart, label: "Statistik" },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map(({ path, icon: Icon, label }) => (
        <Link
          key={path}
          to={path}
          className={`bottom-nav-link ${isActive(path) ? "active" : ""}`}
          aria-label={label}
        >
          <Icon size={24} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNav;
