import React from "react";
import { DedupedSVG } from "./DedupedSVG";

export class DedupedSVGManager {
	svgs: DedupedSVGInstance[] = [];
	private svgUpdateSubscribers: Set<() => void>;

	constructor() {
		this.svgUpdateSubscribers = new Set();
		this.subscribeToSVGUpdates = this.subscribeToSVGUpdates.bind(this);
	}

	private updateSubscribers() {
		this.svgUpdateSubscribers.forEach((cb) => cb());
	}

	subscribeToSVGUpdates(cb: () => void) {
		this.svgUpdateSubscribers.add(cb);
		return () => this.svgUpdateSubscribers.delete(cb);
	}

	getSVGs() {
		return this.svgs;
	}

	getOrCreateSVG(id: string, svg: JSX.IntrinsicElements["svg"]) {
		if (!this.svgs.some((s) => s.id === id)) {
			this.svgs = [
				...this.svgs,
				// @ts-expect-error aaaaaaaaaaaaaa
				new DedupedSVGInstance(id, React.cloneElement(svg, { id }), this),
			];
			this.updateSubscribers();
		}
		return this.svgs.find((s) => s.id === id)!;
	}

	removeSVGInstance(id: string) {
		this.svgs = this.svgs.filter((s) => s.id !== id);
		this.updateSubscribers();
	}
}

export class DedupedSVGInstance {
	instances = new Set<DedupedSVG>();

	constructor(
		public id: string,
		public svg: React.ReactNode,
		public manager: DedupedSVGManager
	) {}

	markUser(symbol: DedupedSVG) {
		this.instances.add(symbol);
		return () => {
			this.instances.delete(symbol);
			this.checkIfUnused();
		};
	}

	checkIfUnused() {
		if (this.instances.size === 0) {
			this.manager.removeSVGInstance(this.id);
		}
	}
}

export const DedupedSVGManagerInstance = new DedupedSVGManager();
if (typeof window !== "undefined") {
	// @ts-expect-error aaaaaaaaaaaaaa
	window.SVGDedupeManager = DedupedSVGManagerInstance;
}
