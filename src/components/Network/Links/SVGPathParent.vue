<template>
	<div v-if="display">
		<svg preserveAspectRatio="none" :style="computeStyle" :width="width" :height="height" xmlns="http://www.w3.org/2000/svg">
			<g @contextmenu.prevent="$emit('contextmenu', parent.parentUUID, $event)" v-for="(parent, id) in parents" :key="id" >
				<path :d="path(parent.coords)" stroke-width="1" vector-effect="non-scaling-stroke" stroke="#7fa3ff" fill="transparent"/>
				<path :d="path(parent.coords)" stroke-width="5" vector-effect="non-scaling-stroke" stroke="transparent" fill="transparent"/>
			</g>
		</svg>
	</div>
</template>

<script>
export default {
	name: 'SVGPathParent',
	props: [ 'parentsRef', 'centerRef' ],
	data() {
		return {
			parents: [],
			centerCoords: {},
			polling: null,
			display: false
		}
	},
	computed: {
		handleZone() {
			let handleZone = {};
			if (this.parents.length > 0) {
				handleZone = this.parents.reduce((acc, curr) => {
					return {
						minX: Math.min(acc.minX, curr.coords.x),
						maxX: Math.max(acc.maxX, curr.coords.x),
						minY: Math.min(acc.minY, curr.coords.y),
						maxY: Math.max(acc.maxY, curr.coords.y),
					}
				}, { minX: this.parents[0].coords.x, maxX: this.parents[0].coords.x, minY: this.parents[0].coords.y, maxY: this.parents[0].coords.y})

			}
			return handleZone;
		},
		width() {
			let width = 0;

			if (Object.keys(this.handleZone).length > 0 && Object.keys(this.centerCoords).length > 0) {
				const minX = Math.min( this.handleZone.minX, this.centerCoords.x );
				const maxX = Math.max( this.handleZone.maxX, this.centerCoords.x );

				width = maxX - minX + 10;
			}

			return width;
		},

		height() {
			let height = 0;

			if (Object.keys(this.handleZone).length > 0 && Object.keys(this.centerCoords).length > 0) {
				const minY = Math.min( this.handleZone.minY, this.centerCoords.y );
				const maxY = Math.max( this.handleZone.maxY, this.centerCoords.y );
				height = maxY - minY + 10;
			}

			return height;
		},
		computeStyle() {
			const style = {
				position: 'fixed'
			};

			if (Object.keys(this.handleZone).length > 0 && Object.keys(this.centerCoords).length > 0) {
				const minX = Math.min( this.handleZone.minX, this.centerCoords.x );
				const minY = Math.min( this.handleZone.minY, this.centerCoords.y );

				style.left = minX + 4 + 'px';
				style.top = minY + 4 +'px';
			}

			return style;
		}
	},
	methods: {
		path(coords) {
			const rel_coords = {
				parent_x: coords.x - this.handleZone.minX,
				parent_y: coords.y - this.handleZone.minY,
				center_x: this.centerCoords.x - this.handleZone.minX
			}
			if (Object.keys(this.handleZone).length > 0 && Object.keys(this.centerCoords).length > 0)
			return `M ${ rel_coords.parent_x } ${ rel_coords.parent_y } C ${ rel_coords.parent_x } ${ this.height*0.7 }, ${ rel_coords.center_x } ${ this.height*0.3 }, ${ rel_coords.center_x } ${ this.height }`;
			else return "";
		},
		initDOMreactService() {
			this.polling = setInterval(() => {
				if(this.parentsRef && this.parentsRef.length > 0) {
					let parents = this.parentsRef.map(parent => {
						const coords = parent.$el.querySelector('.handle-children').getBoundingClientRect();
						return {
							parentUUID: parent.uuidNeuron,
							coords: {
								x: coords.x,
								y: coords.y
							}
						};
					})
					if ( this.parents !== parents ) this.parents = parents;
					if (this.centerRef) {
						let centerCoords = {};
						const coords = this.centerRef.$el.querySelector('.handle-parent').getBoundingClientRect();
						centerCoords.x = coords.x;
						centerCoords.y = coords.y;
						this.centerCoords = centerCoords;

						this.display = true;
					}
				} else this.display = false;
			}, 100) // OPTIMIZE: Should run much less often BUT straight after a route change
		}
	},
	created() {
		this.initDOMreactService();
	},
	beforeDestroy() {
		clearInterval(this.polling);
	}
}
</script>

<style scoped>
svg {
	position: fixed;
}
</style>
