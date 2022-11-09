const table = document.getElementById("rainfall-table");

const loadRainfallData = async () => {
	try {
		const rainFallUrl = `https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset/MTM01/JSON-stat/2.0/en`;
		const response = await fetch(rainFallUrl);
		const data = await response.json();
		displayRainfallData(data);
	} catch (error) {
		console.log(error);
	}
};

const rainFallDataArray = [];

const displayRainfallData = (allData) => {
	const statistic = allData.dimension.STATISTIC.category.label.MTM01C1;
	const monthsIndex = allData.dimension["TLIST(M1)"].category.index.slice(
		0,
		76
	);
	const monthsData = allData.dimension["TLIST(M1)"].category.label;
	const weatherStationIndex = allData.dimension.C02431V02938.category.index;
	const weatherStationData = allData.dimension.C02431V02938.category.label;
	const unit = allData.dimension.STATISTIC.category.unit.MTM01C1.label;
	const weatherValues = allData.value;

	let stationIndex = 0;
	monthsIndex.forEach((item, monthIndex) => {
		const month = monthsData[item];
		const stationName =
			weatherStationData[weatherStationIndex[stationIndex + ""]];
		const value = weatherValues[monthIndex];

		const createdElement = document.createElement("tr");

		const rainfallData = {
			statistic,
			month,
			stationName,
			unit,
			value,
		};
		rainFallDataArray.push(rainfallData);

		createdElement.innerHTML = `
			<td>${statistic}</td>
			<td>${month}</td>
			<td>${stationName}</td>
			<td>${unit}</td>
			<td>${value || ""}</td>`;
		table.appendChild(createdElement);

		if (stationIndex === 14) {
			stationIndex = 1;
		} else {
			stationIndex++;
		}
	});
	postRainFallData(rainFallDataArray);
};

const postRainFallData = (rainFallDataArray) => {
	try {
		fetch("http://localhost:5000/api/create/rainfall", {
			method: "POST", // or 'PUT'
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(rainFallDataArray),
		})
			.then((response) => response.json())
			.then((data) => console.log(data));
	} catch (error) {
		console.error(error);
	}
};

loadRainfallData();
