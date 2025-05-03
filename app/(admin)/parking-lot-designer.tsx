import React, { useState, useRef } from 'react';
import { View, Button, TextInput, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Svg, Rect, Text as SvgText } from 'react-native-svg';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const { width, height } = Dimensions.get('window');

interface ParkingSpot {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const SPOT_WIDTH = 60;
const SPOT_HEIGHT = 100;
const SPOT_MARGIN = 10;

export default function ParkingLotDesigner() {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [spotCount, setSpotCount] = useState('3');
  const [mode, setMode] = useState<'column' | 'row'>('column');
  const [colIndex, setColIndex] = useState(0);
  const [rowIndex, setRowIndex] = useState(0);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const handleAdd = () => {
    const count = parseInt(spotCount);
    if (isNaN(count) || count <= 0) return;

    let newSpots: ParkingSpot[] = [];

    if (mode === 'column') {
      let columnLabel: string;
      let x: number;

      if (selectedLabel) {
        columnLabel = selectedLabel;
        x = (columnLabel.charCodeAt(0) - 65) * (SPOT_WIDTH + SPOT_MARGIN);
      } else {
        columnLabel = String.fromCharCode(65 + colIndex);
        x = colIndex * (SPOT_WIDTH + SPOT_MARGIN);
        setColIndex(colIndex + 1);
      }

      const existingSpots = spots.filter(s => s.label.startsWith(columnLabel));
      const currentCount = existingSpots.length;

      newSpots = Array.from({ length: count }).map((_, i) => ({
        id: `col-${columnLabel}${currentCount + i + 1}`,
        label: `${columnLabel}${currentCount + i + 1}`,
        x,
        y: (currentCount + i) * (SPOT_HEIGHT + SPOT_MARGIN),
        width: SPOT_WIDTH,
        height: SPOT_HEIGHT,
      }));
    } else {
      const rowY = (selectedRow !== null ? selectedRow : rowIndex) * (SPOT_HEIGHT + SPOT_MARGIN);
      const existingSpots = spots.filter((s) => s.y === rowY);
      const existingLabels = existingSpots.map((s) => s.label[0]);
      let startCol = 0;

      if (existingLabels.length > 0) {
        const maxCharCode = Math.max(...existingLabels.map(c => c.charCodeAt(0)));
        startCol = maxCharCode - 65 + 1;
      }

      newSpots = Array.from({ length: count }).map((_, i) => {
        const colChar = String.fromCharCode(65 + startCol + i);
        return {
          id: `row-${colChar}${selectedRow !== null ? selectedRow + 1 : rowIndex + 1}`,
          label: `${colChar}${selectedRow !== null ? selectedRow + 1 : rowIndex + 1}`,
          x: (startCol + i) * (SPOT_WIDTH + SPOT_MARGIN),
          y: rowY,
          width: SPOT_WIDTH,
          height: SPOT_HEIGHT,
        };
      });

      if (selectedRow === null) {
        setRowIndex(rowIndex + 1);
      }
    }

    setSpots((prev) => [...prev, ...newSpots]);
  };

  const handleTouchStart = (e: any, id: string, spot: ParkingSpot) => {
    offsetRef.current = {
      x: e.nativeEvent.locationX - spot.x,
      y: e.nativeEvent.locationY - spot.y,
    };
  };

  const handleTouchMove = (e: any, id: string) => {
    if (!offsetRef.current.x || !offsetRef.current.y) return;

    const x = e.nativeEvent.locationX - offsetRef.current.x;
    const y = e.nativeEvent.locationY - offsetRef.current.y;

    setSpots((prev) =>
      prev.map((spot) => (spot.id === id ? { ...spot, x, y } : spot))
    );
  };

  const handleTouchEnd = () => {
    offsetRef.current.x = 0;
    offsetRef.current.y = 0;
  };

  const saveLayout = async () => {
    try {
        await setDoc(doc(db, 'layouts', 'adminLayout'), { spots, updatedAt: new Date().toISOString(), });
        alert('Layout saved to Firestore.');
    } catch (error) {
        console.error('Failed to save layout:', error);
        alert('Failed to save layout.');
    }
  };

  const importLayout = async () => {
    try {
      const docRef = doc(db, 'layouts', 'adminLayout');
      const layoutSnap = await getDoc(docRef);

      if (layoutSnap.exists()) {
        const data = layoutSnap.data();
        const importedSpots = data.spots.map((spot: any, index: number) => ({
          id: `imported-${index}`,
          label: spot.label,
          x: spot.x,
          y: spot.y,
          width: spot.width,
          height: spot.height,
        }));

        setSpots(importedSpots);

        alert('Layout imported successfully.');
      } else {
        alert('No layout found.');
      }
    } catch (error) {
      console.error('Failed to import layout:', error);
      alert('Failed to import layout.');
    }
  };

  const editLayout = (spotId: string) => {
    setSpots((prev) =>
      prev.map((spot) =>
        spot.id === spotId ? { ...spot, label: `${spot.label}_edited` } : spot
      )
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <View style={styles.segmented}>
          <TouchableOpacity
            style={[styles.segment, mode === 'column' && styles.activeSegment]}
            onPress={() => {
              setMode('column');
              setSelectedLabel(null);
              setSelectedRow(null);
            }}
          >
            <Text style={styles.segmentText}>Column</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segment, mode === 'row' && styles.activeSegment]}
            onPress={() => {
              setMode('row');
              setSelectedLabel(null);
              setSelectedRow(null);
            }}
          >
            <Text style={styles.segmentText}>Row</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          placeholder="Number of spots"
          value={spotCount}
          onChangeText={setSpotCount}
        />

        <Button title={`Add ${mode === 'column' ? 'Column' : 'Row'}`} onPress={handleAdd} />

        {mode === 'column' && colIndex > 0 && (
          <View style={styles.selectContainer}>
            <Text style={styles.selectLabel}>Add to column:</Text>
            <ScrollView horizontal>
              {[...Array(colIndex)].map((_, i) => {
                const label = String.fromCharCode(65 + i);
                return (
                  <TouchableOpacity
                    key={label}
                    style={[styles.selectButton, selectedLabel === label && styles.selectedButton]}
                    onPress={() => setSelectedLabel(label)}
                  >
                    <Text style={styles.selectText}>{label}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {mode === 'row' && rowIndex > 0 && (
          <View style={styles.selectContainer}>
            <Text style={styles.selectLabel}>Add to row:</Text>
            <ScrollView horizontal>
              {[...Array(rowIndex)].map((_, i) => {
                const label = `${i + 1}`;
                return (
                  <TouchableOpacity
                    key={label}
                    style={[styles.selectButton, selectedRow === i && styles.selectedButton]}
                    onPress={() => setSelectedRow(i)}
                  >
                    <Text style={styles.selectText}>{label}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>

      <ScrollView horizontal>
        <ScrollView>
          <Svg
            height={height * 2}
            width={width * 2}
            onStartShouldSetResponder={() => true}
            onResponderMove={(e) => handleTouchMove(e, selectedLabel ?? '')}
            onResponderRelease={handleTouchEnd}
            style={styles.svg}
          >
            {spots.map((spot) => (
              <React.Fragment key={spot.id}>
                <Rect
                  x={spot.x}
                  y={spot.y}
                  width={spot.width}
                  height={spot.height}
                  fill="green"
                  onPressIn={(e) => handleTouchStart(e, spot.id, spot)}
                  onLongPress={() => editLayout(spot.id)} // Add long press to edit
                />
                <SvgText x={spot.x + 5} y={spot.y + 20} fill="white" fontSize="12">
                  {spot.label}
                </SvgText>
              </React.Fragment>
            ))}
          </Svg>
        </ScrollView>
      </ScrollView>

      <View style={styles.saveButton}>
        <Button title="Save Layout" onPress={saveLayout} />
        <Button title="Import Layout" onPress={importLayout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  controls: {
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  segmented: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  segment: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ddd',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 5,
  },
  activeSegment: {
    backgroundColor: '#4CAF50',
  },
  segmentText: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  selectContainer: {
    marginBottom: 10,
  },
  selectLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  selectButton: {
    padding: 10,
    marginRight: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: '#4CAF50',
  },
  selectText: {
    color: 'white',
  },
  svg: {
    marginTop: 20,
  },
  saveButton: {
    marginTop: 20,
    marginHorizontal: 10,
  },
});
