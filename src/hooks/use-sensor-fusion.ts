import { useState, useRef, useCallback, useEffect } from 'react';

interface GpsPoint {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
  heading?: number;
  speed?: number;
}

interface SensorData {
  accelerometer: { x: number; y: number; z: number } | null;
  gyroscope: { alpha: number; beta: number; gamma: number } | null;
  compass: number | null; // heading in degrees
}

interface KalmanState {
  x: number; // latitude estimate
  y: number; // longitude estimate
  vx: number; // velocity x
  vy: number; // velocity y
  p: number; // error covariance
}

// Kalman filter for GPS smoothing
class KalmanFilter {
  private state: KalmanState;
  private processNoise: number = 0.00001; // GPS process noise
  private measurementNoise: number = 0.00005; // GPS measurement noise

  constructor(initialLat: number, initialLng: number, accuracy: number) {
    this.state = {
      x: initialLat,
      y: initialLng,
      vx: 0,
      vy: 0,
      p: accuracy * accuracy // initial error covariance based on GPS accuracy
    };
  }

  update(lat: number, lng: number, accuracy: number, dt: number): { lat: number; lng: number } {
    // Prediction step
    const predictedX = this.state.x + this.state.vx * dt;
    const predictedY = this.state.y + this.state.vy * dt;
    const predictedP = this.state.p + this.processNoise;

    // Measurement noise based on GPS accuracy
    const R = Math.max(accuracy * accuracy * 0.0000001, this.measurementNoise);

    // Kalman gain
    const K = predictedP / (predictedP + R);

    // Update step
    this.state.x = predictedX + K * (lat - predictedX);
    this.state.y = predictedY + K * (lng - predictedY);
    this.state.p = (1 - K) * predictedP;

    // Update velocity estimates
    if (dt > 0) {
      this.state.vx = (this.state.x - predictedX) / dt;
      this.state.vy = (this.state.y - predictedY) / dt;
    }

    return { lat: this.state.x, lng: this.state.y };
  }

  // Apply motion sensor correction
  applyMotionCorrection(ax: number, ay: number, dt: number) {
    // Convert accelerometer data to position delta (double integration with damping)
    const dampingFactor = 0.1; // Heavily damped to prevent drift
    this.state.vx += ax * dt * dampingFactor;
    this.state.vy += ay * dt * dampingFactor;
  }
}

export interface SensorFusionResult {
  filteredPoints: GpsPoint[];
  currentPosition: GpsPoint | null;
  sensorData: SensorData;
  accuracy: number;
  isCalibrated: boolean;
  errorEstimate: number; // in meters
}

export function useSensorFusion() {
  const [filteredPoints, setFilteredPoints] = useState<GpsPoint[]>([]);
  const [currentPosition, setCurrentPosition] = useState<GpsPoint | null>(null);
  const [sensorData, setSensorData] = useState<SensorData>({
    accelerometer: null,
    gyroscope: null,
    compass: null
  });
  const [accuracy, setAccuracy] = useState<number>(100);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [errorEstimate, setErrorEstimate] = useState<number>(30);

  const kalmanFilterRef = useRef<KalmanFilter | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number>(0);
  const motionListenerRef = useRef<((e: DeviceMotionEvent) => void) | null>(null);
  const orientationListenerRef = useRef<((e: DeviceOrientationEvent) => void) | null>(null);

  // Process GPS point with Kalman filter
  const processGpsPoint = useCallback((position: GeolocationPosition) => {
    const now = Date.now();
    const dt = lastTimestampRef.current > 0 
      ? (now - lastTimestampRef.current) / 1000 
      : 0.1;
    lastTimestampRef.current = now;

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const gpsAccuracy = position.coords.accuracy;

    // Initialize Kalman filter on first reading
    if (!kalmanFilterRef.current) {
      kalmanFilterRef.current = new KalmanFilter(lat, lng, gpsAccuracy);
      setIsCalibrated(true);
    }

    // Apply Kalman filter
    const filtered = kalmanFilterRef.current.update(lat, lng, gpsAccuracy, dt);

    // Calculate error estimate (weighted combination of GPS accuracy and filter confidence)
    const estimatedError = Math.min(gpsAccuracy * 0.7 + 2, 30); // Cap at 30m
    setErrorEstimate(estimatedError);
    setAccuracy(gpsAccuracy);

    const newPoint: GpsPoint = {
      lat: filtered.lat,
      lng: filtered.lng,
      accuracy: estimatedError,
      timestamp: now,
      heading: position.coords.heading ?? sensorData.compass ?? undefined,
      speed: position.coords.speed ?? undefined
    };

    setCurrentPosition(newPoint);
    setFilteredPoints(prev => [...prev, newPoint]);

    return newPoint;
  }, [sensorData.compass]);

  // Start tracking with sensor fusion
  const startTracking = useCallback(async () => {
    if (!navigator.geolocation) {
      throw new Error('GPS not available');
    }

    // Reset state
    setFilteredPoints([]);
    kalmanFilterRef.current = null;
    lastTimestampRef.current = 0;
    setIsCalibrated(false);

    // Request device motion permission (iOS 13+)
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission !== 'granted') {
          console.warn('Device motion permission denied');
        }
      } catch (e) {
        console.warn('Could not request device motion permission:', e);
      }
    }

    // Start GPS tracking with high accuracy
    watchIdRef.current = navigator.geolocation.watchPosition(
      processGpsPoint,
      (error) => {
        console.error('GPS error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );

    // Start motion sensor tracking
    motionListenerRef.current = (event: DeviceMotionEvent) => {
      if (event.accelerationIncludingGravity) {
        setSensorData(prev => ({
          ...prev,
          accelerometer: {
            x: event.accelerationIncludingGravity!.x ?? 0,
            y: event.accelerationIncludingGravity!.y ?? 0,
            z: event.accelerationIncludingGravity!.z ?? 0
          }
        }));

        // Apply motion correction to Kalman filter
        if (kalmanFilterRef.current && event.accelerationIncludingGravity) {
          const ax = event.accelerationIncludingGravity.x ?? 0;
          const ay = event.accelerationIncludingGravity.y ?? 0;
          const dt = event.interval ? event.interval / 1000 : 0.016;
          kalmanFilterRef.current.applyMotionCorrection(ax, ay, dt);
        }
      }
    };

    // Start orientation (compass) tracking
    orientationListenerRef.current = (event: DeviceOrientationEvent) => {
      setSensorData(prev => ({
        ...prev,
        gyroscope: {
          alpha: event.alpha ?? 0,
          beta: event.beta ?? 0,
          gamma: event.gamma ?? 0
        },
        compass: event.alpha ?? null // alpha is the compass heading
      }));
    };

    window.addEventListener('devicemotion', motionListenerRef.current);
    window.addEventListener('deviceorientation', orientationListenerRef.current);
  }, [processGpsPoint]);

  // Stop tracking
  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (motionListenerRef.current) {
      window.removeEventListener('devicemotion', motionListenerRef.current);
      motionListenerRef.current = null;
    }

    if (orientationListenerRef.current) {
      window.removeEventListener('deviceorientation', orientationListenerRef.current);
      orientationListenerRef.current = null;
    }
  }, []);

  // Mark current position as corner (returns high-confidence point)
  const markCorner = useCallback((): GpsPoint | null => {
    if (!currentPosition) return null;

    // For corners, we wait a moment to get a more stable reading
    // Return the current filtered position
    return {
      ...currentPosition,
      timestamp: Date.now()
    };
  }, [currentPosition]);

  // Clear all points
  const clearPoints = useCallback(() => {
    setFilteredPoints([]);
    setCurrentPosition(null);
    kalmanFilterRef.current = null;
    setIsCalibrated(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  // Save to localStorage for offline tolerance
  useEffect(() => {
    if (filteredPoints.length > 0) {
      localStorage.setItem('datakhet_mapping_draft', JSON.stringify({
        points: filteredPoints,
        timestamp: Date.now()
      }));
    }
  }, [filteredPoints]);

  return {
    filteredPoints,
    currentPosition,
    sensorData,
    accuracy,
    isCalibrated,
    errorEstimate,
    startTracking,
    stopTracking,
    markCorner,
    clearPoints
  };
}
