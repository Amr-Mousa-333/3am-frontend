import type {
	VehicleBuildConfig,
	VehicleLineupModel,
} from "@components/vehicleBuilder/types";
import {
	DUSK_BUILD_CONFIG,
	DUSK_BUILD_LINEUP_MODELS,
} from "@sections/dusk/buildJourneyConfig";

export const DAWN_BUILD_CONFIG: VehicleBuildConfig = {
	...DUSK_BUILD_CONFIG,
	id: "dawn-build",
	eyebrow: "Build & Buy",
	progressRootSegment: "dawn",
	progressModelSegment: "dual-standard",
	model: "DAWN Dual Standard",
	steps: [
		{ id: "build", label: "Build", title: "Build your DAWN" },
		{ id: "accessories", label: "Accessories", title: "Add accessories" },
		{ id: "finalize", label: "Finalize", title: "Finalize checkout" },
	],
};

export const DAWN_BUILD_LINEUP_MODELS: ReadonlyArray<VehicleLineupModel> =
	DUSK_BUILD_LINEUP_MODELS.map((model) => ({
		...model,
		name: model.name.replace(/^DUSK/i, "DAWN"),
	}));
