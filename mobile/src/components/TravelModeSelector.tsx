import React from "react";
import { StyleSheet, Text, TouchableOpacity, ScrollView, View } from "react-native";
import { TravelMode } from "../types/recommendation";

interface ModeOption {
  mode: TravelMode;
  label: string;
  icon: string;
}

const MODES: ModeOption[] = [
  { mode: "AUTO", label: "Auto", icon: "🛺" },
  { mode: "DRIVE", label: "Drive", icon: "🚗" },
  { mode: "TWO_WHEELER", label: "2-Wheeler", icon: "🛵" },
  { mode: "WALK", label: "Walk", icon: "🚶" },
  { mode: "BICYCLE", label: "Bicycle", icon: "🚲" }
];

interface TravelModeSelectorProps {
  selectedMode: TravelMode;
  onSelectMode: (mode: TravelMode) => void;
}

export const TravelModeSelector: React.FC<TravelModeSelectorProps> = ({
  selectedMode,
  onSelectMode
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {MODES.map((item) => {
          const isSelected = item.mode === selectedMode;
          return (
            <TouchableOpacity
              key={item.mode}
              style={[styles.button, isSelected && styles.buttonSelected]}
              onPress={() => onSelectMode(item.mode)}
              activeOpacity={0.7}
            >
              <Text style={styles.icon}>{item.icon}</Text>
              <Text style={[styles.label, isSelected && styles.labelSelected]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },
  buttonSelected: {
    backgroundColor: "#0F172A",
    borderColor: "#0F172A"
  },
  icon: {
    fontSize: 16,
    marginRight: 6
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569"
  },
  labelSelected: {
    color: "#FFFFFF"
  }
});
