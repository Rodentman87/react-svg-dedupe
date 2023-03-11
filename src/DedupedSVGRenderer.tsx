"use client";

import React, { Fragment, useSyncExternalStore } from "react";
import { DedupedSVGManagerInstance } from "./DedupedSVGContext";

export const DedupedSVGRenderer: React.FC = () => {
	const svgs = useSyncExternalStore(
		DedupedSVGManagerInstance.subscribeToSVGUpdates,
		() => DedupedSVGManagerInstance.getSVGs(),
		() => DedupedSVGManagerInstance.getSVGs()
	);

	return (
		<div style={{ display: "none" }}>
			{svgs.map((svg) => (
				<Fragment key={svg.id}>{svg.svg}</Fragment>
			))}
		</div>
	);
};
