"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import type { VehicleData } from "@/hooks/use-vehicle-tracking";
import {
	Clock,
	Gauge,
	MapPin,
	Navigation,
	Pause,
	Play,
	RotateCcw,
} from "lucide-react";

interface ControlPanelProps {
	vehicle: VehicleData;
	isTracking: boolean;
	followVehicle: boolean;
	onStart: () => void;
	onStop: () => void;
	onReset: () => void;
	onFollowToggle: (follow: boolean) => void;
}

export function ControlPanel({
	vehicle,
	isTracking,
	followVehicle,
	onStart,
	onStop,
	onReset,
	onFollowToggle,
}: ControlPanelProps) {
	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("pt-BR", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
	};

	const getDirectionLabel = (heading: number) => {
		const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
		const index = Math.round(heading / 45) % 8;
		return directions[index];
	};

	return (
		<div className="flex flex-col gap-4">
			{/* Controles principais */}
			<Card className="border-border bg-card">
				<CardHeader className="pb-3">
					<CardTitle className="flex items-center gap-2 text-lg">
						<Navigation className="h-5 w-5 text-primary" />
						Controles de Rastreamento
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Botões de controle */}
					<div className="flex gap-2">
						{!isTracking ? (
							<Button onClick={onStart} className="flex-1" variant="default">
								<Play className="mr-2 h-4 w-4" />
								Iniciar
							</Button>
						) : (
							<Button onClick={onStop} className="flex-1" variant="secondary">
								<Pause className="mr-2 h-4 w-4" />
								Pausar
							</Button>
						)}
						<Button onClick={onReset} variant="outline">
							<RotateCcw className="h-4 w-4" />
						</Button>
					</div>

					{/* Toggle seguir veículo */}
					<div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
						<Label
							htmlFor="follow-vehicle"
							className="cursor-pointer text-sm text-foreground"
						>
							Seguir veículo no mapa
						</Label>
						<Switch
							id="follow-vehicle"
							checked={followVehicle}
							onCheckedChange={onFollowToggle}
						/>
					</div>

					{/* Status */}
					<div className="flex items-center gap-2">
						<div
							className={`h-2 w-2 rounded-full ${
								isTracking
									? "animate-pulse bg-green-500"
									: "bg-muted-foreground"
							}`}
						/>
						<span className="text-sm text-muted-foreground">
							{isTracking ? "Em movimento" : "Parado"}
						</span>
					</div>
				</CardContent>
			</Card>

			{/* Informações do veículo */}
			<Card className="border-border bg-card">
				<CardHeader className="pb-3">
					<CardTitle className="text-lg">Informações do Veículo</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Progresso da rota */}
					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">Progresso da Rota</span>
							<span className="font-mono font-medium text-primary">
								{vehicle.routeProgress.toFixed(1)}%
							</span>
						</div>
						<Progress value={vehicle.routeProgress} className="h-2" />
					</div>

					{/* Grid de métricas */}
					<div className="grid grid-cols-2 gap-3">
						{/* Velocidade */}
						<div className="rounded-lg bg-secondary/50 p-3">
							<div className="flex items-center gap-2 text-muted-foreground">
								<Gauge className="h-4 w-4" />
								<span className="text-xs">Velocidade</span>
							</div>
							<div className="mt-1 font-mono text-xl font-bold text-foreground">
								{vehicle.speed}
								<span className="ml-1 text-xs font-normal text-muted-foreground">
									km/h
								</span>
							</div>
						</div>

						{/* Direção */}
						<div className="rounded-lg bg-secondary/50 p-3">
							<div className="flex items-center gap-2 text-muted-foreground">
								<Navigation className="h-4 w-4" />
								<span className="text-xs">Direção</span>
							</div>
							<div className="mt-1 font-mono text-xl font-bold text-foreground">
								{getDirectionLabel(vehicle.heading)}
								<span className="ml-1 text-xs font-normal text-muted-foreground">
									{Math.round(vehicle.heading)}°
								</span>
							</div>
						</div>

						{/* Posição */}
						<div className="rounded-lg bg-secondary/50 p-3">
							<div className="flex items-center gap-2 text-muted-foreground">
								<MapPin className="h-4 w-4" />
								<span className="text-xs">Latitude</span>
							</div>
							<div className="mt-1 font-mono text-sm font-medium text-foreground">
								{vehicle.position.lat.toFixed(6)}
							</div>
						</div>

						<div className="rounded-lg bg-secondary/50 p-3">
							<div className="flex items-center gap-2 text-muted-foreground">
								<MapPin className="h-4 w-4" />
								<span className="text-xs">Longitude</span>
							</div>
							<div className="mt-1 font-mono text-sm font-medium text-foreground">
								{vehicle.position.lng.toFixed(6)}
							</div>
						</div>
					</div>

					{/* Última atualização */}
					<div className="flex items-center justify-between rounded-lg border border-border p-3">
						<div className="flex items-center gap-2 text-muted-foreground">
							<Clock className="h-4 w-4" />
							<span className="text-sm">Última atualização</span>
						</div>
						<span className="font-mono text-sm text-foreground">
							{formatTime(vehicle.timestamp)}
						</span>
					</div>
				</CardContent>
			</Card>

			{/* Nota sobre WebSocket */}
			<Card className="border-border bg-card/50">
				<CardContent className="p-4">
					<p className="text-xs text-muted-foreground">
						<strong className="text-primary">Nota:</strong> Este exemplo usa
						setInterval para simular o movimento. Para produção, substitua pelo
						hook{" "}
						<code className="rounded bg-secondary px-1">
							useVehicleTrackingWebSocket
						</code>{" "}
						para receber atualizações em tempo real via WebSocket.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
