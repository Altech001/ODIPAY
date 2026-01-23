import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuthStore } from "../store/authStore";

import { CloudDrizzleIcon, Computer, LayoutGrid, LocationEditIcon, LucideLogs, SendIcon, Settings, TicketsPlaneIcon, Users2, WalletCardsIcon, WalletIcon } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import {
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  PieChartIcon,
  PlugInIcon,
  UserCircleIcon
} from "../icons";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <PieChartIcon />,
    name: "Report",
    path: "/report",
  },
  {
    icon: <LayoutGrid />,
    name: "Apps",
    path: "/appsettings",
  },
];

// PAYMENTS section items
const paymentsItems: NavItem[] = [
  {
    icon: <WalletCardsIcon />,
    name: "Wallet Statement",
    path: "/wallet-statement",
  },
  {
    icon: <CloudDrizzleIcon />,
    name: "Collections",
    path: "/collections",
  },
  {
    icon: <SendIcon />,
    name: "Disbursements",
    path: "/disbursements",
  },
  {
    icon: <TicketsPlaneIcon />,
    name: "Marketplace",
    path: "/marketplace",
  },
  {
    icon: <PlugInIcon />,
    name: "Liquidations",
    path: "/liquidations",
  },
  {
    icon: <UserCircleIcon />,
    name: "Beneficiaries",
    path: "/beneficiaries",
  },
];


// MANAGEMENT section items
const managementItems: NavItem[] = [
  {
    icon: <Users2 />,
    name: "Staff",
    path: "/staff",
  },
  {
    icon: <WalletIcon />,
    name: "Wallets",
    path: "/wallets",
  },
  {
    icon: <Settings />,
    name: "Settings",
    path: "/settings",
  },
];


// SYSTEM section items
const systemItems: NavItem[] = [
  {
    icon: <Computer />,
    name: "System",
    path: "/system",
  },
  {
    icon: <LucideLogs />,
    name: "Logs",
    path: "/logs",
  },
  {
    icon: <LocationEditIcon />,
    name: "IP Whitelist",
    path: "/ip-whitelist",
  },
];


const AppSidebar: React.FC = () => {
  const { user } = useAuthStore();
  const { isExpanded, isMobileOpen } = useSidebar();
  const [pathname] = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "payments" | "management" | "system";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => pathname === path,
    [pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "payments", "management", "system"].forEach((menuType) => {
      const items =
        menuType === "main"
          ? navItems
          : menuType === "payments"
            ? paymentsItems
            : menuType === "management"
              ? managementItems
              : systemItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "payments" | "management" | "system",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (
    index: number,
    menuType: "main" | "payments" | "management" | "system"
  ) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (
    items: NavItem[],
    menuType: "main" | "payments" | "management" | "system"
  ) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name} className="relative group/tooltip">
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={`menu-item-icon-size  ${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                    ? "rotate-180 text-brand-500"
                    : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`menu-item-icon-size ${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {/* Tooltip - only visible when sidebar is collapsed */}
          {!isExpanded && !isMobileOpen && (
            <div className="fixed left-[90px] ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-sm rounded-md shadow-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 whitespace-nowrap z-[9999] pointer-events-none"
              style={{ top: 'auto', transform: 'translateY(-50%)' }}
            >
              {nav.name}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45"></div>
            </div>
          )}
          {nav.subItems && (isExpanded || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
    >
      <div
        className={`py-8 flex ${!isExpanded ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link href="/dashboard">
          {isExpanded || isMobileOpen ? (
            <>
              {/* <img
                className="dark:hidden"
                src="/images/logo/logo-icon.svg"
                alt="Logo"
                width={32}
                height={32}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-icon.svg"
                alt="Logo"
                width={32}
                height={32}
              /> */}
              {/* <span className="text-gray-900 dark:text-white">Odipay</span> */}
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>

      {/* User Profile Section */}
      <div className={`p-2 rounded bg-gray-100 dark:bg-gray-800 mb-4 ${!isExpanded && !isMobileOpen ? "flex justify-center" : ""}`}>
        <div className={`flex items-center gap-3 ${!isExpanded && !isMobileOpen ? "justify-center" : ""}`}>
          <div className="relative flex-shrink-0">
            <div className="flex items-center p-1 rounded-full bg-blue-500 dark:bg-blue-800">
              {user?.image ? (
                <img
                  src={user.image}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                </div>
              )}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
          </div>
          {(isExpanded || isMobileOpen) && (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 dark:text-white truncate max-w-[150px]">
                {user?.name || "User"}
              </span>
              <span className="text-xs text-green-500 flex items-center gap-1 font-semibold">
                {user?.role || "Developer"}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isMobileOpen ? (
                  "HOME"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isMobileOpen ? (
                  "PAYMENTS"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(paymentsItems, "payments")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isMobileOpen ? (
                  "MANAGEMENT"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(managementItems, "management")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded ? "lg:justify-center" : "justify-start"
                  }`}
              >
                {isExpanded || isMobileOpen ? "SYSTEM" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(systemItems, "system")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
