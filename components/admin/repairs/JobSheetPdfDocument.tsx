import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import contactConfig from "@/config/contact";
import {
  JobSheetData,
  STANDARD_REPAIR_TERMS,
  isChecklistPending,
} from "@/lib/admin/jobsheet";

// Register styles for React-PDF (using points, numbers, and standard Helvetica)
const styles = StyleSheet.create({
  page: {
    paddingTop: 18,
    paddingBottom: 18,
    paddingHorizontal: 22,
    fontFamily: "Helvetica",
    fontSize: 7.5,
    color: "#18181b",
    backgroundColor: "#ffffff",
  },
  container: {
    borderWidth: 1,
    borderColor: "#d4d4d8",
    borderRadius: 4,
    padding: 12,
  },

  // 1. Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1.5,
    borderBottomColor: "#18181b",
    paddingBottom: 8,
    marginBottom: 8,
  },
  brandCol: {
    flexDirection: "row",
    alignItems: "flex-start",
    maxWidth: "60%",
  },
  logo: {
    width: 38,
    height: 38,
    marginRight: 8,
    borderRadius: 4,
  },
  brandTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
  },
  brandTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#09090b",
    marginRight: 5,
  },
  legalBadge: {
    backgroundColor: "#ffedd5",
    borderRadius: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  legalBadgeText: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    color: "#9a3412",
    textTransform: "uppercase",
  },
  tagline: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#ea580c",
    marginBottom: 2,
  },
  addressText: {
    fontSize: 6.5,
    color: "#52525b",
    lineHeight: 1.2,
    marginBottom: 2,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 6.5,
    color: "#52525b",
  },
  contactBold: {
    fontFamily: "Helvetica-Bold",
    color: "#27272a",
  },

  // Meta Badge
  metaCol: {
    alignItems: "flex-end",
    maxWidth: "38%",
  },
  badgePill: {
    backgroundColor: "#18181b",
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 4,
  },
  badgePillText: {
    color: "#ffffff",
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  metaLabel: {
    fontSize: 6.5,
    color: "#71717a",
    textTransform: "uppercase",
  },
  metaJobNumber: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#09090b",
  },
  metaText: {
    fontSize: 7,
    color: "#3f3f46",
    marginTop: 1,
  },
  modePill: {
    backgroundColor: "#f4f4f5",
    borderWidth: 0.5,
    borderColor: "#e4e4e7",
    borderRadius: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginTop: 3,
  },
  modePillText: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: "#27272a",
    textTransform: "uppercase",
  },

  // 2. Customer & Device Block
  twoColSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  colBox: {
    width: "49%",
    borderWidth: 0.75,
    borderColor: "#e4e4e7",
    borderRadius: 3,
    padding: 6,
    backgroundColor: "#fafafa",
  },
  boxHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e4e4e7",
    paddingBottom: 2,
    marginBottom: 4,
  },
  boxHeaderTitle: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: "#3f3f46",
    textTransform: "uppercase",
  },
  boxHeaderSubtitle: {
    fontSize: 6,
    color: "#a1a1aa",
  },
  boxName: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#09090b",
    marginBottom: 2,
  },
  boxRow: {
    fontSize: 7,
    color: "#3f3f46",
    marginBottom: 1.5,
    lineHeight: 1.25,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },

  // Checklist
  checklistSection: {
    borderWidth: 0.75,
    borderColor: "#e4e4e7",
    borderRadius: 3,
    padding: 6,
    backgroundColor: "#fafafa",
    marginBottom: 6,
  },
  checklistHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e4e4e7",
    paddingBottom: 2,
  },
  checklistTitle: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: "#27272a",
    textTransform: "uppercase",
  },
  checklistStatusBadge: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  checklistStatusText: {
    fontSize: 5.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  checklistGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  checklistItem: {
    width: "19%",
    borderWidth: 0.5,
    borderColor: "#e4e4e7",
    borderRadius: 2,
    padding: 3,
    backgroundColor: "#ffffff",
    marginBottom: 3,
  },
  itemTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f4f4f5",
    paddingBottom: 1,
  },
  itemTitle: {
    fontSize: 5.5,
    fontFamily: "Helvetica-Bold",
    color: "#27272a",
  },
  itemBadgePass: {
    fontSize: 5,
    fontFamily: "Helvetica-Bold",
    color: "#15803d",
    backgroundColor: "#dcfce7",
    paddingHorizontal: 2,
    borderRadius: 1,
  },
  itemBadgeFail: {
    fontSize: 5,
    fontFamily: "Helvetica-Bold",
    color: "#b91c1c",
    backgroundColor: "#fee2e2",
    paddingHorizontal: 2,
    borderRadius: 1,
  },
  itemBadgePending: {
    fontSize: 5,
    color: "#a1a1aa",
  },
  itemValueText: {
    fontSize: 5.5,
    color: "#52525b",
  },

  // Notes
  notesSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  notesBox: {
    width: "49%",
    borderWidth: 0.75,
    borderColor: "#e4e4e7",
    borderRadius: 3,
    padding: 6,
    backgroundColor: "#fafafa",
  },
  notesTitle: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: "#3f3f46",
    textTransform: "uppercase",
    marginBottom: 3,
  },
  notesContent: {
    fontSize: 6.5,
    color: "#18181b",
    backgroundColor: "#ffffff",
    borderWidth: 0.5,
    borderColor: "#e4e4e7",
    borderRadius: 2,
    padding: 4,
    minHeight: 28,
    lineHeight: 1.3,
  },

  // Pricing Table
  table: {
    borderWidth: 0.75,
    borderColor: "#d4d4d8",
    borderRadius: 3,
    marginBottom: 6,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#27272a",
    paddingVertical: 3,
    paddingHorizontal: 4,
  },
  tableHeaderCol: {
    color: "#ffffff",
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e4e4e7",
    paddingVertical: 2.5,
    paddingHorizontal: 4,
  },
  tableColNum: { width: "6%", textAlign: "center", fontSize: 6.5, color: "#71717a" },
  tableColDesc: { width: "52%", fontSize: 6.5, color: "#09090b" },
  tableColType: { width: "16%", textAlign: "center", fontSize: 6, color: "#52525b", textTransform: "capitalize" },
  tableColQty: { width: "10%", textAlign: "center", fontSize: 6.5, color: "#52525b" },
  tableColPrice: { width: "16%", textAlign: "right", fontSize: 6.5, fontFamily: "Helvetica-Bold", color: "#09090b" },

  subtotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fafafa",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e4e4e7",
    paddingVertical: 2,
    paddingHorizontal: 6,
    fontSize: 6.5,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f4f4f5",
    borderTopWidth: 1,
    borderTopColor: "#18181b",
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff7ed",
    paddingVertical: 2.5,
    paddingHorizontal: 6,
  },

  // Terms
  termsSection: {
    borderWidth: 0.75,
    borderColor: "#e4e4e7",
    borderRadius: 3,
    padding: 5,
    backgroundColor: "#fafafa",
    marginBottom: 6,
  },
  termsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e4e4e7",
    paddingBottom: 2,
    marginBottom: 3,
  },
  termsTitle: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    color: "#27272a",
    textTransform: "uppercase",
  },
  termsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  termItem: {
    width: "49%",
    marginBottom: 2,
    fontSize: 5.5,
    color: "#52525b",
    lineHeight: 1.25,
  },

  // Signatures
  signatureSection: {
    borderTopWidth: 1,
    borderTopColor: "#18181b",
    paddingTop: 5,
    marginBottom: 4,
  },
  declarationText: {
    fontSize: 5.5,
    color: "#52525b",
    textAlign: "center",
    marginBottom: 6,
    fontStyle: "italic",
  },
  sigRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  sigCol: {
    width: "30%",
    alignItems: "center",
  },
  sigLine: {
    width: "100%",
    borderBottomWidth: 0.75,
    borderBottomColor: "#a1a1aa",
    borderBottomStyle: "dashed",
    height: 18,
    marginBottom: 3,
  },
  sealBox: {
    width: "32%",
    borderWidth: 0.75,
    borderColor: "#d4d4d8",
    borderStyle: "dashed",
    borderRadius: 3,
    padding: 4,
    alignItems: "center",
  },
  sealLabel: {
    fontSize: 5,
    fontFamily: "Helvetica-Bold",
    color: "#a1a1aa",
    textTransform: "uppercase",
  },
  sealName: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    color: "#3f3f46",
    marginTop: 1,
  },
  sigLabel: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: "#09090b",
  },
  sigSubtext: {
    fontSize: 5.5,
    color: "#71717a",
  },

  // Footer
  footer: {
    textAlign: "center",
    fontSize: 5.5,
    color: "#a1a1aa",
    borderTopWidth: 0.5,
    borderTopColor: "#f4f4f5",
    paddingTop: 3,
  },
});

export interface JobSheetPdfDocumentProps {
  data: JobSheetData;
  logoSrc?: string;
}

export const JobSheetPdfDocument: React.FC<JobSheetPdfDocumentProps> = ({
  data,
  logoSrc,
}) => {
  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null || isNaN(amount)) return "Rs. 0";
    return `Rs. ${amount.toLocaleString("en-IN")}`;
  };

  const formattedDate = data.date
    ? new Date(data.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  const checklistItems = [
    {
      num: "1",
      title: "Power On",
      status:
        data.checklist?.powerOn === "yes"
          ? "PASS"
          : data.checklist?.powerOn === "no"
          ? "FAIL"
          : "PENDING",
      value:
        data.checklist?.powerOn === "yes"
          ? "Powers On"
          : data.checklist?.powerOn === "no"
          ? "No Power"
          : "Pending",
    },
    {
      num: "2",
      title: "Screen",
      status:
        data.checklist?.screenCondition === "good"
          ? "PASS"
          : data.checklist?.screenCondition &&
            data.checklist?.screenCondition !== "untested"
          ? "FAULT"
          : "PENDING",
      value:
        data.checklist?.screenCondition === "good"
          ? "Clear/Intact"
          : data.checklist?.screenCondition === "cracked"
          ? "Cracked"
          : data.checklist?.screenCondition === "scratched"
          ? "Scratched"
          : data.checklist?.screenCondition === "no_display"
          ? "Blank"
          : "Pending",
    },
    {
      num: "3",
      title: "Touch",
      status:
        data.checklist?.touchFunction === "working"
          ? "PASS"
          : data.checklist?.touchFunction === "faulty"
          ? "FAULT"
          : "PENDING",
      value:
        data.checklist?.touchFunction === "working"
          ? "Responsive"
          : data.checklist?.touchFunction === "faulty"
          ? "Faulty"
          : "Pending",
    },
    {
      num: "4",
      title: "Body/Frame",
      status:
        data.checklist?.backGlassBody === "good"
          ? "PASS"
          : data.checklist?.backGlassBody &&
            data.checklist?.backGlassBody !== "untested"
          ? "FAULT"
          : "PENDING",
      value:
        data.checklist?.backGlassBody === "good"
          ? "Intact"
          : data.checklist?.backGlassBody || "Pending",
    },
    {
      num: "5",
      title: "Cameras",
      status:
        data.checklist?.frontCamera === "working" &&
        data.checklist?.rearCamera === "working"
          ? "PASS"
          : (data.checklist?.frontCamera &&
              data.checklist?.frontCamera !== "untested" &&
              data.checklist?.frontCamera !== "working") ||
            (data.checklist?.rearCamera &&
              data.checklist?.rearCamera !== "untested" &&
              data.checklist?.rearCamera !== "working")
          ? "FAULT"
          : "PENDING",
      value:
        data.checklist?.frontCamera === "working" &&
        data.checklist?.rearCamera === "working"
          ? "Both Clear"
          : "Check intake",
    },
    {
      num: "6",
      title: "Charging",
      status:
        data.checklist?.chargingPort === "working"
          ? "PASS"
          : data.checklist?.chargingPort &&
            data.checklist?.chargingPort !== "untested"
          ? "FAULT"
          : "PENDING",
      value:
        data.checklist?.chargingPort === "working"
          ? "Charges OK"
          : data.checklist?.chargingPort || "Pending",
    },
    {
      num: "7",
      title: "Battery",
      status:
        data.checklist?.batteryCondition === "normal"
          ? "PASS"
          : data.checklist?.batteryCondition &&
            data.checklist?.batteryCondition !== "untested"
          ? "FAULT"
          : "PENDING",
      value:
        data.checklist?.batteryCondition === "normal"
          ? "Normal"
          : data.checklist?.batteryCondition || "Pending",
    },
    {
      num: "8",
      title: "Audio",
      status:
        data.checklist?.speakerEarpiece === "working" &&
        data.checklist?.microphone === "working"
          ? "PASS"
          : (data.checklist?.speakerEarpiece &&
              data.checklist?.speakerEarpiece !== "untested" &&
              data.checklist?.speakerEarpiece !== "working") ||
            (data.checklist?.microphone &&
              data.checklist?.microphone !== "untested" &&
              data.checklist?.microphone !== "working")
          ? "FAULT"
          : "PENDING",
      value:
        data.checklist?.speakerEarpiece === "working" &&
        data.checklist?.microphone === "working"
          ? "Clear"
          : "Check intake",
    },
    {
      num: "9",
      title: "WiFi/Network",
      status:
        data.checklist?.networkWifi === "working"
          ? "PASS"
          : data.checklist?.networkWifi === "faulty"
          ? "FAULT"
          : "PENDING",
      value:
        data.checklist?.networkWifi === "working"
          ? "Connects OK"
          : data.checklist?.networkWifi || "Pending",
    },
    {
      num: "10",
      title: "Liquid Damage",
      status:
        data.checklist?.liquidDamage === "none"
          ? "PASS"
          : data.checklist?.liquidDamage &&
            data.checklist?.liquidDamage !== "untested"
          ? "FAULT"
          : "PENDING",
      value:
        data.checklist?.liquidDamage === "none"
          ? "No Moisture"
          : data.checklist?.liquidDamage || "Pending",
    },
  ];

  return (
    <Document title={`QuickFix_JobSheet_${data.jobSheetNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* 1. Header */}
          <View style={styles.header}>
            <View style={styles.brandCol}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              {logoSrc ? <Image src={logoSrc} style={styles.logo} /> : null}
              <View>
                <View style={styles.brandTitleRow}>
                  <Text style={styles.brandTitle}>{contactConfig.brand}</Text>
                  <View style={styles.legalBadge}>
                    <Text style={styles.legalBadgeText}>
                      {contactConfig.legalName}
                    </Text>
                  </View>
                </View>
                <Text style={styles.tagline}>{contactConfig.tagline}</Text>
                <Text style={styles.addressText}>{contactConfig.address.full}</Text>
                <View style={styles.contactRow}>
                  <Text>
                    <Text style={styles.contactBold}>Helpline: </Text>
                    {contactConfig.phone.display} •{" "}
                  </Text>
                  <Text>
                    <Text style={styles.contactBold}>Email: </Text>
                    {contactConfig.email} •{" "}
                  </Text>
                  <Text>
                    <Text style={styles.contactBold}>Hours: </Text>
                    {contactConfig.hours.time}
                  </Text>
                </View>
              </View>
            </View>

            {/* Meta Right */}
            <View style={styles.metaCol}>
              <View style={styles.badgePill}>
                <Text style={styles.badgePillText}>Mobile Repair Job Sheet</Text>
              </View>
              <Text style={styles.metaLabel}>Job Sheet No.</Text>
              <Text style={styles.metaJobNumber}>{data.jobSheetNumber}</Text>
              <Text style={styles.metaText}>
                Ref: <Text style={styles.bold}>{data.bookingReference}</Text>
              </Text>
              <Text style={styles.metaText}>
                Date: <Text style={styles.bold}>{formattedDate}</Text>
              </Text>
              <View style={styles.modePill}>
                <Text style={styles.modePillText}>
                  Mode: {data.serviceMode?.replace("_", " ")}
                </Text>
              </View>
            </View>
          </View>

          {/* 2. Customer & Device Details */}
          <View style={styles.twoColSection}>
            {/* Customer */}
            <View style={styles.colBox}>
              <View style={styles.boxHeader}>
                <Text style={styles.boxHeaderTitle}>Customer Details</Text>
                <Text style={styles.boxHeaderSubtitle}>Pune Region</Text>
              </View>
              <Text style={styles.boxName}>{data.customer?.name}</Text>
              <Text style={styles.boxRow}>
                Phone: <Text style={styles.bold}>{data.customer?.phone}</Text>
                {data.customer?.alternatePhone ? ` | Alt: ${data.customer.alternatePhone}` : ""}
              </Text>
              {data.customer?.email && (
                <Text style={styles.boxRow}>Email: {data.customer.email}</Text>
              )}
              <Text style={styles.boxRow}>
                Address: {data.customer?.address}, {data.customer?.area},{" "}
                {data.customer?.city} - {data.customer?.pincode}
                {data.customer?.landmark ? ` (Landmark: ${data.customer.landmark})` : ""}
              </Text>
            </View>

            {/* Device */}
            <View style={styles.colBox}>
              <View style={styles.boxHeader}>
                <Text style={styles.boxHeaderTitle}>Device & Intake Specs</Text>
                <Text style={styles.boxHeaderSubtitle}>{data.device?.brand}</Text>
              </View>
              <Text style={styles.boxName}>
                {data.device?.brand} {data.device?.model}
                {data.device?.color ? ` (${data.device.color})` : ""}
              </Text>
              <Text style={styles.boxRow}>
                IMEI / Serial:{" "}
                <Text style={styles.bold}>
                  {data.device?.imeiOrSerial || "To be logged by tech"}
                </Text>
              </Text>
              <Text style={styles.boxRow}>
                Screen Lock / PIN:{" "}
                <Text style={styles.bold}>
                  {data.device?.passcodePattern || "To be verified at intake"}
                </Text>
              </Text>
              <Text style={styles.boxRow}>
                Accessories:{" "}
                <Text style={styles.bold}>
                  {[
                    data.accessories?.simTray ? "SIM Tray" : null,
                    data.accessories?.simCard ? "SIM Card" : null,
                    data.accessories?.memoryCard ? "SD Card" : null,
                    data.accessories?.protectiveCase ? "Case" : null,
                    data.accessories?.chargerCable ? "Charger" : null,
                    data.accessories?.other || null,
                  ]
                    .filter(Boolean)
                    .join(", ") || "Device only"}
                </Text>
              </Text>
            </View>
          </View>

          {/* 3. Diagnostic Intake Checklist */}
          <View style={styles.checklistSection}>
            <View style={styles.checklistHeader}>
              <Text style={styles.checklistTitle}>
                Pre-Repair Physical & Diagnostic Intake Checklist
              </Text>
              <View
                style={[
                  styles.checklistStatusBadge,
                  {
                    backgroundColor: isChecklistPending(data.checklist)
                      ? "#fef3c7"
                      : "#dcfce7",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.checklistStatusText,
                    {
                      color: isChecklistPending(data.checklist)
                        ? "#92400e"
                        : "#166534",
                    },
                  ]}
                >
                  {isChecklistPending(data.checklist)
                    ? "Pending Intake Verification"
                    : "Physically Verified"}
                </Text>
              </View>
            </View>

            <View style={styles.checklistGrid}>
              {checklistItems.map((item, idx) => (
                <View key={idx} style={styles.checklistItem}>
                  <View style={styles.itemTitleRow}>
                    <Text style={styles.itemTitle}>
                      {item.num}. {item.title}
                    </Text>
                    {item.status === "PASS" ? (
                      <Text style={styles.itemBadgePass}>PASS</Text>
                    ) : item.status === "FAIL" || item.status === "FAULT" ? (
                      <Text style={styles.itemBadgeFail}>FAULT</Text>
                    ) : (
                      <Text style={styles.itemBadgePending}>—</Text>
                    )}
                  </View>
                  <Text style={styles.itemValueText}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 4. Reported Fault & Workshop Notes */}
          <View style={styles.notesSection}>
            <View style={styles.notesBox}>
              <Text style={styles.notesTitle}>
                Customer Reported Problem / Fault:
              </Text>
              <Text style={styles.notesContent}>
                {data.reportedFault || "Diagnostic check requested by customer"}
                {data.primaryServiceName ? `\nCategory: ${data.primaryServiceName}` : ""}
              </Text>
            </View>

            <View style={styles.notesBox}>
              <Text style={styles.notesTitle}>
                Technician Diagnostic Findings & Workshop Notes:
              </Text>
              <Text style={styles.notesContent}>
                {data.workshopNotes || "To be recorded during workshop inspection..."}
              </Text>
            </View>
          </View>

          {/* 5. Itemized Pricing Table */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCol, styles.tableColNum]}>#</Text>
              <Text style={[styles.tableHeaderCol, styles.tableColDesc]}>
                Service / Spare Part Description
              </Text>
              <Text style={[styles.tableHeaderCol, styles.tableColType]}>Type</Text>
              <Text style={[styles.tableHeaderCol, styles.tableColQty]}>Qty</Text>
              <Text style={[styles.tableHeaderCol, styles.tableColPrice]}>Price</Text>
            </View>

            {data.items && data.items.length > 0 ? (
              data.items.map((item, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={styles.tableColNum}>{idx + 1}</Text>
                  <Text style={styles.tableColDesc}>{item.description}</Text>
                  <Text style={styles.tableColType}>{item.type}</Text>
                  <Text style={styles.tableColQty}>{item.quantity}</Text>
                  <Text style={styles.tableColPrice}>
                    {formatCurrency(item.totalPrice)}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <Text style={styles.tableColNum}>1</Text>
                <Text style={styles.tableColDesc}>
                  {data.primaryServiceName} ({data.device?.brand} {data.device?.model})
                </Text>
                <Text style={styles.tableColType}>Service</Text>
                <Text style={styles.tableColQty}>1</Text>
                <Text style={styles.tableColPrice}>
                  {formatCurrency(data.totalAmount)}
                </Text>
              </View>
            )}

            {/* Travel Fee */}
            <View style={styles.subtotalRow}>
              <Text style={{ color: "#52525b" }}>
                Doorstep Convenience & Travel Charge:
              </Text>
              <Text style={{ fontFamily: "Helvetica-Bold", color: "#15803d" }}>
                FREE (Zero Pune Travel Fee)
              </Text>
            </View>

            {data.diagnosticFee > 0 && (
              <View style={styles.subtotalRow}>
                <Text style={{ color: "#52525b" }}>Inspection / Diagnostic Fee:</Text>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>
                  {formatCurrency(data.diagnosticFee)}
                </Text>
              </View>
            )}

            {data.discount > 0 && (
              <View style={styles.subtotalRow}>
                <Text style={{ color: "#15803d" }}>Promotional Discount:</Text>
                <Text style={{ fontFamily: "Helvetica-Bold", color: "#15803d" }}>
                  -{formatCurrency(data.discount)}
                </Text>
              </View>
            )}

            {/* Total Row */}
            <View style={styles.totalRow}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 6.5, fontFamily: "Helvetica-Bold", marginRight: 4 }}>
                  PAYMENT STATUS:
                </Text>
                <Text
                  style={{
                    fontSize: 6.5,
                    fontFamily: "Helvetica-Bold",
                    color: data.paymentStatus === "paid" ? "#15803d" : "#b45309",
                  }}
                >
                  {data.paymentStatus === "paid"
                    ? "PAID IN FULL"
                    : data.paymentStatus === "cod"
                    ? "CASH ON DELIVERY (COD)"
                    : "UNPAID (DUE ON DELIVERY)"}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                <Text style={{ fontSize: 6.5, color: "#52525b", marginRight: 4 }}>
                  TOTAL ESTIMATE:
                </Text>
                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold" }}>
                  {formatCurrency(data.totalAmount)}
                </Text>
              </View>
            </View>

            {/* Advance & Balance */}
            <View style={styles.subtotalRow}>
              <Text style={{ color: "#71717a", fontSize: 6 }}>
                Warranty: {data.warrantyPeriod || "90-Day QuickFix Guarantee"} on replaced components.
              </Text>
              <Text style={{ color: "#3f3f46" }}>
                Advance Paid: {formatCurrency(data.advancePaid)}
              </Text>
            </View>

            <View style={styles.balanceRow}>
              <Text style={{ fontSize: 6, color: "#7c2d12" }}>
                *Transparent pricing • No hidden fees • No Fix, No Fee promise.
              </Text>
              <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                <Text
                  style={{
                    fontSize: 6.5,
                    fontFamily: "Helvetica-Bold",
                    color: "#9a3412",
                    marginRight: 4,
                  }}
                >
                  BALANCE DUE:
                </Text>
                <Text
                  style={{
                    fontSize: 8.5,
                    fontFamily: "Helvetica-Bold",
                    color: "#c2410c",
                  }}
                >
                  {formatCurrency(data.balanceDue)}
                </Text>
              </View>
            </View>
          </View>

          {/* 6. Standard Terms */}
          <View style={styles.termsSection}>
            <View style={styles.termsHeader}>
              <Text style={styles.termsTitle}>
                Standard Terms & Conditions for Mobile Device Service
              </Text>
              <Text style={{ fontSize: 5.5, color: "#71717a" }}>QuickFix.in Policy</Text>
            </View>
            <View style={styles.termsGrid}>
              {STANDARD_REPAIR_TERMS.map((term, i) => (
                <Text key={i} style={styles.termItem}>
                  <Text style={styles.bold}>{i + 1}. {term.title}: </Text>
                  {term.text}
                </Text>
              ))}
            </View>
          </View>

          {/* 7. Dual Signature */}
          <View style={styles.signatureSection}>
            <Text style={styles.declarationText}>
              Customer Declaration: I hereby acknowledge the physical condition checklist, verify the device intake state, and consent to the repair terms and conditions outlined above.
            </Text>
            <View style={styles.sigRow}>
              <View style={styles.sigCol}>
                <View style={styles.sigLine} />
                <Text style={styles.sigLabel}>Customer Signature</Text>
                <Text style={styles.sigSubtext}>Date: ____________________</Text>
              </View>

              <View style={styles.sealBox}>
                <Text style={styles.sealLabel}>Official Hub Seal</Text>
                <Text style={styles.sealName}>QuickFix Sadashiv Peth</Text>
                <Text style={{ fontSize: 5, color: "#71717a" }}>Pune - 411030</Text>
              </View>

              <View style={styles.sigCol}>
                <View style={styles.sigLine} />
                <Text style={styles.sigLabel}>Authorized Signatory</Text>
                <Text style={styles.sigSubtext}>Date: ____________________</Text>
              </View>
            </View>
          </View>

          {/* 8. Footer */}
          <Text style={styles.footer}>
            This is a computer-generated mobile repair job card issued by {contactConfig.legalName}. For support, call {contactConfig.phone.display} or email {contactConfig.email}.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default JobSheetPdfDocument;
