import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CandidateStationRoute } from "../types/recommendation";
import { formatDuration, formatDistance, formatFare } from "../utils/formatters";

interface StationCardProps {
  item: CandidateStationRoute;
  isRecommended?: boolean;
}

export const StationCard: React.FC<StationCardProps> = ({
  item,
  isRecommended = false
}) => {
  const { station, durationSeconds, distanceMeters, estimatedFare, status } = item;

  return (
    <View style={[styles.card, isRecommended ? styles.recommendedCard : styles.alternativeCard]}>
      {isRecommended && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>★ Recommended Metro Access</Text>
        </View>
      )}

      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={[styles.stationName, isRecommended && styles.recommendedTitle]}>
            {station.name}
          </Text>
          <Text style={styles.lineTag}>{station.line || "Metro Line"}</Text>
        </View>
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>TRAVEL TIME</Text>
          <Text style={styles.metricValue}>{formatDuration(durationSeconds)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>DISTANCE</Text>
          <Text style={styles.metricValue}>{formatDistance(distanceMeters)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>EST. FARE</Text>
          <Text style={styles.fareValue}>
            {formatFare(estimatedFare)}
          </Text>
        </View>
      </View>

      <Text style={styles.estimateNotice}>* Fare is an estimate based on mode & distance</Text>

      {status !== "OK" && (
        <View style={styles.statusBanner}>
          <Text style={styles.statusText}>
            {status === "NO_KEY"
              ? "Routing API key unconfigured"
              : "Route unavailable"}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  recommendedCard: {
    backgroundColor: "#EFF6FF",
    borderWidth: 2,
    borderColor: "#3B82F6"
  },
  alternativeCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#2563EB",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700"
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  titleContainer: {
    flex: 1
  },
  stationName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B"
  },
  recommendedTitle: {
    color: "#1E3A8A",
    fontSize: 20
  },
  lineTag: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
    marginTop: 2
  },
  metricsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    marginTop: 12
  },
  metricItem: {
    flex: 1,
    alignItems: "center"
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
    marginBottom: 2
  },
  metricValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A"
  },
  fareValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#059669"
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: "#E2E8F0"
  },
  estimateNotice: {
    fontSize: 10,
    color: "#94A3B8",
    fontStyle: "italic",
    marginTop: 8,
    textAlign: "right"
  },
  statusBanner: {
    marginTop: 8,
    backgroundColor: "#FEF2F2",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6
  },
  statusText: {
    fontSize: 11,
    color: "#DC2626",
    fontWeight: "500"
  }
});
