"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface Coordinates {
	lat: number;
	lng: number;
}

export interface VehicleData {
	id: string;
	position: Coordinates;
	speed: number;
	heading: number;
	timestamp: Date;
	routeProgress: number;
}

interface UseVehicleTrackingProps {
	route: Coordinates[];
	intervalMs?: number;
	speedFactor?: number;
}

interface UseVehicleTrackingReturn {
	vehicle: VehicleData;
	isTracking: boolean;
	startTracking: () => void;
	stopTracking: () => void;
	resetTracking: () => void;
	// Método para substituir por WebSocket futuramente
	updateVehiclePosition: (data: Partial<VehicleData>) => void;
}

function calculateDistance(p1: Coordinates, p2: Coordinates): number {
	const R = 6371e3; // metros
	const φ1 = (p1.lat * Math.PI) / 180;
	const φ2 = (p2.lat * Math.PI) / 180;
	const Δφ = ((p2.lat - p1.lat) * Math.PI) / 180;
	const Δλ = ((p2.lng - p1.lng) * Math.PI) / 180;

	const a =
		Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
		Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return R * c;
}

function calculateHeading(from: Coordinates, to: Coordinates): number {
	const φ1 = (from.lat * Math.PI) / 180;
	const φ2 = (to.lat * Math.PI) / 180;
	const Δλ = ((to.lng - from.lng) * Math.PI) / 180;

	const y = Math.sin(Δλ) * Math.cos(φ2);
	const x =
		Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
	const θ = Math.atan2(y, x);

	return ((θ * 180) / Math.PI + 360) % 360;
}

function interpolatePosition(
	from: Coordinates,
	to: Coordinates,
	progress: number,
): Coordinates {
	return {
		lat: from.lat + (to.lat - from.lat) * progress,
		lng: from.lng + (to.lng - from.lng) * progress,
	};
}

export function useVehicleTracking({
	route,
	intervalMs = 1000,
	speedFactor = 0.02,
}: UseVehicleTrackingProps): UseVehicleTrackingReturn {
	const [vehicle, setVehicle] = useState<VehicleData>({
		id: "vehicle-001",
		position: route[0] || { lat: 0, lng: 0 },
		speed: 0,
		heading: 0,
		timestamp: new Date(),
		routeProgress: 0,
	});

	const [isTracking, setIsTracking] = useState(false);
	const progressRef = useRef(0);
	const segmentIndexRef = useRef(0);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const updateVehiclePosition = useCallback((data: Partial<VehicleData>) => {
		setVehicle((prev) => ({
			...prev,
			...data,
			timestamp: new Date(),
		}));
	}, []);

	const moveVehicle = useCallback(() => {
		if (route.length < 2) return;

		progressRef.current += speedFactor;

		if (progressRef.current >= 1) {
			progressRef.current = 0;
			segmentIndexRef.current++;

			if (segmentIndexRef.current >= route.length - 1) {
				segmentIndexRef.current = 0;
			}
		}

		const fromPoint = route[segmentIndexRef.current];
		const toPoint = route[segmentIndexRef.current + 1];

		if (!fromPoint || !toPoint) return;

		const newPosition = interpolatePosition(
			fromPoint,
			toPoint,
			progressRef.current,
		);
		const heading = calculateHeading(fromPoint, toPoint);
		const distance = calculateDistance(fromPoint, toPoint);
		const speed = Math.round(
			(distance * speedFactor * 3.6) / (intervalMs / 1000),
		);

		const totalProgress =
			((segmentIndexRef.current + progressRef.current) / (route.length - 1)) *
			100;

		setVehicle({
			id: "vehicle-001",
			position: newPosition,
			speed,
			heading,
			timestamp: new Date(),
			routeProgress: totalProgress,
		});
	}, [route, speedFactor, intervalMs]);

	const startTracking = useCallback(() => {
		if (intervalRef.current) return;
		setIsTracking(true);
		intervalRef.current = setInterval(moveVehicle, intervalMs);
	}, [moveVehicle, intervalMs]);

	const stopTracking = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		setIsTracking(false);
	}, []);

	const resetTracking = useCallback(() => {
		stopTracking();
		progressRef.current = 0;
		segmentIndexRef.current = 0;
		setVehicle({
			id: "vehicle-001",
			position: route[0] || { lat: 0, lng: 0 },
			speed: 0,
			heading: 0,
			timestamp: new Date(),
			routeProgress: 0,
		});
	}, [route, stopTracking]);

	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

	return {
		vehicle,
		isTracking,
		startTracking,
		stopTracking,
		resetTracking,
		updateVehiclePosition,
	};
}

// Exemplo de como substituir por WebSocket futuramente:
/*
export function useVehicleTrackingWebSocket(vehicleId: string) {
  const [vehicle, setVehicle] = useState<VehicleData | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    wsRef.current = new WebSocket(`wss://your-server.com/vehicles/${vehicleId}`);

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setVehicle({
        id: data.id,
        position: { lat: data.lat, lng: data.lng },
        speed: data.speed,
        heading: data.heading,
        timestamp: new Date(data.timestamp),
        routeProgress: data.progress,
      });
    };

    return () => {
      wsRef.current?.close();
    };
  }, [vehicleId]);

  return { vehicle };
}
*/
