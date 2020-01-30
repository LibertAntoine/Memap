<template>
	<div class="box-favorite-container">
		<vue-draggable-resizable :resizable="false" :x="50" :y="430" :drag-handle="'.box-header'" :enable-native-drag="true">
			<Box :title="'Favorites'" :font-awesome-icon="'star'">
				<Neuron v-for="(uuid, id) in favorites" :key="id" :uuid-neuron="uuid"></Neuron>
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
			favorites: []
		}
	},
	components: {
		Box, Neuron,
		VueDraggableResizable
	},
	methods: {
		fetchFavoritesNeuron() {
			NetworkAPI.getFavoriteNeurons().then( data => {
				this.favorites = data;
			}).catch(err => console.log(err));
		},
		initFetchService() { 
			this.fetchFavoritesNeuron();
			this.polling = setInterval(() => {
				this.fetchFavoritesNeuron();
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
.box-favorite-container .neuron-container {
	display: inline-block;
	margin: 10px 10px;
}
</style>
