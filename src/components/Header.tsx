import React from "react";
import { Logo } from "./Logo";

export function Header() {
	return (
		<header className="w-full py-5 flex items-center justify-center bg-gray-700 border-b border-gray-600">
			<Logo />{" "}
			<h1 className="text-3xl text-green-400">deploy ci cd com sucesso test</h1>
		</header>
	);
}
