import React from "react";
import { Menu, MenuItem, Typography, Box, Chip } from "@mui/material";
import { CheckCircle as CheckCircleIcon, RadioButtonUnchecked as RadioButtonUncheckedIcon } from "@mui/icons-material";
import { getSignatureLabel, DEFAULT_SIGNATURE_LABELS } from "../../utils/signatureLabels";

const SignatureMenu = ({
  anchorEl,
  open,
  onClose,
  onSelect,
  signatureLabels = {},
  collectedSignatures = {}
}) => {
  const signatureTypes = [
    { type: "childSignature", defaultLabel: DEFAULT_SIGNATURE_LABELS.childSignature },
    { type: "parentSignature", defaultLabel: DEFAULT_SIGNATURE_LABELS.parentSignature },
    { type: "caseworkerSignature", defaultLabel: DEFAULT_SIGNATURE_LABELS.caseworkerSignature },
    { type: "supervisorSignature", defaultLabel: DEFAULT_SIGNATURE_LABELS.supervisorSignature },
    { type: "agencyRepSignature", defaultLabel: DEFAULT_SIGNATURE_LABELS.agencyRepSignature },
  ];

  const handleSelect = (signatureType) => {
    onSelect(signatureType);
    onClose();
  };

  const isCollected = (type) => {
    return collectedSignatures && collectedSignatures[type];
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          maxHeight: 400,
          width: '320px',
        },
      }}
    >
      <MenuItem disabled>
        <Typography variant="subtitle2">Select a signature:</Typography>
      </MenuItem>
      {signatureTypes.map(({ type, defaultLabel }) => {
        const collected = isCollected(type);
        return (
          <MenuItem
            key={type}
            onClick={() => handleSelect(type)}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
              {collected ? (
                <CheckCircleIcon sx={{ fontSize: 20, color: 'success.main' }} />
              ) : (
                <RadioButtonUncheckedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
              )}
              <Typography>
                {getSignatureLabel(type, signatureLabels)} Signature
              </Typography>
            </Box>
            <Chip
              label={collected ? "Collected" : "Missing"}
              size="small"
              color={collected ? "success" : "default"}
              variant={collected ? "filled" : "outlined"}
              sx={{
                height: 20,
                fontSize: '0.7rem',
                fontWeight: 500,
              }}
            />
          </MenuItem>
        );
      })}
    </Menu>
  );
};

export default SignatureMenu;
