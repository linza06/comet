import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  StatusBar as RNStatusBar
} from "react-native";
import * as Location from "expo-location";
import { fetchRecommendations } from "../api/recommendations";
import {
  RecommendationResponse,
  TravelMode
} from "../types/recommendation";
import { TravelModeSelector } from "../components/TravelModeSelector";
import { StationCard } from "../components/StationCard";

// Fallback / Demo location: Edapally, Kochi
const DEMO_LOCATION = {
  latitude: 10.025106,
  longitude: 76.308456,
  name: "Edapally, Kochi (Demo)"
};

export const HomeScreen: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<TravelMode>("AUTO");
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [useDemoLocation, setUseDemoLocation] = useState<boolean>(false);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] =
    useState<RecommendationResponse | null>(null);

  const obtainLocation = async () => {
    setLoading(true);
    setError(null);
    setPermissionDenied(false);

    if (useDemoLocation) {
      setLocation({
        latitude: DEMO_LOCATION.latitude,
        longitude: DEMO_LOCATION.longitude
      });
      setLoading(false);
      return;
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setPermissionDenied(true);
        // Default to demo location when permission is denied so user can still test
        setLocation({
          latitude: DEMO_LOCATION.latitude,
          longitude: DEMO_LOCATION.longitude
        });
        setLoading(false);
        return;
      }

      const currentPos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });

      setLocation({
        latitude: currentPos.coords.latitude,
        longitude: currentPos.coords.longitude
      });
    } catch (err: any) {
      console.warn("Could not get device location:", err?.message);
      // Fallback to demo location if device location fails (e.g. simulator without GPS)
      setLocation({
        latitude: DEMO_LOCATION.latitude,
        longitude: DEMO_LOCATION.longitude
      });
    } finally {
      setLoading(false);
    }
  };

  const loadData = useCallback(async () => {
    if (!location) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetchRecommendations(
        location.latitude,
        location.longitude,
        selectedMode
      );
      setRecommendations(res);
    } catch (err: any) {
      console.error("API error:", err);
      setError(err?.message || "Failed to fetch recommendations from backend.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [location, selectedMode]);

  useEffect(() => {
    obtainLocation();
  }, [useDemoLocation]);

  useEffect(() => {
    if (location) {
      loadData();
    }
  }, [location, selectedMode, loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.appTitle}>COMET</Text>
          <View style={styles.pill}>
            <Text style={styles.pillText}>Kochi Metro</Text>
          </View>
        </View>
        <Text style={styles.appSubtitle}>Smart Metro Access Planner</Text>

        <TouchableOpacity
          style={styles.demoToggle}
          onPress={() => setUseDemoLocation(!useDemoLocation)}
        >
          <Text style={styles.demoToggleText}>
            📍 Location: {useDemoLocation || permissionDenied ? "Kochi (Demo)" : "Device GPS"}{" "}
            (Tap to switch)
          </Text>
        </TouchableOpacity>
      </View>

      <TravelModeSelector
        selectedMode={selectedMode}
        onSelectMode={(mode) => setSelectedMode(mode)}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Permission Denied Banner */}
        {permissionDenied && (
          <View style={styles.warningBanner}>
            <Text style={styles.warningTitle}>Location Permission Denied</Text>
            <Text style={styles.warningText}>
              Using demo location (Edapally, Kochi) to find nearby metro stations. Grant location permission in system settings for live GPS recommendations.
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={obtainLocation}>
              <Text style={styles.retryButtonText}>Grant / Retry Permission</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Loading State */}
        {loading && !refreshing && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loadingText}>Finding best metro station...</Text>
          </View>
        )}

        {/* Error State */}
        {!loading && error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Could not connect to backend</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadData}>
              <Text style={styles.retryButtonText}>Retry Connection</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Success State */}
        {!loading && !error && recommendations && (
          <View>
            {/* Recommended Station */}
            {recommendations.recommendedStation ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>BEST RECOMMENDATION</Text>
                <StationCard
                  item={recommendations.recommendedStation}
                  isRecommended
                />
              </View>
            ) : (
              <View style={styles.noRecommendationContainer}>
                <Text style={styles.noRecommendationTitle}>No Direct Route Found</Text>
                <Text style={styles.noRecommendationText}>
                  No nearby stations with calculated routes within range for mode '{selectedMode}'. Check backend API key configuration or try another mode.
                </Text>
              </View>
            )}

            {/* Alternative Stations */}
            {recommendations.alternatives && recommendations.alternatives.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>ALTERNATIVE STATIONS</Text>
                {recommendations.alternatives.map((item, idx) => (
                  <StationCard key={item.station.id || idx} item={item} />
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC"
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0"
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  appTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: 1
  },
  pill: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  pillText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E40AF"
  },
  appSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2
  },
  demoToggle: {
    marginTop: 10,
    backgroundColor: "#F1F5F9",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start"
  },
  demoToggleText: {
    fontSize: 12,
    color: "#334155",
    fontWeight: "600"
  },
  content: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24
  },
  section: {
    marginTop: 16
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#64748B",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4
  },
  centerContainer: {
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "center"
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500"
  },
  warningBanner: {
    backgroundColor: "#FEF3C7",
    borderColor: "#F59E0B",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginTop: 12
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#92400E"
  },
  warningText: {
    fontSize: 12,
    color: "#B45309",
    marginTop: 4,
    lineHeight: 16
  },
  errorContainer: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    alignItems: "center"
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#991B1B"
  },
  errorText: {
    fontSize: 13,
    color: "#B91C1C",
    textAlign: "center",
    marginTop: 4
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: "#2563EB",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700"
  },
  noRecommendationContainer: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    alignItems: "center"
  },
  noRecommendationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155"
  },
  noRecommendationText: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18
  }
});
