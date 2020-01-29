<template>
	<div class="parents-container">
		<div class="neurons">
			<Neuron v-for="(neuron, id) in neurons" :key="id" ref="neuron" :uuid-neuron="neuron.neuronUUID"></Neuron>
		</div>
		<AddNeuronButton :type="'parent'" :uuid-center-neuron="uuidCenter"/>
		<SVGPathParent @contextmenu="contextClick" :parents-ref="$refs.neuron" :center-ref="centerRef"/>
	</div>
</template>

<script>
import Neuron from '../Neuron/Neuron';
import AddNeuronButton from '../Network/AddNeuronButton';
import SVGPathParent from './Links/SVGPathParent';

export default {
 	name: 'Parents',
	components: {
		Neuron, SVGPathParent, AddNeuronButton
	},
	methods: {
		contextClick(uuid, ev) {
			console.log(uuid, ev)
			this.$emit('contextmenu', ev, uuid)
		},
		logClick(uuid, event) {
			console.log('click', uuid, event)
		}
	},
	props: ['neurons', 'centerRef', 'uuidCenter']
}
</script>

<style lang="less">
.parents-container {
	display: grid;
	grid-template-rows: 1fr 2fr;

	.neurons {
		display: flex;
		flex-wrap: wrap-reverse;

		.neuron-container {
			margin: 10px;
		}
	}
	.add-neuron-button-container {
		place-self: center;
		grid-row-start: 1;
	}
}
</style>
<style lang="less" scoped>

.connected-line {
	position: fixed;
}
</style>
