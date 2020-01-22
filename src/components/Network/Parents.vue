<template>
	<div class="parents-container">
		<div v-for="(neuron, id) in neurons" :key="id">
			<Neuron :neuron="neuron"></Neuron>
		</div>
	</div>
</template>

<script>
import Neuron from '../Neuron/Neuron';

export default {
 	name: 'Parents',
	components: {
		Neuron
	},
	props: ['neurons']
}
</script>

<style lang="less">
.parents-container {
	display: flex;
	flex-wrap: wrap-reverse;
	.neuron-container {
		margin: 10px;
	}
}
</style>
