<template>
	<div class="history-container">
		<div class="neurons">
			<div v-for="(neuron, id) in neurons" :key="id" ref="neuron" class="neuron-and-arrow-container">
				<div class="direction" v-if="id != neurons.length - 1">
					<i class="icon arrow left"></i>
				</div>
				<NeuronSmallFull :uuid-neuron="neuron" :style="{ opacity: 1 - (id/15 + 0.1) }" />
			</div>
		</div>
	</div>
</template>

<script>
import NeuronSmallFull from '../Neuron/NeuronSmallFull';

import HistoryAPI from '../../services/history'

export default {
 	name: 'History',
	components: {
		NeuronSmallFull
	},
	watch: {
		'$route'() {
			this.fetchHistoryData();
			setTimeout(() => {
				this.fetchHistoryData();
			}, 100)
		}
	},
	data() {
		return {
			neurons: [],
			polling: null
		}
	},
	methods: {
		async fetchHistoryData() {
			this.neurons = await HistoryAPI.getLast5VisitedNeurons();
		}
	},
	beforeRouteUpdate(to, from, next) {
		this.fetchHistoryData()
		next()
	},
	mounted() {
		this.fetchHistoryData();
	}
}
</script>

<style lang="less">
.history-container {
	.neurons {
		display: flex;
		flex-direction: row-reverse;
	}

	.neuron-and-arrow-container {
		display: grid;
		grid-template-columns: 40px 1fr; 
		grid-template-areas: "arrow neuron";
		align-items: center;
		/*
		& > * { 
			display: inline-flex;
		}
		*/


		& .direction {
			font-size: 10px;
			background: lightgrey;
			border-radius: 50%;
			width: 17px;
			height: 17px;
			margin: 0 10px;
			position: relative;
			text-align: center;
			color: white;

			i {
				width: 15px;
  			margin: 0;
			}
		}
	}

	.neuron-small-container {
		margin: 10px;
		grid-area: neuron;
	}
}
</style>
