import "./Banner.css";

export default function Banner({ children }: { children?: React.ReactNode }) {
	return <div className="Banner">{children}</div>;
}
