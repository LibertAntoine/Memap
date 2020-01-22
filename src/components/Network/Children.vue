<template>
	<div class="children-container">
		<div v-for="(neuron, id) in neurons" :key="id">
			<Neuron :neuron="neuron"></Neuron>
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
	props: ['neurons']
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
