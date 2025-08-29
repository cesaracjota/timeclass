import React, { useState } from "react";
import {
  Sheet,
  List,
  ListItem,
  ListItemButton,
  ListItemDecorator,
  ListItemContent,
  Typography,
  IconButton,
  Box,
} from "@mui/joy";
import { NavLink, useLocation } from "react-router";
import * as Icons from "lucide-react";

const Sidebar = ({ isCollapsed, isMobile, isOpen, onClose, menuItems }) => {
  const location = useLocation();
  const [expandedSubMenu, setExpandedSubMenu] = useState(null);

  const toggleSubMenu = (id) => {
    setExpandedSubMenu((prev) => (prev === id ? null : id));
  };

  const handleItemClick = (item, e) => {
    const hasSubItems = item.subItems?.length > 0;
    
    if (hasSubItems) {
      e.preventDefault();
      toggleSubMenu(item.id);
    } else if (isMobile) {
      onClose();
    }
  };

  return (
    <Sheet
      sx={{
        position: isMobile ? "fixed" : "relative",
        left: 0,
        top: 0,
        zIndex: isMobile ? 1300 : "auto",
        width: isMobile ? 240 : isCollapsed ? 72 : 240,
        height: "100vh",
        bgcolor: "background.surface",
        borderRight: "1px solid",
        borderColor: "divider",
        overflowX: "hidden",
        overflowY: "auto",
        display: isMobile && !isOpen ? "none" : "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          px: isCollapsed ? 1 : 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        {!isCollapsed && (
          <Typography level="title-md" sx={{ fontWeight: 600 }}>
            Panel
          </Typography>
        )}
        
        {isMobile && (
          <IconButton size="sm" variant="plain" onClick={onClose}>
            <Icons.X size={18} />
          </IconButton>
        )}
      </Box>

      {/* Navigation */}
      <List size="sm" sx={{ px: 1, py: 2, flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.subItems && item.subItems.some(sub => location.pathname === sub.path));
          const hasSubItems = item.subItems?.length > 0;
          const isExpanded = expandedSubMenu === item.id;
          const Icon = Icons[item.icon] || Icons.Circle;

          return (
            <React.Fragment key={item.id}>
              <ListItem>
                <ListItemButton
                  component={hasSubItems ? "div" : NavLink}
                  to={hasSubItems ? undefined : item.path}
                  selected={isActive}
                  onClick={(e) => handleItemClick(item, e)}
                  sx={{
                    justifyContent: isCollapsed ? "center" : "flex-start",
                    px: isCollapsed ? 1 : 2,
                    borderRadius: "sm",
                    minHeight: 40,
                  }}
                >
                  <ListItemDecorator sx={{ minInlineSize: "auto" }}>
                    <Icon size={20} />
                  </ListItemDecorator>
                  
                  {!isCollapsed && (
                    <>
                      <ListItemContent>
                        <Typography level="title-sm">
                          {item.label}
                        </Typography>
                      </ListItemContent>
                      {hasSubItems && (
                        <Box sx={{ ml: "auto" }}>
                          {isExpanded ? (
                            <Icons.ChevronDown size={16} />
                          ) : (
                            <Icons.ChevronRight size={16} />
                          )}
                        </Box>
                      )}
                    </>
                  )}
                </ListItemButton>
              </ListItem>

              {/* Sub Items */}
              {!isCollapsed && hasSubItems && isExpanded && (
                <Box>
                  {item.subItems.map((subItem) => {
                    const isSubActive = location.pathname === subItem.path;
                    return (
                      <ListItem key={subItem.id} sx={{ pl: 2 }}>
                        <ListItemButton
                          component={NavLink}
                          to={subItem.path}
                          selected={isSubActive}
                          onClick={isMobile ? onClose : undefined}
                          sx={{
                            fontSize: "0.875rem",
                            borderRadius: "sm",
                            minHeight: 36,
                          }}
                        >
                          <ListItemContent>
                            <Typography level="body-sm">
                              {subItem.label}
                            </Typography>
                          </ListItemContent>
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </Box>
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Sheet>
  );
};

export default Sidebar;