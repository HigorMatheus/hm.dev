// className

import { Header } from "./components/Header";
import { Event } from "./pages/Event";

function App() {
	// https://api-us-west-2.hygraph.com/v2/cl4r00c7g0f4m01wb17yv0fby/master

	console.log({ env: import.meta.env });
	return <Event />;
}

export default App;
