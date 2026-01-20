"use client";

import L from "leaflet";
import { useEffect } from "react";
import {
	MapContainer,
	Marker,
	Polyline,
	Popup,
	TileLayer,
	useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Coordinates, VehicleData } from "@/hooks/use-vehicle-tracking";

// Fix Leaflet default icons issue
const DefaultIcon = L.icon({
	iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
	iconRetinaUrl:
		"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
	shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Ícone personalizado do veículo com rotação
const createVehicleIcon = (heading: number) => {
	return L.divIcon({
		className: "vehicle-marker",
		html: `
      <div style="
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: rotate(${heading}deg);
      ">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L4 20L12 16L20 20L12 2Z" fill="#f97316" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
      </div>
    `,
		iconSize: [40, 40],
		iconAnchor: [20, 20],
	});
};

// Componente para seguir o veículo
function FollowVehicle({
	position,
	shouldFollow,
}: {
	position: Coordinates;
	shouldFollow: boolean;
}) {
	const map = useMap();

	useEffect(() => {
		if (shouldFollow) {
			map.setView([position.lat, position.lng], map.getZoom(), {
				animate: true,
				duration: 0.5,
			});
		}
	}, [map, position, shouldFollow]);

	return null;
}

interface VehicleMapProps {
	route: Coordinates[];
	vehicle: VehicleData;
	followVehicle: boolean;
	showStartEnd?: boolean;
}

export function VehicleMap({
	route,
	vehicle,
	followVehicle,
	showStartEnd = true,
}: VehicleMapProps) {
	const routePositions: [number, number][] = route.map((coord) => [
		coord.lat,
		coord.lng,
	]);
	const vehiclePosition: [number, number] = [
		vehicle.position.lat,
		vehicle.position.lng,
	];

	// Calcular centro e bounds da rota
	const center: [number, number] =
		route.length > 0 ? [route[0].lat, route[0].lng] : [-23.5505, -46.6333];

	return (
		<MapContainer
			center={center}
			zoom={14}
			className="h-full w-full rounded-lg"
			style={{ minHeight: "400px" }}
		>
			<TileLayer
				attribution='&copy; <a href="https://carto.com/">CARTO</a>'
				url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
			/>

			{/* Rota */}
			<Polyline
				positions={routePositions}
				pathOptions={{
					color: "#f97316",
					weight: 4,
					opacity: 0.8,
					dashArray: "10, 10",
				}}
			/>

			{/* Rota percorrida */}
			{vehicle.routeProgress > 0 && (
				<Polyline
					positions={routePositions.slice(
						0,
						Math.ceil((vehicle.routeProgress / 100) * route.length) + 1,
					)}
					pathOptions={{
						color: "#22c55e",
						weight: 5,
						opacity: 1,
					}}
				/>
			)}

			{/* Marcador de início */}
			{showStartEnd && route.length > 0 && (
				<Marker
					position={[route[0].lat, route[0].lng]}
					icon={L.divIcon({
						className: "start-marker",
						html: `
              <div style="
                width: 24px;
                height: 24px;
                background: #22c55e;
                border: 3px solid #fff;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              "></div>
            `,
						iconSize: [24, 24],
						iconAnchor: [12, 12],
					})}
				>
					<Popup>
						<div className="text-sm font-medium">Ponto de Partida</div>
					</Popup>
				</Marker>
			)}

			{/* Marcador de fim */}
			{showStartEnd && route.length > 1 && (
				<Marker
					position={[route[route.length - 1].lat, route[route.length - 1].lng]}
					icon={L.divIcon({
						className: "end-marker",
						html: `
              <div style="
                width: 24px;
                height: 24px;
                background: #ef4444;
                border: 3px solid #fff;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              "></div>
            `,
						iconSize: [24, 24],
						iconAnchor: [12, 12],
					})}
				>
					<Popup>
						<div className="text-sm font-medium">Destino</div>
					</Popup>
				</Marker>
			)}

			{/* Veículo */}
			<Marker
				position={vehiclePosition}
				icon={createVehicleIcon(vehicle.heading)}
			>
				<Popup>
					<div className="space-y-1 text-sm">
						<div className="font-bold text-primary">Veículo {vehicle.id}</div>
						<div>Velocidade: {vehicle.speed} km/h</div>
						<div>Direção: {Math.round(vehicle.heading)}°</div>
						<div>Progresso: {vehicle.routeProgress.toFixed(1)}%</div>
					</div>
				</Popup>
			</Marker>

			<FollowVehicle position={vehicle.position} shouldFollow={followVehicle} />
		</MapContainer>
	);
}
