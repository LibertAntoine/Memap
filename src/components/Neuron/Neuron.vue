/* OPTIMIZE this updates all the time for unknown reasons */
<template>
	<div @click.ctrl.exact.prevent="toggleSelection" @click.alt.exact="logNeuron" class="neuron-container">
		<router-link :to="{ name: 'NetworkPage', params: {uuidNeuron} }" tag="a" @dblclick.native.prevent event="click">
			<drop @drop="handleDrop" @dragover="handleDragEnter" @dragleave="handleDragLeave" @dragenter="handleDragEnter">
				<div class="neuron-content-container" :class="{ dropzone: isValidDropZone, 'no-dropzone': isForbidenDropZone }" :style="{ borderStyle: (this.neuron && this.neuron.selected) ? 'dashed' : 'solid', borderColor: neuronColor }" >
					<div class="neuron-icon-container" :style="{ backgroundColor: neuronColor }">
						<div v-if="isItFontAwesome">
							<i class="icon" :class="fontAwesomeIcon"></i>
						</div>
						<img v-else-if="iconLink" :src="iconLink" alt="">
					</div>
					<div class="neuron-name-container">
						<input v-if="inputName" @keypress.enter="rename" @focusout="rename" type="text" v-model="neuron.neuron.name">
						<div @dblclick="toggleInput" v-else class="name">
							<div>{{ neuronName }}</div>
						</div>
					</div>
				</div>
			</drop>
			</router-link>
		<drag class="drag-handle" @drag="updateDrag" @dragend="stopDragging" @dragstart="dragLine" :transfer-data="{ type:'parent', uuid: uuidNeuron }">
			<template slot="image">
				<div class="handle handle-parent" :style="{ borderColor: neuronColor }"></div>
			</template>
			<div class="handle handle-parent" :style="{ borderColor: neuronColor }"></div>
		</drag>
		<drag class="drag-handle" @drag="updateDrag" @dragend="stopDragging" @dragstart="dragLine" :transfer-data="{ type:'children', uuid: uuidNeuron }">
		<div class="handle handle-children" :style="{ borderColor: neuronColor }"></div>
			<template slot="image">
				<div class="handle handle-children" :style="{ borderColor: neuronColor }"></div>
			</template>
		</drag>
		<drag class="drag-handle" @drag="updateDrag" @dragend="stopDragging" @dragstart="dragLine" :transfer-data="{ type:'friend', uuid: uuidNeuron }">
			<template slot="image">
				<div class="handle handle-friend" :style="{ borderColor: neuronColor }"></div>
			</template>
			<div class="handle handle-friend" :style="{ borderColor: neuronColor }"></div>
		</drag>
		<svg v-show="draggingHandle" preserveAspectRatio="none" class="svg-line" xmlns="http://www.w3.org/2000/svg">
				<line :x1="coordsStart.x" :y1="coordsStart.y" :x2="coordsMouse.x" :y2="coordsMouse.y" stroke-width="2" vector-effect="non-scaling-stroke" stroke="#7fa3ff" fill="transparent"/>
		</svg>
		<div v-on:click="toggleFavorite" class="favorite-container" v-if="favorite">
			<button class="circular ui icon button">
				<i class="icon star"></i>
			</button>
		</div>
	</div>
</template>

<script>
import NeuronAPI from '@/services/neuron'
import NetworkAPI from '@/services/network'

export default {
	name: 'Neuron',
	props: ['uuidNeuron'],
	data() {
		return {
			polling: null,
			neuron: null,
			inputName: false,
			isValidDropZone: false,
			isForbidenDropZone: false,
			draggingHandle: false,
			coordsStart: { 
				x: 0,
				y: 0
			},
			coordsMouse: {
				x: 0,
				y: 0
			}
		}
	},
	watch: {
		uuidNeuron() {
			this.fetchNeuronData();
		}
	},
	computed: {
		iconLink() {
			if (this.neuron && this.neuron.icon) return `http://localhost:3000/static/icons/${this.neuron.icon.uuid}.${this.neuron.icon.extension}`;
			else return false;
		},
		isItFontAwesome() {
			if (this.neuron) {
				//return ( (this.neuron.icon && this.neuron.icon.extension) || this.neuron.neuron.iconFontAwesome) ? false : true;
				if (this.neuron.icon) return false;
				if (this.neuron.neuron.iconFontAwesome) {
					return true;
				}
				else return false;
			}
			else return false
		},
		fontAwesomeIcon() {
			return ( this.neuron && this.neuron.neuron.iconFontAwesome ) ? this.neuron.neuron.iconFontAwesome : "star"
		},
		favorite() {
			return this.neuron ? this.neuron.favorite : false
		},
		neuronName() {
			/* May not be fetched at this point */
			//if(this.neuron) { return this.neuron.neuron.properties.name; }
			//console.log(this.neuron.neuron)
			return this.neuron ? this.neuron.neuron.name : ""
		},
		neuronColor() {
			return (this.neuron && this.neuron.neuron.color) ? "#"+this.neuron.neuron.color : "#7fa3ff";
		}
	},
	methods: {
		toggleFavorite() {
			NeuronAPI.toggleFavorite(this.uuidNeuron);
		},
		dragLine(transferData, nativeEvent) {
			this.coordsStart.x = nativeEvent.clientX;
			this.coordsStart.y = nativeEvent.clientY;

			this.coordsMouse.x = nativeEvent.clientX;
			this.coordsMouse.y = nativeEvent.clientY;
			this.draggingHandle = true; // NOTE: show the SVG path
		},
		updateDrag(transferData, nativeEvent) {
			this.coordsMouse.x = nativeEvent.clientX;
			this.coordsMouse.y = nativeEvent.clientY;
		},
		stopDragging(transferData, nativeEvent) {
			this.draggingHandle = false;

			/* May be necessary
			this.isForbidenDropZone = false;
			this.isValidDropZone = false;
			*/
		},
		handleDragLeave() {
			this.isForbidenDropZone = false;
			this.isValidDropZone = false;
		},
		handleDragEnter(transferData) {
			if (transferData.type) {
				if (transferData.uuid === this.uuidNeuron) this.isForbidenDropZone = true;
				else this.isValidDropZone = true;
			}
		},
		handleDrop(data) {
			if (this.isValidDropZone) {
				if (data.type === 'parent') NetworkAPI.createRelationship('parent', this.uuidNeuron, data.uuid);
				else if (data.type === 'children') NetworkAPI.createRelationship('parent', data.uuid, this.uuidNeuron);
				else NetworkAPI.createRelationship('friend', data.uuid, this.uuidNeuron);
			}
			this.isForbidenDropZone = false;
			this.isValidDropZone = false;
		},
		rename(...args){
			console.log(args)
			NeuronAPI.renameNeuron(this.uuidNeuron, this.neuron.neuron.name);
			this.inputName = false;
		},
		toggleInput() {
			this.inputName = !this.inputName;
		},
		logNeuron() {
			console.log('Neuron: ', this.neuron);
		},
		toggleSelection() {
			console.log('selecting')
			NeuronAPI.toggleSelection(this.uuidNeuron);
		},
		async fetchNeuronData() {
			this.neuron = await NeuronAPI.getNeuron(this.uuidNeuron);
		},
		initFetchService() { 
			this.fetchNeuronData();
			const neuron = this;
			this.polling = setInterval(async () => {
				const newNeuron = await NeuronAPI.getNeuron(this.uuidNeuron);
				if (!neuron.inputName && ( !this.neuron || newNeuron.neuron.dateEdited > this.neuron.neuron.dateEdited )) neuron.fetchNeuronData();
			}, 100) // OPTIMIZE: Should run much less often BUT straight after a route change
		}
	},
	beforeRouteUpdate(to, from, next) {
		this.neuron = null;
		next()
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
.neuron-container {
	position: relative;
	z-index: 10;

	.neuron-content-container {
		display: grid;
		grid-template-columns: auto 1fr;
		border: 2px solid #7fa3ff;
		border-radius: 10px;
		height: 40px;
		overflow: hidden;
		background: white;

		.neuron-icon-container {
			overflow: hidden;
			background: #7fa3ff;
			padding: 5px;
			width: 50px;
			font-size: 20px;
			line-height: 23px;
			vertical-align: middle;

			img {
				width: 75%;
			}

			.icon {
				color: white;
			}
		}

		.neuron-name-container {
			display: grid;
			place-items: stretch;

			.name {
				padding: 0 10px;
				align-self: center;
			}
		}

		&.no-dropzone {
			background: #EB5757;
		}
		&.dropzone {
			background: #6FCF97;
		}
	}

	> a {
		text-decoration: none;
		color: unset;
		display: contents;
		z-index: 1;
	}


	.handle {
		position: absolute;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		z-index: 1000;
		cursor: pointer;
		border: 2px solid;
		background-color: white;

		&.handle-friend {
			left: -7px;;
			top: 40%;
		}
		&.handle-children {
			right: 50%;
			bottom: -6px;
		}
		&.handle-parent {
			right: 50%;
			top: -6px
		}
	}

	.svg-line {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 99;
		pointer-events: none;
	}

	.favorite-container {
		position: absolute;
		top: -12px;
		right: 10px;

		.ui.button {
			padding: 5px;
			font-size: 10px;
			background: #6256f3;
			color: white;
		}
	}
}
</style>
