import React from "react";
import { Card, CardContent, Grid, Typography } from "@mui/material";

const DashboardStatsCards = ({
  stats,
  statusFilter,
  onStatusCardClick,
  activeTab,
}) => {
  // Only show on intake form tabs (0,1,2)
  if (activeTab >= 3) {
    return null;
  }

  const statsConfig = [
    {
      label: "All Forms",
      value: stats.totalForms,
      color: "primary",
      statusValue: "",
      borderColor: "primary.main",
      activeColor: "rgba(25, 118, 210, 0.04)",
      hoverColor: "rgba(25, 118, 210, 0.12)",
      triangleColor: "#1976D2",
    },
    {
      label: "In Progress",
      value: stats.inProgressForms,
      color: "primary.dark",
      statusValue: "In Progress",
      borderColor: "primary.main",
      activeColor: "rgba(25, 118, 210, 0.04)",
      selectedColor: "rgba(25, 118, 210, 0.12)",
      triangleColor: "#1976D2",
    },
    {
      label: "Pending",
      value: stats.pendingForms,
      color: "warning.dark",
      statusValue: "Pending",
      borderColor: "warning.main",
      activeColor: "rgba(237, 108, 2, 0.04)",
      selectedColor: "rgba(237, 108, 2, 0.12)",
      triangleColor: "#ED6C02",
    },
    {
      label: "Review",
      value: stats.needsReviewForms,
      color: "error.dark",
      statusValue: "Needs Review",
      borderColor: "error.main",
      activeColor: "rgba(211, 47, 47, 0.04)",
      selectedColor: "rgba(211, 47, 47, 0.12)",
      triangleColor: "#D32F2F",
      shouldPulse: stats.needsReviewForms > 0,
    },
  ];

  return (
    <Grid
      container
      spacing={{ xs: 1, sm: 2 }}
      sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
    >
      {statsConfig.map((stat) => {
        const isSelected = statusFilter === stat.statusValue;
        const isAllFormsCard = stat.statusValue === "";

        return (
          <Grid item xs={6} sm={3} key={stat.label}>
            <Card
              elevation={isSelected ? 6 : stat.label === "Review" ? 3 : 2}
              onClick={() => onStatusCardClick(stat.statusValue)}
              sx={{
                cursor: "pointer",
                transition: "all 0.2s",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "relative",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
                bgcolor: isSelected
                  ? stat.selectedColor
                  : stat.activeColor,
                borderLeft: "4px solid",
                borderColor: stat.borderColor,
                ...(isSelected && {
                  outline: "2px solid",
                  outlineColor: stat.borderColor,
                }),
                ...(stat.shouldPulse &&
                  !isSelected && {
                    animation: "pulse 2s infinite",
                    "@keyframes pulse": {
                      "0%": {
                        boxShadow: "0 0 0 0 rgba(211, 47, 47, 0.4)",
                      },
                      "70%": {
                        boxShadow: "0 0 0 10px rgba(211, 47, 47, 0)",
                      },
                      "100%": {
                        boxShadow: "0 0 0 0 rgba(211, 47, 47, 0)",
                      },
                    },
                  }),
                "&::after": isSelected
                  ? {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: 0,
                      height: 0,
                      borderStyle: "solid",
                      borderWidth: "0 16px 16px 0",
                      borderColor: `transparent ${stat.triangleColor} transparent transparent`,
                    }
                  : {},
              }}
            >
              <CardContent
                sx={{
                  textAlign: "center",
                  py: { xs: 1.5, sm: 3 },
                  px: { xs: 1, sm: 2 },
                }}
              >
                <Typography
                  variant="subtitle2"
                  color={isAllFormsCard && isSelected ? "primary" : stat.color}
                  gutterBottom
                  fontWeight={isSelected ? "bold" : "medium"}
                  sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                >
                  {stat.label}
                </Typography>
                <Typography
                  variant="h5"
                  component="div"
                  color={isAllFormsCard && isSelected ? "primary" : stat.color}
                  sx={{
                    fontSize: { xs: "1.5rem", sm: "2.125rem" },
                    fontWeight: "bold",
                  }}
                >
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default DashboardStatsCards;
