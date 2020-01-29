<template>
	<div class="box-container">
		<div class="box-header">
			<div class="box-icon-container">
				<div @click="toggle" class="icon-container" :style="{ color: color }">
						<img v-if="iconLink" :src="iconLink" alt="">
						<div v-else>
							<i class="icon" :class="fontAwesomeIcon"></i>
						</div>
				</div>
			</div>
			<div v-if="open" class="box-title-container">
				<div class="box-title">{{ title }}</div>
			</div>
		</div>
		<div v-if="open" class="box-content">
			<slot></slot>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Box',
	props: ['title', 'fontAwesomeIcon', 'iconLink', 'color'],
	data() {
		return {
			open: false
		}
	},
	methods: {
		toggle() { this.open = !this.open }
	}
}
</script>

<style lang="less">
@content-width: 300px;

.box-container {
	box-shadow: 0px 1px 10px #00000036;
	position: relative;
	border-radius: 10px;
	width: min-content;
	z-index: 20;

	.box-header {
		display: grid;
		grid-template-columns: 40px 1fr;
		background: white;
		grid-template-rows: 40px 1fr;
		border-radius: 100px;
		top: -10px;
		position: absolute;
		box-shadow: 0 1px 10px #0000003d;
		width: 100%;

		.box-icon-container {
			position: relative;

			.icon-container {
				position: absolute;
				background: white;
				width: 50px;
				height: 50px;
				border-radius: 50%;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				display: table-cell;
				line-height: 50px;
				font-size: 24px;
				box-shadow: 0 1px 10px #00000070;
				color: #6256f3;
				font-size: 18px;
				cursor: pointer;

				i {
					width: 100%;
					height: 100%;
				}

				img {
					width: 50%;
					position: absolute;
					top: 0;
					left: 0;
					transform: translate(50%, 50%);
				}
			}
		}
		.box-title-container {
			text-align: center;
			vertical-align: middle;
			place-self: stretch;
			display: grid;
			padding-left: 25px;

			.box-title {
 				justify-self: start;
				text-align: left;
				align-self: center;
				font-size: 1.2em;
				width: 100%;
			}
		}
	}

	.box-content {
		width: @content-width;
		padding: 38px 0 12px;
		background: white;
		border-radius: 10px;
	}
}
</style>
