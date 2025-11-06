import clsx from "clsx";
import { renderSVG } from "uqr";
import "./QRCode.css";
import { GearFill, PhoneVibrateFill } from "react-bootstrap-icons";

export enum QRCodeState {
	/**
	 * The QR is loading
	 */
	Loading,

	/**
	 * The QR is waiting for user input
	 */
	Waiting,

	/**
	 * The QR is operating normally
	 */
	Normal,
}

export default function QRCode({
	className,
	value,
	state,
}: {
	className?: string;
	value: string;
	state: QRCodeState;
}) {
	console.log(value, state);
	const options = { border: 0 };
	const svg =
		state === QRCodeState.Normal
			? renderSVG(value, options)
			: renderSVG("You should not be able to scan this QR", options);
	return (
		<div
			className={clsx("QRCode", className, {
				loading: state === QRCodeState.Loading,
				waiting: state === QRCodeState.Waiting,
				active: state === QRCodeState.Normal,
			})}
		>
			<div
				className="svg"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: This is the way
				dangerouslySetInnerHTML={{ __html: svg }}
			/>
			<div className="loading-overlay overlay">
				<GearFill size={"30%"} className="icon" />
			</div>
			<div className="waiting-overlay overlay">
				<PhoneVibrateFill size={"30%"} className="icon" />
			</div>
		</div>
	);
}
