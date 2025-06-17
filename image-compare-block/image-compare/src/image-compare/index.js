import { registerBlockType } from "@wordpress/blocks";
import "./style.scss";

import Edit from "./edit";
import save from "./save";
import metadata from "./block.json";

registerBlockType("create-block/image-before-after", {
	title: "Image Compare",
	icon: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="128"
			height="128"
			viewBox="0 0 24 24"
		>
			<path
				fill="currentColor"
				d="M10 23v-2H3V3h7V1h2v22zm-5-5h5v-6zm9 3v-9l5 6V5h-5V3h7v18z"
			/>
		</svg>
	),
	description:
		"A block to compare two images side by side or one above the other.",
	category: "media",
	attributes: {
		imageBefore: {
			type: "string",
			default: "",
		},
		imageAfter: {
			type: "string",
			default: "",
		},
		orientation: {
			type: "string", // 'horizontal' or 'vertical'
			default: "horizontal",
		},
		width: {
			type: "number",
			default: 400,
		},
		height: {
			type: "number",
			default: 400,
		},
	},
	edit: Edit,
	save: save,
});
