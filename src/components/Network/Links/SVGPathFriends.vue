<template>
	<div v-if="display">
		<svg preserveAspectRatio="none" :style="computeStyle" :width="width" :height="height" xmlns="http://www.w3.org/2000/svg">
			<g @contextmenu.prevent="$emit('contextmenu', friend.friendUUID, $event)" v-for="(friend, id) in friends" :key="id" >
				<path :d="path(friend.coords)" stroke-width="2" vector-effect="non-scaling-stroke" stroke="black" fill="transparent"/>
				<path :d="path(friend.coords)" stroke-width="5" vector-effect="non-scaling-stroke" stroke="transparent" fill="transparent"/>
			</g>
		</svg>
	</div>
</template>

<script>
export default {
	name: 'SVGPathFriends',
	props: [ 'friendsRef', 'centerRef' ],
	data() {
		return {
			friends: [],
			centerCoords: {},
			polling: null,
			display: false
		}
	},
	computed: {
		handleZone() {
			let handleZone = {};
			if (this.friends.length > 0) {
				handleZone = this.friends.reduce((acc, curr) => {
					return {
						minX: Math.min(acc.minX, curr.coords.x),
						maxX: Math.max(acc.maxX, curr.coords.x),
						minY: Math.min(acc.minY, curr.coords.y),
						maxY: Math.max(acc.maxY, curr.coords.y),
					}
				}, { minX: this.friends[0].coords.x, maxX: this.friends[0].coords.x, minY: this.friends[0].coords.y, maxY: this.friends[0].coords.y})

			}
			return handleZone;
		},
		width() {
			let width = 0;

			if (Object.keys(this.handleZone).length > 0 && Object.keys(this.centerCoords).length > 0) {
				const minX = Math.min( this.handleZone.minX, this.centerCoords.x );
				const maxX = Math.max( this.handleZone.maxX, this.centerCoords.x );

				width = maxX - minX + 10; // NOTE: +10 because if the two linked neurons are displayed on the same column width will end up being just 0
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
			let style = {};

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
				friend_x: coords.x - this.centerCoords.x,
				friend_y: coords.y - this.handleZone.minY,
				center_x: this.centerCoords.x - this.handleZone.minX,
				center_y: this.centerCoords.y - this.handleZone.minY,
			}
			if (Object.keys(this.handleZone).length > 0 && Object.keys(this.centerCoords).length > 0)
				return `M 0 ${ rel_coords.center_y } C ${ this.width*0.7 } ${ rel_coords.center_y }, ${ this.width*0.3 } ${ rel_coords.friend_y }, ${ rel_coords.friend_x } ${ rel_coords.friend_y }`;
			else return "";
		},
		initDOMreactService() {
			const thisComp = this
			this.polling = setInterval(() => {
				if(thisComp.friendsRef && thisComp.friendsRef.length > 0) {
					let friends = thisComp.friendsRef.map(friend => {
						const coords = friend.$el.querySelector('.handle-friend').getBoundingClientRect();
						return {
							friendUUID: friend.uuidNeuron,
							coords: {
								x: coords.x,
								y: coords.y
							}
						};
					})
					if ( thisComp.friends !== friends ) thisComp.friends = friends;
					if (thisComp.centerRef) {
						let centerCoords = {};
						const coords = thisComp.centerRef.$el.querySelector('.handle-friend').getBoundingClientRect();
						centerCoords.x = coords.x;
						centerCoords.y = coords.y;
						thisComp.centerCoords = centerCoords;
						this.display = true;
					}
				} else this.display = false;
			}, 500) // OPTIMIZE: Should run much less often BUT straight after a route change
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
