// className

import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Header } from "./components/Header";
import { Event } from "./pages/Event";

function App() {
	// https://api-us-west-2.hygraph.com/v2/cl4r00c7g0f4m01wb17yv0fby/master

	return (
		<div className="bg-background">
			<Header />
			<MapContainer
				center={[51.505, -0.09]}
				zoom={13}
				// scrollWheelZoom={false}
				zoomControl
				className="w-full h-96"
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<Marker position={[51.505, -0.09]}>
					<Popup>This is a popup</Popup>
				</Marker>
			</MapContainer>
		</div>
	);
}

export default App;
