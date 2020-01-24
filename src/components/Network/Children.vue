<template>
	<div class="children-container">
		<div v-for="(neuron, id) in neurons" :key="id">
			<Neuron :uuid-neuron="neuron.neuronUUID"></Neuron>
		</div>
	</div>
</template>

<script>
import Neuron from '../Neuron/Neuron';

export default {
 	name: 'Children',
	components: {
		Neuron
	},
	props: ['neurons'],
	methods: {
		logClick() {
			console.log('Registering click')
		}
	}
}
</script>

<style lang="less">
.children-container {
	display: flex;
	flex-wrap: wrap;
	.neuron-container {
		margin: 10px;
	}
}
</style>
