<template>
	<div class="neuron-container">
		<div class="neuron-icon-container">
			<div class="icon" @click="logNeuron">👍</div>
		</div>
		<div class="neuron-name-container">{{ neuronName }}</div>
		<div class="handle handle-parent"></div>
		<div class="handle handle-children"></div>
		<div class="handle handle-friend"></div>
	</div>
</template>

<script>
export default {
	name: 'Neuron',
	props: ['neuron'],
	computed: {
		neuronName() {
			return this.neuron.neuron.properties.name;
		}
	},
	methods: {
		logNeuron() {
			console.log(this.neuron);
		}
	}
}
</script>

<style lang="less">
.neuron-container {
	height: 40px;
	display: grid;
	grid-template-columns: auto auto;
	border: 2px solid blue;
	border-radius: 10px;
	position: relative;



	.neuron-icon-container {
		overflow: hidden;
		background: blue;
		padding: 5px;
		width: 40px;
	}
	.neuron-name-container {
		place-self: center;
		padding: 0 10px;
		background: white;
	}

	.handle {
		position: absolute;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		z-index: -1;

		&.handle-friend {
			background: green;
			right: -8px;;
			top: 50%;
		}
		&.handle-children {
			background: red;
			right: 50%;
			bottom: -8px;
		}
		&.handle-parent {
			background: purple;
			right: 50%;
			top: -8px
		}
	}
}
</style>
