<template>
	<div class="children-container">
		<div class="neurons">
			<Neuron v-for="(neuron, id) in neurons" :key="id" ref="neuron" :uuid-neuron="neuron.neuronUUID"></Neuron>
		</div>
		<AddNeuronButton :type="'children'" :uuid-center-neuron="uuidCenter"/>
		<SVGPathChildren @contextmenu="contextClick" :children-ref="$refs.neuron" :center-ref="centerRef"/>
	</div>
</template>

<script>
import Neuron from '../Neuron/Neuron';
import AddNeuronButton from '../Network/AddNeuronButton';
import SVGPathChildren from './Links/SVGPathChildren';

export default {
 	name: 'Children',
	components: {
		Neuron, SVGPathChildren, AddNeuronButton
	},
	props: ['neurons', 'centerRef', 'uuidCenter'],
	methods: {
		contextClick(uuid, ev) {
			console.log(uuid, ev)
			this.$emit('contextmenu', ev, uuid)
		}
	}
}
</script>

<style lang="less">
.children-container {
	display: grid;
	grid-template-rows: 1fr 1fr;

	.neurons {
		display: flex;
		flex-wrap: wrap;

		.neuron-container {
			margin: 10px;
		}
	}

	.add-neuron-button-container {
		place-self: center;
	}
}
</style>
