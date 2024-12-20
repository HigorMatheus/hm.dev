import {
	CaretCircleDoubleDown,
	CaretRight,
	DiscordLogo,
	FileArrowDown,
	Lightning,
} from "@phosphor-icons/react";
import axios from "axios";
import type React from "react";

export const Video: React.FC = () => {
	const openNewNav = async () => {
		// Const token = localStorage.session.get()?.accessToken;
		// if (token) {
		// 	const url = new URL('http://localhost:4000/home');
		// 	console.log(url);
		// 	const response =	await	axios.get('http://localhost:4000/api/auth', {
		// 		headers: {
		// 			Authorization: `Bearer ${token}`,
		// 		},
		// 	});
		// 	console.log(response.data);
		// 	window.open(url, 'minhaJanela', 'height=200,width=200');
		// }
	};

	return (
		<div className="flex-1 bg-black">
			<div className="bg-black flex justify-center">
				<div className="h-full w-full  max-w-[1100px] max-h-[60vh] aspect-video bg-slate-600" />
			</div>
			<div className="p-8 max-w-[1100px] mx-auto ">
				<div className="flex items-start gap-6">
					<div className="flex-1">
						<h1 className="text-2xl font-bold">
							Aula 01 - Abertura do ignite lab
						</h1>
						<p className="mt-4 text-gray-200 leading-relaxed">
							Nessa aula vamos dar início ao projeto criando a estrutura base da
							aplicação utilizando ReactJS, Vite e TailwindCSS. Vamos também
							realizar o setup do nosso projeto no GraphCMS criando as entidades
							da aplicação e integrando a API GraphQL gerada pela plataforma no
							nosso front-end utilizando Apollo Client.
						</p>
						<div className="flex items-center gap-4 mt-6">
							<img
								className="h-16 w-16 rounded-full border-2 border-blue-500"
								src="https://github.com/higormatheus.png"
								alt=""
							/>
							<div className="leading-relaxed">
								<strong className="font-bold text-2xl block">
									Higor Matheus
								</strong>
								<span className="text-gray-200 text-sm block">
									CTO @ HMCompany
								</span>
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-4 ">
						<button
							type="button"
							onClick={openNewNav}
							className="p-4 text-sm bg-green-500 flex items-center rounded font-bold uppercase gap-2 justify-center hover:bg-green-700 transition-colors"
						>
							<DiscordLogo size={24} />
							Comunidade do Discord
						</button>

						<a
							// biome-ignore lint/a11y/useValidAnchor: <explanation>
							href="#"
							className="p-4 text-sm border border-blue-500 text-blue-500 flex items-center rounded font-bold uppercase gap-2 justify-center hover:bg-blue-500 hover:text-gray-900 transition-colors "
						>
							<Lightning size={24} />
							Acesse o desafio
						</a>
					</div>
				</div>
				<div className="gap-8 mt-20 grid grid-cols-2">
					<a
						href="/"
						className="bg-gray-700 rounded overflow-hidden flex items-stretch gap-6 hover:bg-gray-600 transition-colors"
					>
						<div className="bg-green-700 h-full p-6 flex items-center">
							<FileArrowDown size={40} />
						</div>
						<div className=" w-full py-4 leading-relaxed" />
						<div className="h-full p-6 flex items-center">
							<CaretRight size={24} />
						</div>
					</a>
					{/* <a href=""></a> */}
				</div>
			</div>
		</div>
	);
};
