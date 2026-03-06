import type {
	VehicleBuildConfig,
	VehicleLineupModel,
} from "@components/vehicleBuilder/types";

export const DUSK_BUILD_CONFIG: VehicleBuildConfig = {
	id: "dusk-build",
	sectionClassName: "dusk-build",
	eyebrow: "Build & Buy",
	progressRootSegment: "dusk",
	progressModelSegment: "dual-standard",
	steps: [
		{ id: "build", label: "Build", title: "Build your DUSK" },
		{ id: "accessories", label: "Accessories", title: "Add accessories" },
		{ id: "finalize", label: "Finalize", title: "Finalize checkout" },
	],
	model: "DUSK Dual Standard",
	drivetrain: "Dual-motor AWD",
	horsepower: 533,
	basePrice: 83_240,
	checkoutDeposit: 500,
	defaultPaintId: "forest-green",
	defaultWheelId: "sport-bright-22",
	defaultInteriorId: "adventure-black",
	defaultSelectedUpgradeIds: ["autonomy-plus"],
	paints: [
		{
			id: "la-silver",
			label: "LA Silver",
			price: 0,
			swatch:
				"linear-gradient(150deg, rgb(236 239 244) 0%, rgb(188 195 205) 55%, rgb(130 139 151) 100%)",
			previewImage: "/assets/dusk/build/paint/la-silver.png",
		},
		{
			id: "forest-green",
			label: "Forest Green",
			price: 2_500,
			swatch:
				"linear-gradient(150deg, rgb(131 152 118) 0%, rgb(57 98 54) 52%, rgb(19 45 26) 100%)",
			previewImage: "/assets/dusk/build/paint/forest-green.png",
		},
		{
			id: "storm-blue",
			label: "Storm Blue",
			price: 2_000,
			swatch:
				"linear-gradient(150deg, rgb(147 166 186) 0%, rgb(78 102 129) 55%, rgb(22 43 66) 100%)",
			previewImage: "/assets/dusk/build/paint/storm-blue.png",
		},
	],
	wheels: [
		{
			id: "all-season-20",
			label: '20" All-season',
			description: "Efficient in all kinds of conditions.",
			price: 0,
			rangeMiles: 270,
			zeroToSixtySec: 4.5,
			image: "/assets/dusk/build/wheels/all-season-20.png",
		},
		{
			id: "sport-bright-22",
			label: '22" Sport Bright',
			description: "On-road quiet",
			price: 2_000,
			rangeMiles: 258,
			zeroToSixtySec: 4.2,
			image: "/assets/dusk/build/wheels/sport-bright-22.png",
		},
		{
			id: "sport-dark-22",
			label: '22" Sport Dark',
			description: "Aggressive profile with darker wheel finish.",
			price: 3_500,
			rangeMiles: 252,
			zeroToSixtySec: 4.0,
			image: "/assets/dusk/build/wheels/sport-dark-22.png",
		},
	],
	interiors: [
		{
			id: "adventure-black",
			label: "Adventure interior",
			description: "Durable all-black cabin with high-contrast utility trim.",
			price: 0,
			swatch:
				"linear-gradient(160deg, rgb(72 77 86) 0%, rgb(31 35 42) 48%, rgb(15 18 24) 100%)",
		},
		{
			id: "adventure-light",
			label: "Adventure interior (light)",
			description: "Light two-tone cabin for an airy, open interior feel.",
			price: 2_000,
			swatch:
				"linear-gradient(160deg, rgb(242 242 236) 0%, rgb(201 205 202) 52%, rgb(142 149 154) 100%)",
		},
		{
			id: "ascend-ocean",
			label: "Ascend interior",
			description: "Premium two-tone interior with warmer accent materials.",
			price: 3_500,
			swatch:
				"linear-gradient(160deg, rgb(176 165 145) 0%, rgb(124 128 133) 50%, rgb(76 82 91) 100%)",
		},
	],
	upgrades: [
		{
			id: "autonomy-plus",
			label: "Autonomy+",
			description: "Advanced driver assistance package for supported highways.",
			price: 2_500,
			included: false,
			image: "/assets/dusk/build/upgrades/autonomy-plus.png",
		},
		{
			id: "premium-audio",
			label: "Premium Cabin Audio",
			description: "Immersive premium sound system tuned for the cabin.",
			price: 0,
			included: true,
			image: "/assets/dusk/build/upgrades/premium-audio.png",
		},
		{
			id: "air-compressor",
			label: "Air compressor",
			description: "Integrated compressor for quick tire pressure adjustments.",
			price: 0,
			included: true,
			image: "/assets/dusk/build/upgrades/air-compressor.png",
		},
	],
	accessories: [
		{
			id: "wall-charger",
			label: "Wall Charger",
			description: "Delivering up to 25 miles of range every hour of charging.",
			price: 800,
			image: "/assets/dusk/build/accessories/wall-charger.png",
		},
		{
			id: "portable-charger",
			label: "Portable Charger",
			description:
				"Portable charging setup that stores in your garage or vehicle.",
			price: 400,
			image: "/assets/dusk/build/accessories/portable-charger.png",
		},
		{
			id: "cargo-crossbars",
			label: "Cargo Crossbars",
			description:
				"Lockable cargo crossbars that snap into your vehicle's accessory ports.",
			price: 700,
			image: "/assets/dusk/build/accessories/cargo-crossbars.png",
		},
		{
			id: "all-weather-floor-mats",
			label: "All-Weather Floor Mats",
			description: "Integrated floor mats designed to protect your interior.",
			price: 250,
			image: "/assets/dusk/build/accessories/floor-mats.png",
		},
		{
			id: "center-console-organizer",
			label: "Center Console Organizer",
			description: "2-tiered custom-fit tray to keep smaller gear sorted.",
			price: 50,
			image: "/assets/dusk/build/accessories/console-organizer.png",
		},
		{
			id: "crosswing-awning",
			label: "Kammok Crosswing Awning",
			description: "Deployable shade solution for overlanding and camp setups.",
			price: 1_300,
			image: "/assets/dusk/build/accessories/crosswing-awning.png",
		},
	],
	detailImages: {
		build: [
			{
				image: "/assets/dusk/build/detail/badge-closeup.png",
				caption: "Exterior badge detail",
			},
			{
				image: "/assets/dusk/build/detail/window-closeup.png",
				caption: "Body and trim finish",
			},
		],
	},
};

export const DUSK_BUILD_LINEUP_MODELS: ReadonlyArray<VehicleLineupModel> = [
	{
		id: "dual-standard",
		name: "DUSK Dual Standard",
		fromLabel: "From $76,990 · Est. lease $799/mo",
		description: "Anything but standard.",
		rangeLabel: "270 mi EPA est.",
		performanceLabel: "Dual-Motor AWD · 4.5 sec 0-60",
		image: "/assets/dusk/build/lineup/dual-standard.png",
	},
	{
		id: "dual",
		name: "DUSK Dual",
		fromLabel: "From $83,990 · Est. $1,029/mo",
		description: "Get out and explore with more range.",
		rangeLabel: "329 mi EPA est.",
		performanceLabel: "Dual-Motor AWD · as fast as 3.4 sec",
		image: "/assets/dusk/build/lineup/dual.png",
	},
	{
		id: "tri",
		name: "DUSK Tri",
		fromLabel: "From $106,990 · Est. $1,469/mo",
		description: "Elevated design for all your adventures.",
		rangeLabel: "371 mi EPA est.",
		performanceLabel: "Tri-Motor AWD · 2.9 sec 0-60",
		image: "/assets/dusk/build/lineup/tri.png",
	},
	{
		id: "quad",
		name: "DUSK Quad",
		fromLabel: "From $121,990 · Est. lease $1,929/mo",
		description: "Engineered for extremes, on-road and off.",
		rangeLabel: "374 mi EPA est.",
		performanceLabel: "Quad-Motor AWD · 2.6 sec 0-60",
		image: "/assets/dusk/build/lineup/quad.png",
	},
];
