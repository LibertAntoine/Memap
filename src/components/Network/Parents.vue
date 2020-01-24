<template>
	<div class="parents-container">
		<div v-for="(neuron, id) in neurons" :key="id">
			<Neuron :uuid-neuron="neuron.neuronUUID"></Neuron>
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
	data() {
		return {
			lowerHandlePosition: {}
		}
	},
	props: ['neurons'],
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
<style lang="less" scoped>

.connected-line {
	position: fixed;
}
</style>
