import React from "react";
import {
	DedupedSVGInstance,
	DedupedSVGManagerInstance,
} from "./DedupedSVGContext";

// export const DedupedSVG: React.FC<
// 	React.SVGProps<SVGSVGElement> & {
// 		id: string;
// 		children: JSX.IntrinsicElements["svg"];
// 	}
// > = ({ children, id, ...props }) => {
// 	const ref = useRef(Symbol("svg"));
// 	const instance = DedupedSVGManagerInstance.getOrCreateSVG(id, children);

// 	instance.markUser(ref.current);

// 	useLayoutEffect(() => {
// 		return instance.markUser(ref.current);
// 	}, [id, children]);

// 	return (
// 		<svg {...props}>
// 			<use xlinkHref={`#${id}`} />
// 		</svg>
// 	);
// };

export class DedupedSVG extends React.Component<
	React.SVGProps<SVGSVGElement> & {
		id: string;
		children: JSX.IntrinsicElements["svg"];
	}
> {
	unmountHandler: () => void;
	instance: DedupedSVGInstance;

	constructor(
		props: React.SVGProps<SVGSVGElement> & {
			id: string;
			children: JSX.IntrinsicElements["svg"];
		}
	) {
		super(props);
		this.instance = DedupedSVGManagerInstance.getOrCreateSVG(
			props.id,
			props.children
		);
		// Only run this during the server render for the purposes of gathering the SVGs for SSR
		if (typeof window === "undefined")
			this.unmountHandler = this.instance.markUser(this);
	}

	UNSAFE_componentWillMount(): void {
		this.unmountHandler = this.instance.markUser(this);
	}

	componentWillUnmount(): void {
		this.unmountHandler();
	}

	render() {
		const { id, children, ...props } = this.props;

		return (
			<svg {...props}>
				<use xlinkHref={`#${id}`} />
			</svg>
		);
	}
}
