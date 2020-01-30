<template>
	<div class="box-selection-container">
		<vue-draggable-resizable :resizable="false" :x="50" :y="130" :drag-handle="'.box-header'" :enable-native-drag="true">
			<Box :title="'Selection'" :font-awesome-icon="'thumbtack'">
				<Neuron v-for="(uuid, id) in selected" :key="id" :uuid-neuron="uuid"></Neuron>
			</Box>
		</vue-draggable-resizable>
	</div>
</template>

<script>
/* Components */
import Box from './Box'
import Neuron from '../Neuron/Neuron'

import VueDraggableResizable from 'vue-draggable-resizable'

/* Other */
import NetworkAPI from '@/services/network'

export default {
	name: 'BoxNeuronSelection',
	data() {
		return {
			polling: null,
			open: true,
			icon: "👽",
			selected: []
		}
	},
	components: {
		Box, Neuron,
		VueDraggableResizable
	},
	methods: {
		fetchSelectedNeuron() {
			NetworkAPI.getSelectedNeurons().then( data => {
				this.selected = data;
			}).catch(err => console.log(err));
		},
		initFetchService() { 
			this.fetchSelectedNeuron();
			this.polling = setInterval(() => {
				this.fetchSelectedNeuron();
			}, 1000)
		}
	},
	created() {
		this.initFetchService();
	},
	beforeDestroy() {
		clearInterval(this.polling);
	}
}
</script>

<style lang="less">
.box-selection-container .neuron-container {
	display: inline-block;
	margin: 10px 10px;
}
</style>
