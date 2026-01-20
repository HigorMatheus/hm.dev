// className

import { Radio, Truck } from "lucide-react";
import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { ControlPanel } from "./components/ControlPanel";
import { Header } from "./components/Header";
import { VehicleMap } from "./components/VehicleMap";
import {
	type Coordinates,
	useVehicleTracking,
} from "./hooks/use-vehicle-tracking";
import { Event } from "./pages/Event";
const EXAMPLE_ROUTE: Coordinates[] = [
	{ lat: -23.5505, lng: -46.6333 }, // Praça da Sé
	{ lat: -23.5489, lng: -46.6388 }, // Vale do Anhangabaú
	{ lat: -23.5437, lng: -46.6427 }, // República
	{ lat: -23.5417, lng: -46.6492 }, // Consolação
	{ lat: -23.5434, lng: -46.6532 }, // Paulista
	{ lat: -23.5615, lng: -46.6559 }, // Av. Paulista (meio)
	{ lat: -23.5678, lng: -46.6489 }, // Paraíso
	{ lat: -23.5734, lng: -46.6423 }, // Ana Rosa
	{ lat: -23.5812, lng: -46.6356 }, // Vila Mariana
	{ lat: -23.5889, lng: -46.6312 }, // Santa Cruz
	{ lat: -23.5945, lng: -46.6267 }, // Praça da Árvore
	{ lat: -23.6023, lng: -46.6189 }, // Saúde
	{ lat: -23.6112, lng: -46.6123 }, // São Judas
	{ lat: -23.6189, lng: -46.6078 }, // Conceição
	{ lat: -23.6256, lng: -46.6012 }, // Jabaquara
];
function App() {
	// https://api-us-west-2.hygraph.com/v2/cl4r00c7g0f4m01wb17yv0fby/master
	const [followVehicle, setFollowVehicle] = useState(true);

	const { vehicle, isTracking, startTracking, stopTracking, resetTracking } =
		useVehicleTracking({
			route: EXAMPLE_ROUTE,
			intervalMs: 500,
			speedFactor: 0.05,
		});
	return (
		<main className="min-h-screen bg-background">
			{/* Header */}
			<header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
				<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
							<Truck className="h-5 w-5 text-primary-foreground" />
						</div>
						<div>
							<h1 className="text-lg font-bold text-foreground">
								FleetTracker
							</h1>
							<p className="text-xs text-muted-foreground">
								Rastreamento em Tempo Real
							</p>
						</div>
					</div>

					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<Radio
								className={`h-4 w-4 ${
									isTracking
										? "animate-pulse text-green-500"
										: "text-muted-foreground"
								}`}
							/>
							<span className="text-sm text-muted-foreground">
								{isTracking ? "Ao vivo" : "Offline"}
							</span>
						</div>
					</div>
				</div>
			</header>

			{/* Main content */}
			<div className="mx-auto max-w-7xl p-4">
				<div className="grid gap-4 lg:grid-cols-[1fr_360px]">
					{/* Mapa */}
					<div className="overflow-hidden rounded-xl border border-border bg-card">
						<div className="h-[calc(100vh-160px)] min-h-[500px]">
							<VehicleMap
								route={EXAMPLE_ROUTE}
								vehicle={vehicle}
								followVehicle={followVehicle}
							/>
						</div>
					</div>

					{/* Painel lateral */}
					<aside className="space-y-4">
						<ControlPanel
							vehicle={vehicle}
							isTracking={isTracking}
							followVehicle={followVehicle}
							onStart={startTracking}
							onStop={stopTracking}
							onReset={resetTracking}
							onFollowToggle={setFollowVehicle}
						/>
					</aside>
				</div>
			</div>
		</main>
	);
}

export default App;
