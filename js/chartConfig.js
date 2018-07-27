
	var launchDate = new Date('2018/7/23/');
	function advanceDay(dateValue) {
		dateValue.setDate(dateValue.getDate() + 1);
	}
	function formatDate(dateValue) {
		 return `${dateValue.getDate()}/${dateValue.getMonth() + 1}`

	}

		var config = {
			type: 'line',
			data: {
				labels: ['23/7'],
				datasets: [{
					label: 'ETH in contract',
					backgroundColor: window.chartColors.gray,
					borderColor: window.chartColors.blue,
					data: [
						// ETH  VALUE DATA HERE
					],
					fill: true,
				}]
			},
			options: {
				responsive: true,
				title: {
					display: true,
					text: 'SNOW Contract'
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Time'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Value in ETH'
						}
					}]
				}
			}
		};

		function pushData(dataValue){
			config.data.datasets.forEach(function(dataset) {
				dataset.data.push(dataValue);
			});
			window.myLine.update();

			advanceDay(launchDate);
			config.data.labels.push(formatDate(launchDate));
		}

		window.onload = function() {
			var ctx = document.getElementById('canvas').getContext('2d');
			window.myLine = new Chart(ctx, config);

			// HARDCODED DATA //
			pushData(100); // 23rd July
			pushData(61); // 24th July
			pushData(57); // 25th July
			pushData(140); // 26th July
			pushData(820); // 27th July
			// HARDCODED DATA //
		};
