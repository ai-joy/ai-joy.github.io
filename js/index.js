console.log("calling");
fetch("/pages").then(
	async (response) => {
		const text = await response.text();
		console.log(text);
	});

