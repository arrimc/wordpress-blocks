import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	useBlockProps,
} from "@wordpress/block-editor";
import {
	BaseControl,
	Button,
	PanelBody,
	PanelRow,
	SelectControl,
} from "@wordpress/components";
import { useEffect, useRef, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import "./editor.scss";

export default function Edit({ attributes, setAttributes }) {
	const {
		imageBefore,
		imageAfter,
		orientation,
		height = 400,
		width = 400,
	} = attributes;

	const [sliderPosition, setSliderPosition] = useState(50);
	const [isDragging, setIsDragging] = useState(false);
	const previewRef = useRef(null);

	const handleMouseDown = (e) => {
		e.stopPropagation(); // avoid gutemberg capture event
		e.preventDefault();
		setIsDragging(true);
	};

	useEffect(() => {
		const handleMouseMove = (e) => {
			if (!isDragging || !previewRef.current) return;

			if (e.buttons !== 1) {
				setIsDragging(false);
				return;
			}

			const rect = previewRef.current.getBoundingClientRect();
			let newPosition;

			if (orientation === "horizontal") {
				newPosition = Math.min(
					100,
					Math.max(0, ((e.clientX - rect.left) / rect.width) * 100),
				);
			} else {
				newPosition = Math.min(
					100,
					Math.max(0, ((e.clientY - rect.top) / rect.height) * 100),
				);
			}

			setSliderPosition(newPosition);
		};

		const handleMouseUp = () => {
			setIsDragging(false);
		};

		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
			document.body.style.userSelect = "none";
			document.body.style.cursor =
				orientation === "horizontal" ? "col-resize" : "row-resize";
		}

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
			document.body.style.userSelect = "";
			document.body.style.cursor = "";
		};
	}, [isDragging, orientation]);

	const afterWrapperStyle = {
		position: "absolute",
		top: 0,
		right: 0,
		overflow: "hidden",
		zIndex: 2,
		...(orientation === "horizontal"
			? {
					width: "100%",

					height: "100%",
					clipPath: `inset(0 0 0 ${sliderPosition}%)`,
			  }
			: {
					width: "100%",
					height: "100%",
					clipPath: `inset(${sliderPosition}% 0 0 0)`,
			  }),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Settings")} initialOpen={true}>
					<PanelRow>
						<SelectControl
							label={__("Orientation")}
							value={orientation}
							options={[
								{ label: __("Horizontal"), value: "horizontal" },
								{ label: __("Vertical"), value: "vertical" },
							]}
							onChange={(newOrientation) =>
								setAttributes({ orientation: newOrientation })
							}
						/>
					</PanelRow>

					<PanelRow>
						<BaseControl label={__("Width (px)")}>
							<input
								type="number"
								value={width}
								onChange={(e) =>
									setAttributes({ width: parseInt(e.target.value) || 400 })
								}
								min={10}
								max={2000}
								className="components-text-control__input"
							/>
						</BaseControl>
					</PanelRow>

					<PanelRow>
						<BaseControl label={__("Height (px)")}>
							<input
								type="number"
								value={height}
								onChange={(e) =>
									setAttributes({ height: parseInt(e.target.value) || 400 })
								}
								min={10}
								max={2000}
								className="components-text-control__input"
							/>
						</BaseControl>
					</PanelRow>
					<BaseControl
						help={__(
							"For optimal results, maintain identical dimensions for both images to ensure a seamless transition.",
						)}
					/>
				</PanelBody>
			</InspectorControls>

			<div
				{...useBlockProps({
					className: `image-compare-block ${orientation}`,
					style: {
						width: `${width}px`,
						height: `${height}px`,
						webkitUserDrag: "none", // avoid user drag
					},
				})}
			>
				{/* Upload Images */}
				<div className="image-compare__upload-container">
					<MediaUploadCheck>
						<MediaUpload
							onSelect={(media) => setAttributes({ imageBefore: media.url })}
							allowedTypes={["image"]}
							render={({ open }) => (
								<Button
									onClick={open}
									variant="primary"
									className="image-compare__upload-button"
								>
									{!imageBefore
										? __("Upload Before Image")
										: __("Change Before Image")}
								</Button>
							)}
						/>
					</MediaUploadCheck>

					<MediaUploadCheck>
						<MediaUpload
							onSelect={(media) => setAttributes({ imageAfter: media.url })}
							allowedTypes={["image"]}
							render={({ open }) => (
								<Button
									onClick={open}
									variant="primary"
									className="image-compare__upload-button"
								>
									{!imageAfter
										? __("Upload After Image")
										: __("Change After Image")}
								</Button>
							)}
						/>
					</MediaUploadCheck>
				</div>
				{/* Preview */}
				<div
					ref={previewRef}
					className="image-compare__preview"
					style={{ position: "relative" }}
				>
					{imageBefore && (
						<img
							src={imageBefore}
							alt={__("Before")}
							className="image-compare__before"
							style={{
								width: "100%",
								height: "100%",
								objectFit: "cover",
								pointerEvents: "none",
							}}
						/>
					)}
					{imageAfter && (
						<div
							className={`image-compare__after-wrapper ${orientation}`}
							style={{
								...afterWrapperStyle,
								pointerEvents: "none",
							}}
						>
							<img
								src={imageAfter}
								alt={__("After")}
								className="image-compare__after"
								style={{
									width: "100%",
									height: "100%",
									objectFit: "cover",
								}}
							/>
						</div>
					)}
					<div
						className={`image-compare__slider ${orientation}`}
						onMouseDown={handleMouseDown}
						style={{
							position: "absolute",
							backgroundColor: "white",
							zIndex: 10,
							...(orientation === "horizontal"
								? {
										left: `${sliderPosition}%`,
										top: 0,
										width: "4px",
										height: "100%",
										transform: "translateX(-50%)",
										cursor: "col-resize",
								  }
								: {
										top: `${sliderPosition}%`,
										left: 0,
										width: "100%",
										height: "4px",
										transform: "translateY(-50%)",
										cursor: "row-resize",
								  }),
						}}
					/>
				</div>
			</div>
		</>
	);
}
