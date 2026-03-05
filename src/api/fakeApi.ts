const products = [
	{
		id: "prod-001",
		name: "Carbon Fiber Steering Wheel",
		price: 349.99,
		quantity: 12,
		category: "Interior",
		images: ["https://placehold.co/200x200/1a1a2e/ffffff?text=Steering"],
	},
	{
		id: "prod-002",
		name: "LED Headlight Kit H7",
		price: 129.5,
		quantity: 5,
		category: "Lighting",
		images: ["https://placehold.co/200x200/0f3460/ffffff?text=LED+Kit"],
	},
	{
		id: "prod-003",
		name: "Sport Air Filter K&N",
		price: 64.0,
		quantity: 38,
		category: "Engine",
		images: ["https://placehold.co/200x200/16213e/ffffff?text=Air+Filter"],
	},
	{
		id: "prod-004",
		name: "Alloy Wheel Set 18\"",
		price: 899.0,
		quantity: 3,
		category: "Wheels",
		images: ["https://placehold.co/200x200/1b262c/ffffff?text=Wheels"],
	},
	{
		id: "prod-005",
		name: "Rear Spoiler ABS",
		price: 219.99,
		quantity: 9,
		category: "Exterior",
		images: ["https://placehold.co/200x200/2d132c/ffffff?text=Spoiler"],
	},
	{
		id: "prod-006",
		name: "Dashcam 4K Dual Lens",
		price: 185.0,
		quantity: 22,
		category: "Electronics",
		images: ["https://placehold.co/200x200/1a1a2e/ffffff?text=Dashcam"],
	},
];

const DELAY = 400;

const sleep = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

const json = (data: unknown, status = 200) =>
	new Response(JSON.stringify(data), {
		status,
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		},
	});

const notFound = () =>
	json({ error: "Product not found" }, 404);

Bun.serve({
	port: 3001,

	async fetch(req) {
		const url = new URL(req.url);
		const { pathname, method } = { pathname: url.pathname, method: req.method };

		if (method === "OPTIONS") {
			return new Response(null, {
				status: 204,
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
					"Access-Control-Allow-Headers": "Content-Type",
				},
			});
		}

		await sleep(DELAY);

		// GET /api/products
		if (method === "GET" && pathname === "/api/products") {
			console.log("[GET] /api/products →", products.length, "items");
			return json(products);
		}

		// PUT /api/products/:id
		const putMatch = pathname.match(/^\/api\/products\/([^/]+)$/);
		if (method === "PUT" && putMatch) {
			const id = putMatch[1];
			const index = products.findIndex((p) => p.id === id);

			if (index === -1) return notFound();

			const body = await req.json() as {
				price?: number;
				quantity?: number;
				images?: string[];
			};

			products[index] = {
				...products[index],
				price: body.price ?? products[index].price,
				quantity: body.quantity ?? products[index].quantity,
				images: body.images ?? products[index].images,
			};

			console.log("[PUT] /api/products/" + id, "→ updated");
			return json(products[index]);
		}

		// DELETE /api/products/:id
		const deleteMatch = pathname.match(/^\/api\/products\/([^/]+)$/);
		if (method === "DELETE" && deleteMatch) {
			const id = deleteMatch[1];
			const index = products.findIndex((p) => p.id === id);

			if (index === -1) return notFound();

			products.splice(index, 1);
			console.log("[DELETE] /api/products/" + id, "→ removed");
			return json({ success: true });
		}

		return json({ error: "Not found" }, 404);
	},
});

console.log("🚗 Fake API running at http://localhost:3001");
console.log("   GET    /api/products");
console.log("   PUT    /api/products/:id");
console.log("   DELETE /api/products/:id");