import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Slide,
  useTheme,
  useMediaQuery,
  Fade,
  Chip,
} from "@mui/material";
import {
  Description as DocumentIcon,
  CheckCircle as CheckIcon,
  AutoAwesome as SparkleIcon,
} from "@mui/icons-material";

const DocumentGenerationAnimation = ({
  isGenerating,
  documentCount = 1,
  realProgress = null, // Real progress (0-100) or null for asymptotic fallback
  currentPhaseText = null, // Real phase text or null for default phases
  currentDocumentName = null // Current document being processed
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [displayProgress, setDisplayProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);

  const defaultPhases = [
    { text: "Preparing documents...", icon: <DocumentIcon />, duration: 2000 },
    { text: "Applying signatures...", icon: <SparkleIcon />, duration: 2000 },
    { text: "Generating PDF...", icon: <DocumentIcon />, duration: 2000 },
    { text: "Finalizing...", icon: <CheckIcon />, duration: 1500 },
  ];

  useEffect(() => {
    if (!isGenerating && displayProgress === 0) {
      // Not generating and no progress - keep hidden
      setShouldHide(true);
      return;
    }

    if (!isGenerating && displayProgress > 0 && !isCompleting) {
      // Document generation completed - animate to 100%
      setIsCompleting(true);

      const completeInterval = setInterval(() => {
        setDisplayProgress((prev) => {
          const remaining = 100 - prev;
          if (remaining < 0.01) {
            clearInterval(completeInterval);
            // Set to exactly 100%
            setDisplayProgress(100);
            // Wait a bit at 100% before hiding
            setTimeout(() => {
              setShouldHide(true);
              // Reset after hiding animation completes
              setTimeout(() => {
                setDisplayProgress(0);
                setCurrentPhase(0);
                setIsCompleting(false);
              }, 500);
            }, 800);
            return 100;
          }
          // Quickly move to 100%
          return prev + remaining * 0.35;
        });
      }, 40);

      return () => clearInterval(completeInterval);
    }

    if (isGenerating && !isCompleting) {
      setShouldHide(false);

      // Reset progress if starting fresh
      if (displayProgress === 0) {
        setCurrentPhase(0);
      }

      // If real progress is provided, use it with smooth transitions
      if (realProgress !== null) {
        const smoothInterval = setInterval(() => {
          setDisplayProgress((prev) => {
            const diff = realProgress - prev;
            // Smooth out jumps by moving 30% of the difference
            if (Math.abs(diff) < 0.1) return realProgress;
            return prev + diff * 0.3;
          });
        }, 50);

        return () => clearInterval(smoothInterval);
      }

      // Fallback: Asymptotic progress that NEVER stops
      const progressInterval = setInterval(() => {
        setDisplayProgress((prev) => {
          // Target is high but not 100 - we approach but never reach while generating
          const target = 99.8;
          const remaining = target - prev;

          // Consistent rate that slows down naturally as we approach target
          const rate = 0.015; // 1.5% of remaining distance per tick
          const increment = remaining * rate;

          // Minimum movement to ensure progress never completely stops
          const minIncrement = 0.002; // 0.002% minimum
          const finalIncrement = Math.max(increment, minIncrement);

          return Math.min(prev + finalIncrement, target);
        });
      }, 150);

      // Phase cycling only if no real phase text provided
      if (!currentPhaseText) {
        const phaseInterval = setInterval(() => {
          setCurrentPhase((prev) => (prev + 1) % defaultPhases.length);
        }, 2500);

        return () => {
          clearInterval(progressInterval);
          clearInterval(phaseInterval);
        };
      }

      return () => clearInterval(progressInterval);
    }
  }, [isGenerating, realProgress]);

  if (shouldHide) return null;

  return (
    <Slide direction="up" in={!shouldHide} timeout={400}>
      <Paper
        elevation={8}
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          borderRadius: "16px 16px 0 0",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {/* Animated background pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255,255,255,0.1) 10px,
              rgba(255,255,255,0.1) 20px
            )`,
            animation: "slide 2s linear infinite",
            "@keyframes slide": {
              "0%": { transform: "translateX(-20px)" },
              "100%": { transform: "translateX(0)" },
            },
          }}
        />

        <Box
          sx={{
            position: "relative",
            p: isMobile ? 2 : 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Header with animated icons */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Animated document icons */}
              <Box
                sx={{
                  position: "relative",
                  width: 48,
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {[0, 1, 2].map((index) => (
                  <Fade
                    key={index}
                    in={true}
                    timeout={600}
                    style={{
                      transitionDelay: `${index * 150}ms`,
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        animation: "float 3s ease-in-out infinite",
                        animationDelay: `${index * 0.3}s`,
                        "@keyframes float": {
                          "0%, 100%": {
                            transform: `translateY(0) rotate(${index * 5 - 5}deg)`,
                          },
                          "50%": {
                            transform: `translateY(-8px) rotate(${index * 5 - 5}deg)`,
                          },
                        },
                        left: `${index * 8}px`,
                        opacity: 1 - index * 0.25,
                      }}
                    >
                      <DocumentIcon
                        sx={{
                          fontSize: 32,
                          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                        }}
                      />
                    </Box>
                  </Fade>
                ))}
              </Box>

              {/* Phase text */}
              <Box>
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  sx={{
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Fade in={true} timeout={300} key={isCompleting ? "complete" : currentPhase}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {isCompleting ? (
                        <>
                          <CheckIcon
                            sx={{
                              fontSize: isMobile ? 20 : 24,
                              color: "#4caf50",
                              animation: "checkPulse 0.6s ease-out",
                              "@keyframes checkPulse": {
                                "0%": { opacity: 0, transform: "scale(0.5)" },
                                "50%": { opacity: 1, transform: "scale(1.2)" },
                                "100%": { opacity: 1, transform: "scale(1)" },
                              },
                            }}
                          />
                          Complete!
                        </>
                      ) : currentPhaseText ? (
                        <>
                          <DocumentIcon
                            sx={{
                              fontSize: isMobile ? 20 : 24,
                              animation: "pulse 1.5s ease-in-out infinite",
                              "@keyframes pulse": {
                                "0%, 100%": { opacity: 1, transform: "scale(1)" },
                                "50%": { opacity: 0.7, transform: "scale(1.1)" },
                              },
                            }}
                          />
                          {currentPhaseText}
                        </>
                      ) : (
                        <>
                          {React.cloneElement(defaultPhases[currentPhase].icon, {
                            sx: {
                              fontSize: isMobile ? 20 : 24,
                              animation: "pulse 1.5s ease-in-out infinite",
                              "@keyframes pulse": {
                                "0%, 100%": { opacity: 1, transform: "scale(1)" },
                                "50%": { opacity: 0.7, transform: "scale(1.1)" },
                              },
                            },
                          })}
                          {defaultPhases[currentPhase].text}
                        </>
                      )}
                    </Box>
                  </Fade>
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.9, display: "block", mt: 0.5 }}
                >
                  {currentDocumentName ? (
                    `Processing: ${currentDocumentName}`
                  ) : documentCount === 1 ? (
                    "Processing 1 document"
                  ) : (
                    `Processing ${documentCount} documents`
                  )}
                </Typography>
              </Box>
            </Box>

            {/* Progress percentage */}
            <Chip
              label={`${Math.round(displayProgress)}%`}
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 600,
                fontSize: isMobile ? "0.75rem" : "0.875rem",
                height: isMobile ? 24 : 28,
              }}
            />
          </Box>

          {/* Progress bar */}
          <Box sx={{ position: "relative" }}>
            <LinearProgress
              variant="determinate"
              value={displayProgress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "rgba(255,255,255,0.2)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  backgroundColor: "white",
                  backgroundImage:
                    "linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.8) 100%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s infinite",
                  "@keyframes shimmer": {
                    "0%": { backgroundPosition: "200% 0" },
                    "100%": { backgroundPosition: "-200% 0" },
                  },
                },
              }}
            />
            {/* Animated sparkles */}
            <Box
              sx={{
                position: "absolute",
                top: -4,
                left: `${displayProgress}%`,
                transform: "translateX(-50%)",
                animation: "sparkle 1s ease-in-out infinite",
                "@keyframes sparkle": {
                  "0%, 100%": { opacity: 0, transform: "translateX(-50%) scale(0.5)" },
                  "50%": { opacity: 1, transform: "translateX(-50%) scale(1)" },
                },
              }}
            >
              <SparkleIcon sx={{ fontSize: 16, color: "white" }} />
            </Box>
          </Box>

          {/* Helpful message */}
          <Typography
            variant="caption"
            sx={{
              textAlign: "center",
              opacity: 0.85,
              fontStyle: "italic",
              fontSize: isMobile ? "0.7rem" : "0.75rem",
            }}
          >
            Please wait, this may take a moment... ✨
          </Typography>
        </Box>
      </Paper>
    </Slide>
  );
};

export default DocumentGenerationAnimation;
