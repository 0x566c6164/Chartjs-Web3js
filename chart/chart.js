
	// var launchDate = new Date('2018/8/24/');
	function advanceDay(dateValue) {
		dateValue.setDate(dateValue.getDate() + 1);
	}
	function formatDate(dateValue) {
		 return `${dateValue.getDate()}/${dateValue.getMonth() + 1}`

	}

		var config = {
			type: 'line',
			data: {
				labels: ['Contract Launch'],
				datasets: [{
					label: 'ETH in contract',
					backgroundColor: "rgba(252,195,124,0.1)",
					borderColor: "#F7715D",
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
					text: 'Rabbit Hub Contract',
				},
				tooltips: {
					mode: 'index',
					intersect: false
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

		function pushData(blockNumber, dataValue, time){
			config.data.datasets.forEach(function(dataset) {
        config.data.labels.push(`Block # ${blockNumber}`); // push timestamp here
				dataset.data.push(dataValue);
			});
			window.myLine.update();

			// advanceDay(launchDate);
			// config.data.labels.push(formatDate(launchDate));
		}

		window.onload = function() {
			var ctx = document.getElementById('canvas').getContext('2d');
			window.myLine = new Chart(ctx, config);
      Chart.defaults.global.defaultFontColor = '#F3F2F0';
		};



// Check for MetaMask, otherwise use an HTTP Provider
window.addEventListener('load', function () {
    if (typeof web3 !== 'undefined') {
        console.log('Web3 Detected! ' + web3.currentProvider.constructor.name)
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.log('No Web3 Detected... using HTTP Provider')
        window.web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/<APIKEY>"));
    }
})

// Wrapper for Web3 callback
const promisify = (inner) =>
    new Promise((resolve, reject) =>
        inner((err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    );

// Get the first transaction block for an address
async function getFirstBlock(address) {
    let response = await fetch("https://api.etherscan.io/api?module=account&action=txlist&address=" + address + "&startblock=0&page=1&offset=10&sort=asc");
    let data = await response.json();

    return data.result[0].blockNumber;
}

// Given an address and a range of blocks, query the Ethereum blockchain for the ETH balance across the range
async function getBalanceInRange(address, startBlock, endBlock) {
    // Number of points to fetch between block range
    var pointCount = 50;

    // Calculate the step size given the range of blocks and the number of points we want
    var step = Math.floor((endBlock - startBlock) / pointCount)
    // Make sure step is at least 1
    if (step < 1) {
        step = 1;
    }

    // Queue the promises here
    var promises = [];

    // Loop over the blocks, using the step value
    for (let i = startBlock; i < endBlock; i = i + step) {
        // Create a promise to query the ETH balance for that block
        var promise = promisify(cb => web3.eth.getBalance(address, i, cb));
        // Queue the promise and include data about the block for output
        promises.push(promise.then(wei => (
            {
                block: i,
                balance: parseFloat(web3.fromWei(wei, 'ether'))
            })));
    }
    // Resolve all promises in parellel
    var balances = await Promise.all(promises);

    return balances;
}

// var timeStamp = [];

// Main function
async function graphBalance() {
    // Ethereum Address we want to look at
    var address = "0xfde889c9354d09cec72845e76a0d9f97f4686f7a"

    // Find the intial range, from first block to current block
    var startBlock = parseInt(await getFirstBlock(address));
    var endBlock = parseInt(await promisify(cb => web3.eth.getBlockNumber(cb)));

    var balances = await getBalanceInRange(address, startBlock, endBlock);
		for(let i = 0; i < balances.length; i++) {
			 pushData(balances[i].block, balances[i].balance);
		}
}

// function getTimeStamp() {
// 	for(let i = 0; i < balances.length; i++) {
// 		web3.eth.getBlock(balances[i].block, function(error, result) {
// 						timeStamp.push(result.timestamp);
// 					});
// 	}
// }



function timeStampToDate(time) {

}

graphBalance();
