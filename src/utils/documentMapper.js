// Save this file as: frontend/src/utils/documentMapper.js
// 2 changes needed in this file per doc. 1. map to template, 2. map to form
// todo 1. Import new files below

import React from "react";
import NoticeOfAction from "../components/documents/NoticeOfAction";
import NoticeOfActionForm from "../components/forms/NoticeOfActionForm";
import IDEmergencyInfo from "../components/documents/IDEmergencyInfo";
import IDEmergencyInfoForm from "../components/forms/IDEmergencyInfoForm";
import AgencyToAgencyAgreement from "../components/documents/AgencyToAgencyAgreement";
import AgencyToAgencyAgreementForm from "../components/forms/AgencyToAgencyAgreementForm";
import AgencyToFosterParent from "../components/documents/AgencyToFosterParent";
import AgencyToFosterParentForm from "../components/forms/AgencyToFosterParentForm";
import ClientGrievanceGuidelines from "../components/documents/ClientGrievanceGuidelines";
import ClientGrievanceGuidelinesForm from "../components/forms/ClientGrievanceGuidelinesForm";
import CountyWorkerGrievanceGuidelines from "../components/documents/CountyWorkerGrievanceGuidelines";
import CountyWorkerGrievanceGuidelinesForm from "../components/forms/CountyWorkerGrievanceGuidelinesForm";
import CHPD from "../components/documents/CHPD";
import CHPDForm from "../components/forms/CHPDForm";
import MedicalTreatment from "../components/documents/MedicalTreatment";
import MedicalTreatmentForm from "../components/forms/MedicalTreatmentForm";
import PRNAuthorizationLetter from "../components/documents/PRNAuthorizationLetter";
import PRNAuthorizationLetterForm from "../components/forms/PRNAuthorizationLetterForm";
import PRNPage2 from "../components/documents/PRNPage2";
import PRNPage2Form from "../components/forms/PRNPage2Form";
import ClientPersonalRights from "../components/documents/ClientPersonalRights";
import ClientPersonalRightsForm from "../components/forms/ClientPersonalRightsForm";
import ConfirmTBTest from "../components/documents/ConfirmTBTest";
import ConfirmTBTestForm from "../components/forms/ConfirmTBTestForm";
import ConfirmAmbulatoryStatus from "../components/documents/ConfirmAmbulatoryStatus";
import ConfirmAmbulatoryStatusForm from "../components/forms/ConfirmAmbulatoryStatusForm";
import ClientCashResources from "../components/documents/ClientCashResources";
import ClientCashResourcesForm from "../components/forms/ClientCashResourcesForm";
import ClientInitialCarePlan from "../components/documents/ClientInitialCarePlan";
import ClientInitialCarePlanForm from "../components/forms/ClientInitialCarePlanForm";
import ClientDisciplinaryPP from "../components/documents/ClientDisciplinaryPP";
import ClientDisciplinaryPPForm from "../components/forms/ClientDisciplinaryPPForm";
import ClientDischarge from "../components/documents/ClientDischarge";
import ClientDischargeForm from "../components/forms/ClientDischargeForm";
import AcknowledgementOfPriorInfo from "../components/documents/AcknowledgementOfPriorInfo";
import AcknowledgementOfPriorInfoForm from "../components/forms/AcknowledgementOfPriorInfoForm";
import HomePlacementLog from "../components/documents/HomePlacementLog";
import HomePlacementLogForm from "../components/forms/HomePlacementLogForm";
import EmergencyInformationLog from "../components/documents/EmergencyInformationLog";
import EmergencyInformationLogForm from "../components/forms/EmergencyInformationLogForm";
import MonthlyMedicationRecord from "../components/documents/MonthlyMedicationRecord";
import MonthlyMedicationRecordForm from "../components/forms/MonthlyMedicationRecordForm";
import MedicationDestructionRecord from "../components/documents/MedicationDestructionRecord";
import MedicationDestructionRecordForm from "../components/forms/MedicationDestructionRecordForm";
import DentalTreatmentRecord from "../components/documents/DentalTreatmentRecord";
import DentalTreatmentRecordForm from "../components/forms/DentalTreatmentRecordForm";
import CAForm from "../components/documents/CAForm";
import CAFormForm from "../components/forms/CAFormForm";
import SAForm from "../components/documents/SAForm";
import SAFormForm from "../components/forms/SAFormForm";
import CRMCIA from "../components/documents/CRMCIA";
import CRMCIAForm from "../components/forms/CRMCIAForm";
import PlacementApplication from "../components/documents/PlacementApplication";
import PlacementApplicationForm from "../components/forms/PlacementApplicationForm";
import Checklist from "../components/documents/Checklist";
import ChecklistForm from "../components/forms/ChecklistForm";

// todo 2. Map template names to their respective document components - just above - default;
export const getDocumentComponent = (templateName, documentData, signatureLabels = {}) => {
  switch (templateName) {
    case "N.O.A.":
      return <NoticeOfAction data={documentData} signatureLabels={signatureLabels} />;
    case "ID-Emergency Info":
      return <IDEmergencyInfo data={documentData} signatureLabels={signatureLabels} />;
    case "Agency to Agency Agreement":
      return <AgencyToAgencyAgreement data={documentData} signatureLabels={signatureLabels} />;
    case "Agency to Foster Parent":
      return <AgencyToFosterParent data={documentData} signatureLabels={signatureLabels} />;
    case "Client Grievance Guidelines":
      return <ClientGrievanceGuidelines data={documentData} signatureLabels={signatureLabels} />;
    case "County Worker Grievance Guidelines":
      return <CountyWorkerGrievanceGuidelines data={documentData} signatureLabels={signatureLabels} />;
    case "CHPD":
      return <CHPD data={documentData} signatureLabels={signatureLabels} />;
    case "Medical Treatment":
      return <MedicalTreatment data={documentData} signatureLabels={signatureLabels} />;
    case "PRN Authorization Letter":
      return <PRNAuthorizationLetter data={documentData} signatureLabels={signatureLabels} />;
    case "PRN Page 2":
      return <PRNPage2 data={documentData} signatureLabels={signatureLabels} />;
    case "Client Personal Rights":
      return <ClientPersonalRights data={documentData} signatureLabels={signatureLabels} />;
    case "Confirm TB Test":
      return <ConfirmTBTest data={documentData} signatureLabels={signatureLabels} />;
    case "Confirm Ambulatory Status":
      return <ConfirmAmbulatoryStatus data={documentData} signatureLabels={signatureLabels} />;
    case "Record of Client Cash Resources":
      return <ClientCashResources data={documentData} signatureLabels={signatureLabels} />;
    case "Client Initial Care Plan":
      return <ClientInitialCarePlan data={documentData} signatureLabels={signatureLabels} />;
    case "Client Disciplinary P. & P.":
      return <ClientDisciplinaryPP data={documentData} signatureLabels={signatureLabels} />;
    case "Client Discharge":
      return <ClientDischarge data={documentData} signatureLabels={signatureLabels} />;
    case "Acknowledgement of Prior Info":
      return <AcknowledgementOfPriorInfo data={documentData} signatureLabels={signatureLabels} />;
    case "Home Placement Log":
      return <HomePlacementLog data={documentData} signatureLabels={signatureLabels} />;
    case "Emergency Information Log":
      return <EmergencyInformationLog data={documentData} signatureLabels={signatureLabels} />;
    case "Monthly Medication Record":
      return <MonthlyMedicationRecord data={documentData} signatureLabels={signatureLabels} />;
    case "Medication & Destruction Record":
      return <MedicationDestructionRecord data={documentData} signatureLabels={signatureLabels} />;
    case "Dental Treatment Record":
      return <DentalTreatmentRecord data={documentData} signatureLabels={signatureLabels} />;
    case "CA Form":
      return <CAForm data={documentData} signatureLabels={signatureLabels} />;
    case "Spending Allowance":
      return <SAForm data={documentData} signatureLabels={signatureLabels} />;
    case "CRMCIA":
      return <CRMCIA data={documentData} signatureLabels={signatureLabels} />;
    case "Placement Application":
      return <PlacementApplication data={documentData} signatureLabels={signatureLabels} />;
    case "Checklist":
      return <Checklist data={documentData} signatureLabels={signatureLabels} />;

    default:
      // Default component for unknown templates
      return (
        <div>
          <h3>Template Not Implemented</h3>
          <p>The template "{templateName}" has not been implemented yet.</p>
        </div>
      );
  }
};

// todo 3. Map template names to their respective form components todo
export const getFormComponent = (
  templateName,
  documentData,
  handleInputChange
) => {
  switch (templateName) {
    case "N.O.A.":
      return (
        <NoticeOfActionForm
          data={documentData}
          handleInputChange={handleInputChange}
        />
      );
    case "ID-Emergency Info":
      return (
        <IDEmergencyInfoForm
          data={documentData}
          handleInputChange={handleInputChange}
        />
      );
    case "Agency to Agency Agreement":
      return (
        <AgencyToAgencyAgreementForm
          data={documentData}
          handleInputChange={handleInputChange}
        />
      );
    case "Agency to Foster Parent":
      return (
        <AgencyToFosterParentForm
          data={documentData}
          handleInputChange={handleInputChange}
        />
      );
    case "Client Grievance Guidelines":
      return (
        <ClientGrievanceGuidelinesForm
          data={documentData}
          handleInputChange={handleInputChange}
        />
      );
    case "County Worker Grievance Guidelines":
      return (
        <CountyWorkerGrievanceGuidelinesForm
          data={documentData}
          handleInputChange={handleInputChange}
        />
      );
    case "CHPD":
      return (
        <CHPDForm data={documentData} handleInputChange={handleInputChange} />
      );
    case "Medical Treatment":
      return (
        <MedicalTreatmentForm
          data={documentData}
          handleInputChange={handleInputChange}
        />
      );
    case "PRN Authorization Letter":
      return (
        <PRNAuthorizationLetterForm
          data={documentData}
          handleInputChange={handleInputChange}
        />
      );
    case "PRN Page 2":
      return (
        <PRNPage2Form
          data={documentData}
          handleInputChange={handleInputChange}
        />
      );
    case "Client Personal Rights":
      return (
        <ClientPersonalRightsForm
          data={documentData}
          handleInputChange={handleInputChange}
        />
      );
    case "Confirm TB Test":
      return (
        <ConfirmTBTestForm
          data={documentData}
          handleInputChange={handleInputChange}
        />
      );
    case "Confirm Ambulatory Status":
      return (
        <ConfirmAmbulatoryStatusForm
          data={documentData}
          handleInputChange={handleInputChange}
        />
      );
    case "Record of Client Cash Resources":
      return (
        <ClientCashResourcesForm
          data={documentData}
          handleInputChange={handleInputChange}
        />
      );
    case "Client Initial Care Plan":
      return (
        <ClientInitialCarePlanForm
          data={documentData}
          handleInputChange={handleInputChange}
        />
      );
    case "Client Disciplinary P. & P.":
      return (
        <ClientDisciplinaryPPForm
          data={documentData}
          handleInputChange={handleInputChange}
        />
      );
    case "Client Discharge":
      return (
        <ClientDischargeForm
          data={documentData}
          handleInputChange={handleInputChange}
        />
      );
    case "Acknowledgement of Prior Info":
      return (
        <AcknowledgementOfPriorInfoForm
          data={documentData}
          handleInputChange={handleInputChange}
        />
      );
    case "Home Placement Log":
      return (
        <HomePlacementLogForm
          data={documentData}
          handleInputChange={handleInputChange}
        />
      );
    case "Emergency Information Log":
      return (
        <EmergencyInformationLogForm
          data={documentData}
          handleInputChange={handleInputChange}
        />
      );
    case "Monthly Medication Record":
      return (
        <MonthlyMedicationRecordForm
          data={documentData}
          handleInputChange={handleInputChange}
        />
      );
    case "Medication & Destruction Record":
      return (
        <MedicationDestructionRecordForm
          data={documentData}
          handleInputChange={handleInputChange}
        />
      );
    case "Dental Treatment Record":
      return (
        <DentalTreatmentRecordForm
          data={documentData}
          handleInputChange={handleInputChange}
        />
      );
    case "CA Form":
      return (
        <CAFormForm data={documentData} handleInputChange={handleInputChange} />
      );
    case "Spending Allowance":
      return (
        <SAFormForm data={documentData} handleInputChange={handleInputChange} />
      );
    case "CRMCIA":
      return (
        <CRMCIAForm data={documentData} handleInputChange={handleInputChange} />
      );
    case "Placement Application":
      return (
        <PlacementApplicationForm
          data={documentData}
          handleInputChange={handleInputChange}
        />
      );
    case "Checklist":
      return (
        <ChecklistForm
          data={documentData}
          handleInputChange={handleInputChange}
        />
      );
    default:
      return (
        <div>
          <p>The form for "{templateName}" has not been implemented yet.</p>
        </div>
      );
  }
};
