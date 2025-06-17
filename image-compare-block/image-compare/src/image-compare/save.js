import { useBlockProps } from "@wordpress/block-editor";

const Save = ({ attributes }) => (
	<div
		{...useBlockProps.save({
			className: `image-compare-block ${attributes.orientation}`,
			style: {
				width: `${attributes.width}px`,
				height: `${attributes.height}px`,
			},
		})}
	>
		<div className="image-compare__preview">
			<img
				src={attributes.imageBefore}
				className="image-compare__before"
				draggable="false"
				style={{
					width: "100%",
					height: attributes.orientation === "vertical" ? "100%" : "auto",
				}}
			/>
			<div className={`image-compare__after-wrapper ${attributes.orientation}`}>
				<img
					src={attributes.imageAfter}
					draggable="false"
					className="image-compare__after"
				/>
			</div>
			<div className={`image-compare__slider ${attributes.orientation}`} />
		</div>
	</div>
);

export default Save;
